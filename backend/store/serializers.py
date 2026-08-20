from rest_framework import serializers
from .models import Category, Product, UserLibrary

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    developer_name = serializers.CharField(source='developer.username', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'title', 'slug', 'description', 'price', 'cover_image', 'screenshots', 'category_name', 'developer_name', 'release_date', 'is_active']

class UserLibrarySerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = UserLibrary
        fields = ['id', 'product', 'acquired_at', 'playtime_minutes']

class CheckoutSerializer(serializers.Serializer):
    product_ids = serializers.ListField(
        child=serializers.UUIDField()
    )
    address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    zip_code = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.CharField(required=False, allow_blank=True)
