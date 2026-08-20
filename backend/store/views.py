from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.db.models import Q
from .models import Category, Product, UserLibrary, Order, OrderItem
from .serializers import CategorySerializer, ProductSerializer, UserLibrarySerializer, CheckoutSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).order_by('-release_date')
        slug = self.request.query_params.get('slug', None)
        search = self.request.query_params.get('search', None)
        category = self.request.query_params.get('category', None)
        
        if slug:
            queryset = queryset.filter(slug=slug)
        if search:
            queryset = queryset.filter(Q(title__icontains=search) | Q(description__icontains=search))
        if category:
            queryset = queryset.filter(category__name__iexact=category)
            
        return queryset

class LibraryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserLibrarySerializer

    def get_queryset(self):
        return UserLibrary.objects.filter(user=self.request.user).order_by('-acquired_at')

class CheckoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CheckoutSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product_ids = serializer.validated_data['product_ids']

        if not product_ids:
            return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        products = Product.objects.filter(id__in=product_ids)
        
        if products.count() != len(product_ids):
            return Response({"detail": "Some products are invalid."}, status=status.HTTP_400_BAD_REQUEST)

        total_amount = sum(p.price for p in products)

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                total_amount=total_amount,
                stripe_charge_id="fake_charge_123", # Mock charge
                address=serializer.validated_data.get('address', ''),
                city=serializer.validated_data.get('city', ''),
                zip_code=serializer.validated_data.get('zip_code', ''),
                payment_method=serializer.validated_data.get('payment_method', '')
            )

            for product in products:
                # Create OrderItem
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    price_at_purchase=product.price
                )

                # Add to UserLibrary if not already owned
                UserLibrary.objects.get_or_create(
                    user=request.user,
                    product=product,
                    defaults={'playtime_minutes': 0}
                )

        return Response({"detail": "Checkout successful!", "order_id": order.id}, status=status.HTTP_201_CREATED)
