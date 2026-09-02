# 🎮 Game Complex (G-C)
**A Next-Generation E-Commerce Storefront for Digital Games**

[![React](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-5.1.6-092E20?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite)](https://vitejs.dev/)

> *An immersive, high-performance digital gaming marketplace engineered with a focus on seamless user experience, secure transactions, and scalable architecture.*

---

## 🎬 Live Demo & Video Showcase
- **Live Deployment:** [Insert Vercel/Netlify/Render Link Here]
- **Video Walkthrough:** [Insert YouTube/Loom Link Here]

*(Note: Live deployment is currently being finalized. Please refer to local installation instructions below).*

---

## 🚀 Why This Project Stands Out (For Recruiters)
This project was built from the ground up to demonstrate production-ready full-stack capabilities, focusing on modern architectural patterns and robust engineering:

1. **State-of-the-art Frontend:** Built with React 19 and Vite. Features a highly optimized, custom-engineered `framer-motion` VR loading screen, interactive 3D parallax effects, and glassmorphism UI using the bleeding-edge TailwindCSS v4.
2. **Robust Backend:** Powered by Django REST Framework (DRF) with custom JWT Authentication protocols, robust model relationships, and secure API endpoints.
3. **Resilient Error Handling:** Features custom native React Error Boundaries that intercept runtime exceptions, guaranteeing the application never silently crashes to a white screen.
4. **Complete E-Commerce Loop:** From product categorization and search filtering, to a persistent shopping cart context, simulated secure checkout, user profiles, and a role-protected Admin Dashboard.
5. **Security & Privacy First:** Implements route protection, encrypted passwords, local-storage token management, and dynamic legal pages (GDPR-compliant Cookie Banners, Privacy Policies, etc.).

---

## 🏗️ Architecture Overview

The application follows a decoupled client-server architecture:

### Frontend (Client-Side)
- **Framework:** React.js (v19) initialized via Vite for lightning-fast HMR.
- **Routing:** React Router v7 with Custom `ProtectedRoute` wrappers.
- **State Management:** React Context API (`AuthContext`, `CartContext`) for global state without prop-drilling.
- **Styling:** TailwindCSS v4 + Framer Motion for complex animations.
- **Data Fetching:** Axios with JWT Interceptors.

### Backend (Server-Side)
- **Framework:** Django 5.1 with Django REST Framework (DRF).
- **Database:** SQLite (Development) / PostgreSQL-ready (Production).
- **Authentication:** `djangorestframework-simplejwt` for secure token-based access.
- **CORS:** Django CORS Headers strictly configured to allow frontend communication.

---

## ⚙️ Features

- **Dynamic Storefront:** Filter by genres, top sellers, and search queries with instant API responses.
- **User Authentication:** Registration, Login, and persistent sessions using JWT.
- **Shopping Cart:** Add, remove, and calculate totals in real-time.
- **Admin Dashboard:** Role-based access control allowing staff to manage inventory directly from the frontend.
- **Immersive UI:** Parallax background tracking mouse movement, fully responsive design, and cinematic VR loader.

---

## 💻 Local Installation & Deployment

Follow these steps to run the project locally on your machine.

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Madhu-36/Game-Complex.git
cd Game-Complex
```

### 2. Backend Setup
Open a terminal and navigate to the backend directory:
```bash
cd backend
# Create a virtual environment
python -m venv venv

# Activate the virtual environment (Windows)
.\venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Create a superuser (optional, to access Django admin)
python manage.py createsuperuser

# Start the Django server
python manage.py runserver
```
*The backend will now be running at `http://localhost:8000/`.*

### 3. Frontend Setup
Open a **new** terminal and navigate to the frontend directory:
```bash
cd frontend

# Install Node modules
npm install

# Start the Vite development server
npm run dev
```
*The frontend will now be running at `http://localhost:5173/`.*

---

## 🔮 Future Roadmap
- **Stripe Integration:** Replacing the simulated checkout with real payment processing via Stripe API.
- **Dockerization:** Containerizing the frontend and backend with `docker-compose` for 1-click deployments.
- **PostgreSQL Migration:** Swapping out SQLite for a scalable PostgreSQL database.
- **Real-time Chat:** Implementing WebSockets (Django Channels) for live customer support.
- **CI/CD Pipeline:** Automating testing and deployment using GitHub Actions.

---

## 👨‍💻 Author
**Madhu Satish**
- GitHub: [@Madhu-36](https://github.com/Madhu-36)
- *Actively looking for Software Engineering roles.*

---
*If you are a recruiter reviewing this repository, thank you for your time. I am highly passionate about building scalable, user-centric software and would love to discuss how I can bring value to your engineering team.*
