import os
import django
import requests
import random
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from store.models import Category, Product

User = get_user_model()

def seed_real_games():
    print("Clearing old dummy data to ensure no mistakes or duplicated images...")
    Product.objects.all().delete()
    Category.objects.all().delete()
    
    admin_user = User.objects.get(username='admin')
    
    print("Fetching real video game data from FreeToGame API...")
    response = requests.get('https://www.freetogame.com/api/games')
    games_data = response.json()
    
    # We will grab up to 300 games
    games_data = games_data[:300]
    prices = [9.99, 14.99, 19.99, 29.99, 39.99, 49.99, 59.99]
    
    print(f"Seeding {len(games_data)} real games into the database...")
    count = 0
    for game in games_data:
        genre_name = game.get('genre', 'Uncategorized').strip()
        
        # Get or create category
        category, _ = Category.objects.get_or_create(
            name=genre_name,
            defaults={'slug': genre_name.lower().replace(' ', '-').replace('/', '-')}
        )
        
        title = game.get('title', 'Unknown Title')
        slug = title.lower().replace(' ', '-').replace(':', '').replace("'", "")
        # Ensure slug uniqueness
        if Product.objects.filter(slug=slug).exists():
            slug = f"{slug}-{game.get('id')}"
            
        Product.objects.create(
            title=title,
            slug=slug,
            description=game.get('short_description', 'No description available.'),
            price=Decimal(str(random.choice(prices))),
            cover_image=game.get('thumbnail'),
            category=category,
            developer=admin_user,
        )
        count += 1
        
    print(f"Success! {count} real games with exact matching cover images have been seeded.")

if __name__ == '__main__':
    seed_real_games()
