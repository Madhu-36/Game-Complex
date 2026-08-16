import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from store.models import Product

def update_five_games():
    # Pick 5 specific games to make completely unique for verification
    products = list(Product.objects.all()[:5])
    
    unique_data = [
        {
            "title": "Ancient Empire",
            "description": "Lead your civilization from the stone age to the space age in this deeply strategic 4X historical simulator.",
            "cover_image": "https://picsum.photos/seed/ancientempire/600/400"
        },
        {
            "title": "Blood Blood",
            "description": "A visceral, fast-paced arena shooter where reflexes and tactical positioning mean the difference between life and death.",
            "cover_image": "https://picsum.photos/seed/bloodblood/600/400"
        },
        {
            "title": "Iron Souls",
            "description": "An unforgiving action-RPG set in a dark fantasy world of rust and ruin. Master the intricate combat system to survive.",
            "cover_image": "https://picsum.photos/seed/ironsouls/600/400"
        },
        {
            "title": "Quantum Horizon",
            "description": "Explore the mind-bending realities of parallel dimensions in this narrative-driven sci-fi puzzle adventure.",
            "cover_image": "https://picsum.photos/seed/quantumhorizon/600/400"
        },
        {
            "title": "Neon Syndicate",
            "description": "Build and manage your own criminal empire in a sprawling cyberpunk metropolis. Bribe, hack, and fight your way to the top.",
            "cover_image": "https://picsum.photos/seed/neonsyndicate/600/400"
        }
    ]
    
    for i, data in enumerate(unique_data):
        if i < len(products):
            product = products[i]
            product.title = data["title"]
            product.description = data["description"]
            product.cover_image = data["cover_image"]
            product.save()
            print(f"Updated: {product.title}")

if __name__ == '__main__':
    update_five_games()
