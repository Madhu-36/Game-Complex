# Game Complex

A modern, high-performance gaming storefront with an integrated AI Chatbot assistant, 414 seeded authentic games, and a complete user management system.

## 🚀 Key Technical Features
- **Adaptive Security Firewall**: Real-time Redis-backed middleware that blocks SQLi, XSS, and Directory Traversal attacks, auto-banning malicious IPs.
- **Enterprise Cryptography**: All digital game keys are encrypted at rest using AES-256 (Fernet) to achieve a zero-knowledge database.
- **Advanced API Throttling**: Custom DRF rate limiters to completely mitigate brute-force logins and automated credit card testing.
- **Full-Spectrum Checkout**: A dedicated, React-powered checkout flow supporting physical delivery address tracking and versatile payment routing (UPI, COD, Net Banking).
- **Optimistic Concurrency Control (OCC)**: PostgreSQL row-level locks prevent double-selling of high-demand items during flash sales.
- **Admin & user

## Setup Instructions for a New Machine

To run this project on a new computer after downloading it from GitHub, follow these exact steps:

### 1. Prerequisites
- Install **Python 3.10+** (Ensure it is added to your PATH)
- Install **Node.js** (v18 or higher)

### 2. Backend Setup (Django)
Open a terminal in the project root and navigate to the backend directory:
```bash
cd backend
```
Create a virtual environment:
```bash
python -m venv venv
```
Activate the virtual environment:
- On **Windows**: `venv\Scripts\activate`
- On **Mac/Linux**: `source venv/bin/activate`

Install all required Python packages:
```bash
pip install -r requirements.txt
```

Run database migrations:
```bash
python manage.py migrate
```

Start the Django Server:
```bash
python manage.py runserver
```
*The backend is now running on http://localhost:8000*

### 3. Frontend Setup (React + Vite)
Open a **new** terminal in the project root and navigate to the frontend directory:
```bash
cd frontend
```
Install all Node modules (this will take a minute):
```bash
npm install
```

Start the Vite Development Server:
```bash
npm run dev
```
*The frontend is now running on http://localhost:5173*

### 4. Exploring the App
- **Storefront**: Go to `http://localhost:5173`
- **Admin Panel**: Go to `http://localhost:8000/admin`. (You can log in using `Madhu_Satish` / `M@dhu.$.36` if the database was uploaded, or create a new superuser via `python manage.py createsuperuser`).

### Troubleshooting
- If the AI Chatbot is unresponsive, make sure you configure your Gemini API Key in the backend.
- If images are not loading, ensure you have an active internet connection as they are securely fetched from the FreeToGame CDN.

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
