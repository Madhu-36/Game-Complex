import os
import django
import requests
import concurrent.futures
import time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from store.models import Product

def fetch_details_for_game(product):
    try:
        # FreeToGame IDs are stored in the slug when we seeded them if they conflicted.
        # But we can just use the thumbnail URL to extract the ID since it is always like:
        # https://www.freetogame.com/g/327/thumbnail.jpg
        if not product.cover_image:
            return
            
        parts = product.cover_image.split('/')
        if 'g' in parts:
            idx = parts.index('g')
            game_id = parts[idx + 1]
            
            response = requests.get(f'https://www.freetogame.com/api/game?id={game_id}')
            if response.status_code == 200:
                data = response.json()
                screenshots = data.get('screenshots', [])
                # Store just the URLs to keep DB size small
                product.screenshots = [s.get('image') for s in screenshots if s.get('image')]
                product.save(update_fields=['screenshots'])
                print(f"Updated {product.title} with {len(product.screenshots)} screenshots.")
            else:
                print(f"Failed to fetch {product.title}: API returned {response.status_code}")
                
    except Exception as e:
        print(f"Error fetching for {product.title}: {e}")

def seed_screenshots():
    products = list(Product.objects.all())
    print(f"Fetching screenshots for {len(products)} games concurrently...")
    
    start_time = time.time()
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        executor.map(fetch_details_for_game, products)
        
    print(f"Finished fetching all screenshots in {time.time() - start_time:.2f} seconds!")

if __name__ == '__main__':
    seed_screenshots()
