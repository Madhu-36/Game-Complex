# 🎮 Game Complex (G-C)

Welcome to **Game Complex (G-C)**! This is a modern, high-performance, and visually stunning gaming storefront with a fully integrated 3D parallax cinematic interface. It features 400+ seeded authentic games, a comprehensive user management system, an AI Chatbot assistant, and an advanced security infrastructure.

## ✨ Key Features

- **Cinematic 3D Parallax Interface**: A breathtaking, edge-to-edge interactive background that tracks cursor movement across the entire application, giving a 360-degree gamer-room feel.
- **Glassmorphism UI**: Beautifully frosted, semi-transparent overlays for the storefront, game details, cart, and authentication pages.
- **Adaptive Security Firewall**: Real-time Redis-backed middleware blocks SQLi, XSS, and Directory Traversal attacks, auto-banning malicious IPs (5 strikes = 1-hour ban).
- **Enterprise Cryptography**: All digital game keys are encrypted at rest using AES-256 (Fernet) to achieve a zero-knowledge database.
- **Advanced API Throttling**: Custom Django REST Framework (DRF) rate limiters mitigate brute-force logins and automated credit card testing.
- **Optimistic Concurrency Control (OCC)**: PostgreSQL row-level locks prevent the double-selling of high-demand items during flash sales using `select_for_update`.
- **Full-Spectrum Checkout**: A dedicated, React-powered checkout flow supporting physical delivery address tracking and versatile payment routing (UPI, COD, Net Banking).

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios, React Router v6.
- **Backend**: Django, Django REST Framework (DRF), SQLite (development).
- **Security & Caching**: Redis (for Firewall and Throttling), AES-256 Encryption.
- **Assets**: Custom branding, immersive background imagery, FreeToGame CDN for game metadata.

---

## 👥 Users & Roles

### Administrator
The system comes with a pre-configured superuser account for complete system administration.
- **Username:** `Madhu_Satish`
- **Password:** `M@dhu.$.36`

**Admin Capabilities:**
- Full access to the Django Admin Panel (`/admin`) and custom Admin Dashboard (`/admin-dashboard`).
- Add, edit, or delete games, categories, and stock.
- View and manage user accounts and orders.
- Monitor security strikes and banned IPs.

### Regular Users
New users can register via the `/register` page. 
- Features: Browse games, search, filter by genres, view game details, add to cart, and checkout.
- Profile: Users have a dedicated Profile page (`/profile`) with customizable profile photos, order history, and a game library.

---

## 🚀 Setup & Installation Instructions

To run this project on your local machine, follow these exact steps:

### 1. Prerequisites
- Install **Python 3.10+** (Ensure it is added to your system PATH)
- Install **Node.js** (v18 or higher)
- Install **Redis** (Required for the Adaptive Security Firewall and API Throttling)

### 2. Backend Setup (Django)
Open a terminal in the project root and navigate to the backend directory:
```bash
cd backend
```
Create and activate a virtual environment:
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
```
Install all required Python packages:
```bash
pip install -r requirements.txt
```
Run database migrations to initialize the database:
```bash
python manage.py migrate
```
Start the Django Server:
```bash
python manage.py runserver
```
*The backend API is now running on `http://localhost:8000`*

### 3. Frontend Setup (React + Vite)
Open a **new** terminal in the project root and navigate to the frontend directory:
```bash
cd frontend
```
Install all Node modules (this may take a minute):
```bash
npm install
```
Start the Vite Development Server:
```bash
npm run dev
```
*The frontend is now running on `http://localhost:5173`*

### 4. Running the Application
- **Storefront**: Open your browser and go to `http://localhost:5173`
- **Admin Panel**: Go to `http://localhost:8000/admin`. Log in using `Madhu_Satish` / `M@dhu.$.36`.

---

## 🛠️ Troubleshooting

- **AI Chatbot is unresponsive**: Make sure you have configured your Gemini API Key in the backend environment variables.
- **Images are not loading**: Ensure you have an active internet connection, as game images are securely fetched from the FreeToGame CDN.
- **Login/Registration errors (Rate Limit)**: If you get locked out during testing, the Adaptive Security Firewall may have banned your IP. You can flush your local Redis server using the command `redis-cli flushall`.

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
