from django.contrib.auth.models import AbstractUser
from django.db import models
from decimal import Decimal

class User(AbstractUser):
    """
    Custom User model for Game Complex platform.
    Extends Django's default AbstractUser to add custom fields.
    """
    wallet_balance = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=Decimal('0.00'),
        help_text="The user's current platform wallet balance."
    )
    is_developer = models.BooleanField(
        default=False, 
        help_text="Designates whether the user has access to the Publisher Portal."
    )
    profile_photo = models.ImageField(
        upload_to='profiles/', 
        blank=True, 
        null=True, 
        help_text="The user's profile picture."
    )
    is_email_verified = models.BooleanField(
        default=False,
        help_text="Designates whether the user has verified their email address."
    )
    
    def __str__(self):
        return self.username
