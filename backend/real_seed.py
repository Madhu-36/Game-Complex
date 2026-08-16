import os
import django
import json
import random
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from store.models import Category, Product

User = get_user_model()

def real_seed():
    dev = User.objects.get(username='admin')
    
    print("Wiping existing database to remove all fake/repeating games and broken images...")
    Product.objects.all().delete()
    Category.objects.all().delete()

    with open('../freetogame.json', 'r', encoding='utf-8') as f:
        games_data = json.load(f)
        
    print(f"Loaded {len(games_data)} REAL games from FreeToGame API.")
    
    # We want to group them into exactly 10 clean genres as requested previously.
    target_genres = ['RPG', 'Action', 'Strategy', 'Simulation', 'Sports', 'Puzzle', 'Adventure', 'Horror', 'Racing', 'Fighting']
    categories = {}
    for g in target_genres:
        cat, _ = Category.objects.get_or_create(name=g, slug=g.lower())
        categories[g] = cat
        
    prices = [9.99, 14.99, 19.99, 29.99, 39.99, 49.99, 59.99]
    
    count = 0
    used_titles = set()
    
    for game in games_data:
        title = game.get('title')
        if title in used_titles:
            continue
        used_titles.add(title)
        
        # Map FreeToGame genre to one of our 10 target genres
        raw_genre = game.get('genre', 'Action').lower()
        mapped_genre = 'Action'
        if 'rpg' in raw_genre or 'mmo' in raw_genre: mapped_genre = 'RPG'
        elif 'strategy' in raw_genre or 'moba' in raw_genre: mapped_genre = 'Strategy'
        elif 'sports' in raw_genre: mapped_genre = 'Sports'
        elif 'racing' in raw_genre: mapped_genre = 'Racing'
        elif 'fighting' in raw_genre: mapped_genre = 'Fighting'
        elif 'shooter' in raw_genre or 'action' in raw_genre: mapped_genre = 'Action'
        elif 'survival' in raw_genre or 'horror' in raw_genre: mapped_genre = 'Horror'
        elif 'simulation' in raw_genre: mapped_genre = 'Simulation'
        elif 'puzzle' in raw_genre: mapped_genre = 'Puzzle'
        else: mapped_genre = 'Adventure'
        
        cat = categories[mapped_genre]
        slug = title.lower().replace(' ', '-').replace(':', '').replace('.', '').replace('\'', '')
        
        Product.objects.create(
            slug=slug,
            title=title,
            description=game.get('short_description', 'An incredible game.'),
            price=Decimal(str(random.choice(prices))),
            cover_image=game.get('thumbnail'),
            category=cat,
            developer=dev,
        )
        count += 1
        
    print(f"Successfully seeded {count} perfectly authentic, 100% unique games with REAL cover images!")

if __name__ == '__main__':
    real_seed()
