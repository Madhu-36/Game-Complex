import requests
import sys

def check_health():
    try:
        response = requests.get('http://localhost:8000/api/store/categories/')
        if response.status_code == 200:
            print("Backend is healthy")
            sys.exit(0)
    except:
        pass
    print("Backend is down")
    sys.exit(1)

if __name__ == '__main__':
    check_health()