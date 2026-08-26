import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Storefront from './components/Storefront';
import GameDetails from './components/GameDetails';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    // Subtle global shift
    const x = (e.clientX / window.innerWidth - 0.5) * 20; 
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div 
            className="App min-h-screen relative font-sans text-white overflow-hidden bg-gray-900"
            onMouseMove={handleMouseMove}
          >
            {/* Global Parallax Background */}
            <div 
              className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-200 ease-out z-0 pointer-events-none"
              style={{ 
                backgroundImage: "url('/images/auth-bg.jpg')",
                transform: `scale(1.05) translate(${-mousePos.x}px, ${-mousePos.y}px)`
              }}
            />
            {/* Global Dark Overlay so the storefront remains readable */}
            <div className="fixed inset-0 bg-black/60 z-0 pointer-events-none backdrop-blur-[2px]"></div>
            
            <div className="relative z-10 h-screen overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <Navbar />
              <Routes>
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Storefront /></ProtectedRoute>} />
                <Route path="/game/:slug" element={<ProtectedRoute><GameDetails /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App;
