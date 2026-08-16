import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from store.models import Product

def seed_images():
    products = Product.objects.all()
    print(f"Updating images for {products.count()} products...")
    
    # We use a reliable placeholder image service that provides game/tech related images
    # We pass the product.id to ensure each game gets a distinct but consistent image
    for product in products:
        cat = product.category.name.lower()
        if cat in ['rpg', 'adventure']:
            img = '/images/rpg.jpg'
        elif cat in ['action', 'fighting']:
            img = '/images/action.jpg'
        elif cat in ['strategy', 'simulation', 'puzzle']:
            img = '/images/strategy.jpg'
        elif cat in ['racing', 'sports']:
            img = '/images/racing.jpg'
        elif cat in ['horror']:
            img = '/images/horror.jpg'
        else:
            img = '/images/action.jpg'
            
        product.cover_image = img
        product.save()
        
    print("All products have been updated with dedicated genre cover images.")

if __name__ == '__main__':
    seed_images()
