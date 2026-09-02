import React, { useState } from 'react';
import axios from 'axios';
import { FiMail } from 'react-icons/fi';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/auth/reset-password/', { email });
      setMessage('If an account with that email exists, we have sent a reset link.');
    } catch(err) {
      setMessage('An error occurred. Please try again.');
    }
  };
  return (
    <div className='min-h-[80vh] flex items-center justify-center font-sans'>
      <div className='max-w-md w-full bg-black/60 backdrop-blur-lg p-8 rounded-2xl border border-gray-800 shadow-2xl relative z-10'>
        <h2 className='text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-6'>Reset Password</h2>
        {message && <div className='mb-4 p-3 bg-green-500/20 text-green-300 rounded text-center'>{message}</div>}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='relative group'>
            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-400'><FiMail /></div>
            <input type='email' placeholder='Enter your email' className='w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 text-white rounded-xl focus:outline-none focus:border-green-500' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type='submit' className='w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors'>Send Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetRequest;
