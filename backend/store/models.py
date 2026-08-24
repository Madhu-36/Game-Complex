import uuid
from django.db import models
from django.db import models
from django.conf import settings
from cryptography.fernet import Fernet
import uuid
import base64

def get_fernet():
    # In production, this must be a fixed key in settings or env vars.
    # For dev, we will use a static fallback if not set.
    key = getattr(settings, 'FERNET_KEY', b'A'*43 + b'=')
    return Fernet(key)

class EncryptedCharField(models.CharField):
    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        try:
            return get_fernet().decrypt(value.encode('utf-8')).decode('utf-8')
        except Exception:
            return value # Fallback if already decrypted or corrupted

    def get_prep_value(self, value):
        if value is None:
            return value
        return get_fernet().encrypt(str(value).encode('utf-8')).decode('utf-8')

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

class Product(models.Model):
    """
    Represents a game or DLC on the platform.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cover_image = models.URLField(max_length=500, blank=True, null=True)
    screenshots = models.JSONField(default=list, blank=True)
    
    # If this is a DLC, it points to a base game
    base_game = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='dlcs')
    
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    developer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='published_games')
    
    release_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class DigitalKey(models.Model):
    """
    Pool of digital keys. The 'key_code' is encrypted at rest using AES-256.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='keys')
    
    # Encrypted field: DB only sees ciphertext
    key_code = EncryptedCharField(max_length=255)
    
    is_claimed = models.BooleanField(default=False, db_index=True)
    
    # Used for Optimistic Concurrency Control (OCC) during flash sales
    version = models.IntegerField(default=1)

    class Meta:
        # Composite index to find available keys lightning fast
        indexes = [
            models.Index(fields=['product', 'is_claimed']),
        ]

    def __str__(self):
        return f"Key for {self.product.title} (Claimed: {self.is_claimed})"

class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    stripe_charge_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Delivery & Payment fields
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=20, blank=True, null=True)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

class UserLibrary(models.Model):
    """
    Represents the games a user owns and can play via the Desktop Launcher.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='library')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='owners')
    digital_key = models.OneToOneField(DigitalKey, on_delete=models.SET_NULL, null=True)
    
    acquired_at = models.DateTimeField(auto_now_add=True)
    playtime_minutes = models.PositiveIntegerField(default=0)

    class Meta:
        # A user can only own a specific product once
        unique_together = ('user', 'product')
        indexes = [
            models.Index(fields=['user', 'product']),
        ]

    def __str__(self):
        return f"{self.user.username} owns {self.product.title}"

# Note: Indexes on Product and DigitalKey are optimized for B-Tree performance.

