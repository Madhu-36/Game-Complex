import React from 'react';

const PrivacyPolicy = () => (
  <div className='max-w-4xl mx-auto p-8 bg-black/60 backdrop-blur-lg rounded-xl my-12 border border-gray-800 relative z-10 shadow-2xl'>
    <h1 className='text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-6'>Privacy Policy</h1>
    <div className='text-gray-300 space-y-4 leading-relaxed'>
      <p>Your privacy is important to us. This policy outlines how we collect, use, and protect your data.</p>
      <h2 className='text-2xl text-white font-bold mt-6'>Information We Collect</h2>
      <p>We collect information you provide directly to us when registering, purchasing, or communicating with support.</p>
      <h2 className='text-2xl text-white font-bold mt-6'>How We Use It</h2>
      <p>Your data is used to provide and improve our services, process transactions, and send related information.</p>
    </div>
  </div>
);

export default PrivacyPolicy;
