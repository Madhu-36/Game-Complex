import os
import django
import random
import uuid
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from store.models import Category, Product

User = get_user_model()

def mass_seed():
    dev = User.objects.get(username='admin')

    # Exactly 10 Genres
    genres = [
        'RPG', 'Action', 'Strategy', 'Simulation', 'Sports', 
        'Puzzle', 'Adventure', 'Horror', 'Racing', 'Fighting'
    ]
    
    prefixes = ['Dark', 'Neon', 'Cyber', 'Steel', 'Galactic', 'Ancient', 'Quantum', 'Shadow', 'Iron', 'Crystal', 'Phantom', 'Eternal', 'Blood', 'Cosmic', 'Lunar', 'Solar', 'Void', 'Shattered', 'Crimson', 'Lost']
    nouns = ['Odyssey', 'Blood', 'Empire', 'Racer', 'Knight', 'Dawn', 'Fall', 'Chronicles', 'Protocol', 'Strike', 'Legends', 'Quest', 'Revenge', 'Legacy', 'Souls', 'Hearts', 'Frontier', 'Echoes', 'Vanguard', 'Horizon']
    
    prices = [9.99, 14.99, 19.99, 29.99, 39.99, 49.99, 59.99, 69.99]
    
    print("Generating 150 games per genre for 10 genres (1500 games total)...")
    
    created_slugs = set()
    Product.objects.all().delete() # Clean up existing products to prevent massive pileups or duplicate slugs
    Category.objects.all().delete() # Clean up existing categories

    total_count = 0
    
    for g in genres:
        cat, _ = Category.objects.get_or_create(name=g, slug=g.lower())
        
        # Create 150 unique games for this category
        count = 0
        while count < 150:
            title = f"{random.choice(prefixes)} {random.choice(nouns)}"
            slug = title.lower().replace(' ', '-')
            
            # Decide if we add a subtitle to help make slugs unique
            if random.random() > 0.5:
                subtitle = f": {random.choice(['Awakening', 'Retribution', 'Origins', 'The Last Stand', 'Definitive Edition', 'Reloaded', 'Unbound', 'Infinite'])}"
                title += subtitle
                slug += '-' + subtitle.lower().replace(' ', '-').replace(':', '')
                
            # Add a random number to slug to absolutely guarantee uniqueness across 1500 generations
            slug += f"-{random.randint(1000, 9999)}"
            
            if slug in created_slugs:
                continue
                
            created_slugs.add(slug)
            
            price = Decimal(str(random.choice(prices)))
            
            Product.objects.create(
                slug=slug,
                title=title,
                description=f"An epic {cat.name} game experience that redefines the genre. Embark on a journey like no other in {title}.",
                price=price,
                category=cat,
                developer=dev,
            )
            count += 1
            total_count += 1

    print(f"Mass seed complete! {total_count} games generated.")

if __name__ == '__main__':
    mass_seed()
