from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, LibraryView, CheckoutView, AdminOrderViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'admin-orders', AdminOrderViewSet, basename='admin-orders')

urlpatterns = [
    path('store/checkout/', CheckoutView.as_view(), name='checkout'),
    path('store/library/', LibraryView.as_view(), name='library'),
    path('', include(router.urls)),
]
