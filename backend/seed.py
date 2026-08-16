import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from store.models import Category, Product

User = get_user_model()

def seed():
    # Create Superuser
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("Superuser 'admin' created (password: admin123).")

    # Create Categories
    rpg, _ = Category.objects.get_or_create(name='RPG', slug='rpg')
    action, _ = Category.objects.get_or_create(name='Action', slug='action')
    strategy, _ = Category.objects.get_or_create(name='Strategy', slug='strategy')

    # Get admin user for developer field
    dev = User.objects.get(username='admin')

    # Create Products
    products_data = [
        {'title': 'Cyber Odyssey', 'slug': 'cyber-odyssey', 'description': 'A massive open-world cyberpunk RPG.', 'price': '59.99', 'category': rpg},
        {'title': 'Steel & Blood', 'slug': 'steel-blood', 'description': 'Intense medieval combat simulator.', 'price': '39.99', 'category': action},
        {'title': 'Galactic Empire', 'slug': 'galactic-empire', 'description': 'Conquer the stars in this grand strategy epic.', 'price': '49.99', 'category': strategy},
        {'title': 'Neon Racer', 'slug': 'neon-racer', 'description': 'High-speed synthwave racing.', 'price': '19.99', 'category': action},
    ]

    for p_data in products_data:
        p, created = Product.objects.get_or_create(
            title=p_data['title'],
            defaults={
                'slug': p_data['slug'],
                'description': p_data['description'],
                'price': p_data['price'],
                'category': p_data['category'],
                'developer': dev,
            }
        )
        if created:
            print(f"Created product: {p.title}")

if __name__ == '__main__':
    seed()
    print("Database seeded successfully!")
