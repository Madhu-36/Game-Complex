import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

# Delete if exists to recreate
User.objects.filter(username="Madhu_Satish").delete()

# Create superuser
User.objects.create_superuser("Madhu_Satish", "madhu@gamecomplex.com", "M@dhu.$.36")
print("Superuser Madhu_Satish created successfully.")
