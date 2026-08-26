import React from 'react';
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
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="App bg-gray-900 min-h-screen relative">
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
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App;

/* Application Routing Configuration */

