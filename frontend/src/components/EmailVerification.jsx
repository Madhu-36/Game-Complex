import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const EmailVerification = () => {
  const { uid, token } = useParams();
  const [status, setStatus] = useState('Verifying...');
  useEffect(() => {
    axios.post('http://localhost:8000/api/auth/verify-email/', { uid, token })
      .then(() => setStatus('Email verified successfully! You can now log in.'))
      .catch(() => setStatus('Verification link is invalid or expired.'));
  }, [uid, token]);
  return (
    <div className='min-h-[80vh] flex items-center justify-center font-sans'>
      <div className='max-w-md w-full bg-black/60 backdrop-blur-lg p-8 rounded-2xl border border-gray-800 shadow-2xl relative z-10 text-center'>
        <h2 className='text-3xl font-black text-white mb-6'>Email Verification</h2>
        <p className='text-xl text-green-400 mb-8'>{status}</p>
        <Link to='/login' className='w-full inline-block py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors'>Go to Login</Link>
      </div>
    </div>
  );
};

export default EmailVerification;
