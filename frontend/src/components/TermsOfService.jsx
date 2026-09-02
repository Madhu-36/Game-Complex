import React from 'react';

const TermsOfService = () => (
  <div className='max-w-4xl mx-auto p-8 bg-black/60 backdrop-blur-lg rounded-xl my-12 border border-gray-800 relative z-10 shadow-2xl'>
    <h1 className='text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-6'>Terms of Service</h1>
    <div className='text-gray-300 space-y-4 leading-relaxed'>
      <p>By accessing Game Complex, you agree to abide by these terms.</p>
      <h2 className='text-2xl text-white font-bold mt-6'>Account Rules</h2>
      <p>You are responsible for maintaining the security of your account credentials.</p>
    </div>
  </div>
);

export default TermsOfService;
