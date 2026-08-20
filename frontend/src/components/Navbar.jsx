import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      alert("Please log in to checkout.");
      navigate('/login');
      setIsCartOpen(false);
      return;
    }
    
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const cartTotal = cartItems.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 tracking-tighter hover:from-green-300 hover:to-emerald-500 transition-colors">
              GAME<span className="text-white">COMPLEX</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block ml-10 flex-1">
            <div className="flex items-center space-x-8">
              <div className="relative group">
                <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none flex items-center gap-1 transition-colors">
                  Genres
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {/* Dropdown menu */}
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-2xl bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                  <div className="py-2">
                    <Link to="/?category=Action" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Action</Link>
                    <Link to="/?category=RPG" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">RPG</Link>
                    <Link to="/?category=Strategy" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Strategy</Link>
                    <Link to="/?category=Racing" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Racing</Link>
                  </div>
                </div>
              </div>
              <Link to="/?category=Action" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Top Sellers
              </Link>
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                New Releases
              </Link>
            </div>
          </div>

          {/* Search Bar & Right Side */}
          <div className="flex items-center gap-6">
            <form onSubmit={handleSearch} className="hidden lg:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-64 pl-10 pr-3 py-2 border border-gray-700 rounded-full leading-5 bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 sm:text-sm transition-colors"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Cart Icon */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors focus:outline-none group"
            >
              <svg className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-green-500 rounded-full border-2 border-gray-900">
                  {cartItems.length}
                </span>
              )}
            </button>
            
            {/* User Profile / Login */}
            {user ? (
              <div className="relative group flex items-center">
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
                  {user.profile_photo ? (
                      <img src={`http://localhost:8000${user.profile_photo}`} alt="Profile" className="h-9 w-9 rounded-full border-2 border-gray-800 object-cover shadow-lg" />
                  ) : (
                      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 border-2 border-gray-800 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {user.username.charAt(0).toUpperCase()}
                      </div>
                  )}
                </Link>
                {/* Profile Dropdown */}
                <div className="absolute right-0 top-10 mt-2 w-48 rounded-xl shadow-2xl bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 border border-gray-700">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-700 mb-1">
                      <p className="text-sm font-bold text-white truncate">{user.username}</p>
                      <p className="text-xs text-green-400">Pro Member</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">My Profile</Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Game Library</Link>
                    <button onClick={() => { localStorage.removeItem('access_token'); window.location.href = '/login'; }} className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors border-t border-gray-700 mt-1">Sign Out</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-bold text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-700 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-800 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-gray-800">
                <h2 className="text-2xl font-black text-white">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <p className="text-xl font-bold text-gray-400 mb-2">Your cart is empty</p>
                    <p>Looks like you haven't added any games yet.</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-gray-800/50 p-3 rounded-xl border border-gray-700 items-center">
                      <img src={item.cover_image} alt={item.title} className="w-20 h-20 object-cover rounded-lg shadow-md" />
                      <div className="flex-1">
                        <h4 className="font-bold text-white line-clamp-1">{item.title}</h4>
                        <p className="text-green-400 font-bold mt-1">${item.price}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                        title="Remove from Cart"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 border-t border-gray-800 bg-gray-900/90 backdrop-blur-md">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400 font-medium text-lg">Total</span>
                    <span className="text-3xl font-black text-white">${cartTotal}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-green-500/25 transition-all text-lg flex justify-center items-center gap-2"
                  >
                    {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                    {!isCheckingOut && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
