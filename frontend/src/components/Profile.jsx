import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [library, setLibrary] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('access_token');
      axios.get('http://localhost:8000/api/store/library/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setLibrary(res.data))
      .catch(err => console.error("Failed to fetch library", err));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('profile_photo', file);

    try {
      const token = localStorage.getItem('access_token');
      await axios.patch('http://localhost:8000/api/auth/me/', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      // Refresh page to load new image in AuthContext
      window.location.reload();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload profile photo.");
      setIsUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <div className={`w-32 h-32 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-5xl font-black text-white shadow-2xl border-4 border-gray-900 z-10 overflow-hidden ${isUploading ? 'opacity-50' : ''}`}>
              {user.profile_photo ? (
                <img src={`http://localhost:8000${user.profile_photo}`} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <span className="text-white text-xs font-bold text-center">Change<br/>Avatar</span>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>
          
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-4xl font-black text-white mb-2">{user.username}</h1>
            <p className="text-gray-400 text-lg mb-4">{user.email}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <span className="bg-green-500/10 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Wallet: ${user.wallet_balance || "0.00"}
              </span>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold transition-colors">
                Add Funds
              </button>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="z-10 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
          >
            Sign Out
          </button>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Settings */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Account Settings</h3>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 bg-transparent hover:bg-gray-700 rounded-xl text-gray-300 font-medium transition-colors">Edit Profile</button>
              <button className="w-full text-left px-4 py-3 bg-transparent hover:bg-gray-700 rounded-xl text-gray-300 font-medium transition-colors">Payment Methods</button>
              <button className="w-full text-left px-4 py-3 bg-transparent hover:bg-gray-700 rounded-xl text-gray-300 font-medium transition-colors">Security & Passwords</button>
              <button className="w-full text-left px-4 py-3 bg-green-900/20 text-green-400 border border-green-500/30 rounded-xl font-bold transition-colors">Purchase History ({library.length})</button>
            </div>
          </motion.div>

          {/* Right Column: Library */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Your Library ({library.length})</h3>
            
            {library.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <p className="text-lg">Your library is empty.</p>
                <Link to="/" className="text-green-500 hover:text-green-400 font-bold mt-2 inline-block">Browse Store</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {library.map(entry => (
                  <Link to={`/game/${entry.product.slug}`} key={entry.id} className="group relative rounded-xl overflow-hidden shadow-lg border border-gray-700 aspect-video bg-transparent">
                    {entry.product.cover_image && (
                      <img src={entry.product.cover_image} alt={entry.product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent flex flex-col justify-end p-4">
                      <h4 className="text-white font-bold text-lg">{entry.product.title}</h4>
                      <p className="text-gray-300 text-sm">{entry.playtime_minutes} minutes played</p>
                      <button className="mt-2 bg-green-500 hover:bg-green-400 text-white text-sm font-bold py-2 rounded shadow-lg transition-colors">
                        Launch
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
