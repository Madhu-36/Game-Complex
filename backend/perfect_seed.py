import os
import django
import random
import uuid
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from store.models import Category, Product, DigitalKey

User = get_user_model()

def get_genre_keywords(genre):
    mapping = {
        'RPG': 'fantasy,rpg',
        'Action': 'action,combat',
        'Strategy': 'strategy,tactical',
        'Simulation': 'simulation,city',
        'Sports': 'sports,stadium',
        'Puzzle': 'puzzle,abstract',
        'Adventure': 'adventure,landscape',
        'Horror': 'horror,dark',
        'Racing': 'racing,car',
        'Fighting': 'fighting,martialarts'
    }
    return mapping.get(genre, 'gaming,videogame')

def generate_unique_titles(count):
    adjectives = ['Dark', 'Neon', 'Cyber', 'Steel', 'Galactic', 'Ancient', 'Quantum', 'Shadow', 'Iron', 'Crystal', 'Phantom', 'Eternal', 'Blood', 'Cosmic', 'Lunar', 'Solar', 'Void', 'Shattered', 'Crimson', 'Lost', 'Fallen', 'Rise of', 'Call of', 'Age of', 'World of', 'Legend of', 'Mythic', 'Epic', 'Grand', 'Super', 'Mega', 'Ultra', 'Hyper', 'Final', 'First', 'Last', 'Next', 'Future', 'Past', 'Hidden', 'Secret', 'Forbidden', 'Cursed', 'Blessed', 'Sacred', 'Unholy', 'Divine', 'Mortal', 'Immortal', 'Deadly', 'Lethal', 'Fatal', 'Toxic', 'Venomous', 'Poisonous', 'Radioactive', 'Nuclear', 'Atomic', 'Subatomic', 'Dimensional', 'Multiversal', 'Infinite', 'Unbound', 'Awakened', 'Sleeping', 'Broken', 'Forged', 'Golden', 'Silver', 'Bronze', 'Platinum', 'Diamond', 'Ruby', 'Sapphire', 'Emerald']
    nouns = ['Odyssey', 'Empire', 'Racer', 'Knight', 'Dawn', 'Fall', 'Chronicles', 'Protocol', 'Strike', 'Legends', 'Quest', 'Revenge', 'Legacy', 'Souls', 'Hearts', 'Frontier', 'Echoes', 'Vanguard', 'Horizon', 'Warrior', 'Mage', 'Thief', 'Hunter', 'Assassin', 'Sniper', 'Shooter', 'Fighter', 'Brawler', 'Runner', 'Driver', 'Pilot', 'Captain', 'Commander', 'General', 'King', 'Queen', 'Prince', 'Princess', 'Emperor', 'Empress', 'God', 'Goddess', 'Demon', 'Devil', 'Angel', 'Spirit', 'Ghost', 'Wraith', 'Specter', 'Zombie', 'Vampire', 'Werewolf', 'Monster', 'Beast', 'Dragon', 'Wyrm', 'Serpent', 'Snake', 'Spider', 'City', 'Planet', 'Galaxy', 'Universe', 'Realm', 'Dimension', 'Kingdom', 'Castle', 'Dungeon', 'Labyrinth', 'Maze', 'Tower', 'Spire', 'Fortress', 'Citadel', 'Sanctuary', 'Asylum', 'Prison', 'Tomb', 'Grave', 'Crypt']
    suffixes = ['Awakening', 'Retribution', 'Origins', 'The Last Stand', 'Definitive Edition', 'Reloaded', 'Unbound', 'Infinite', 'Zero', 'X', 'Y', 'Z', 'Alpha', 'Beta', 'Omega', 'Prime', 'Genesis', 'Evolution', 'Revolution', 'Rebirth', 'Resurrection', 'Redemption', 'Salvation', 'Damnation', 'Destruction', 'Creation', 'Annihilation', 'Oblivion', 'Eternity', 'Infinity', 'Ascension', 'Descension', 'Eclipse', 'Equinox', 'Solstice', 'Nova', 'Supernova', 'Black Hole', 'Singularity', 'Event Horizon']
    
    titles = set()
    while len(titles) < count:
        if random.random() > 0.5:
            title = f"{random.choice(adjectives)} {random.choice(nouns)}"
        else:
            title = f"{random.choice(adjectives)} {random.choice(nouns)}: {random.choice(suffixes)}"
        titles.add(title)
        
    return list(titles)

def perfect_seed():
    dev = User.objects.get(username='admin')

    genres = [
        'RPG', 'Action', 'Strategy', 'Simulation', 'Sports', 
        'Puzzle', 'Adventure', 'Horror', 'Racing', 'Fighting'
    ]
    
    prices = [9.99, 14.99, 19.99, 29.99, 39.99, 49.99, 59.99, 69.99]
    
    print("Wiping existing database to ensure a perfect slate...")
    Product.objects.all().delete()
    Category.objects.all().delete()
    
    total_games_needed = 10 * 150
    print(f"Generating {total_games_needed} strictly unique game titles...")
    unique_titles = generate_unique_titles(total_games_needed)
    title_idx = 0
    
    print("Generating 150 games per genre with highly unique, genre-specific images...")
    
    total_count = 0
    image_lock = 1
    
    for g in genres:
        cat, _ = Category.objects.get_or_create(name=g, slug=g.lower())
        keywords = get_genre_keywords(g)
        
        for _ in range(150):
            title = unique_titles[title_idx]
            title_idx += 1
            
            slug = title.lower().replace(' ', '-').replace(':', '')
            
            # Using LoremFlickr to fetch a unique, genre-specific image via the 'lock' parameter
            cover_image = f"https://loremflickr.com/800/600/{keywords}/all?lock={image_lock}"
            image_lock += 1
            
            price = Decimal(str(random.choice(prices)))
            
            Product.objects.create(
                slug=slug,
                title=title,
                description=f"Experience {title}, an epic {cat.name} masterpiece that will keep you on the edge of your seat. Incredible gameplay, stunning graphics, and unmatched storytelling.",
                price=price,
                cover_image=cover_image,
                category=cat,
                developer=dev,
            )
            total_count += 1
            
    print(f"Perfect seed complete! {total_count} completely unique games generated with genre-specific images.")

if __name__ == '__main__':
    perfect_seed()
