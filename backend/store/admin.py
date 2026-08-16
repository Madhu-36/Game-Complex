from django.contrib import admin
from .models import Category, Product, DigitalKey, Order, OrderItem, UserLibrary

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    raw_id_fields = ['product']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'category', 'developer', 'is_active', 'release_date']
    list_filter = ['is_active', 'category']
    search_fields = ['title', 'developer__username']
    prepopulated_fields = {'slug': ('title',)}
    raw_id_fields = ['developer', 'base_game']

@admin.register(DigitalKey)
class DigitalKeyAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'is_claimed', 'version']
    list_filter = ['is_claimed', 'product']
    # We do NOT display the key_code here by default for security, 
    # even though it's encrypted in the DB.
    exclude = ['key_code']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_amount', 'created_at', 'stripe_charge_id']
    list_filter = ['created_at']
    search_fields = ['user__username', 'stripe_charge_id']
    inlines = [OrderItemInline]

@admin.register(UserLibrary)
class UserLibraryAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'acquired_at', 'playtime_minutes']
    list_filter = ['acquired_at', 'product']
    search_fields = ['user__username', 'product__title']
    raw_id_fields = ['user', 'product', 'digital_key']
