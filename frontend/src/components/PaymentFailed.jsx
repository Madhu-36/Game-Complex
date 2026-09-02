import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailed = () => (
  <div className='max-w-lg mx-auto p-8 bg-black/60 backdrop-blur-lg rounded-xl my-24 border border-red-500/50 relative z-10 shadow-[0_0_50px_rgba(239,68,68,0.2)] text-center'>
    <svg className='w-20 h-20 text-red-500 mx-auto mb-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path></svg>
    <h1 className='text-3xl font-black text-white mb-4'>Payment Failed</h1>
    <p className='text-gray-300 mb-8'>Unfortunately, we couldn't process your payment. Your card may have been declined or the session expired.</p>
    <Link to='/checkout' className='bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity'>Try Again</Link>
  </div>
);

export default PaymentFailed;
