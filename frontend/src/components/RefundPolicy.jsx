import React from 'react';

const RefundPolicy = () => (
  <div className='max-w-4xl mx-auto p-8 bg-black/60 backdrop-blur-lg rounded-xl my-12 border border-gray-800 relative z-10 shadow-2xl'>
    <h1 className='text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-6'>Refund & Cancellation Policy</h1>
    <div className='text-gray-300 space-y-4 leading-relaxed'>
      <p>We offer a flexible refund policy for our digital goods under specific conditions.</p>
      <h2 className='text-2xl text-white font-bold mt-6'>Digital Games</h2>
      <p>Refunds can be requested within 14 days of purchase, provided the game has been played for less than 2 hours.</p>
      <h2 className='text-2xl text-white font-bold mt-6'>Cancellations</h2>
      <p>Pre-orders can be cancelled at any time before the game's release date for a full refund.</p>
    </div>
  </div>
);

export default RefundPolicy;
