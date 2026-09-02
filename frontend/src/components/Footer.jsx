import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className='bg-black/80 backdrop-blur-md border-t border-gray-800 text-gray-400 py-8 mt-auto z-10 relative'>
    <div className='max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8'>
      <div><h3 className='text-white font-bold mb-4'>G-C</h3><p className='text-sm'>Your ultimate cinematic gaming storefront.</p></div>
      <div><h4 className='text-white font-bold mb-4'>Support</h4><ul className='space-y-2 text-sm'><li><Link to='/payment-failed' className='hover:text-green-400'>Payment Issues</Link></li><li><Link to='/reset-password' className='hover:text-green-400'>Reset Password</Link></li></ul></div>
      <div><h4 className='text-white font-bold mb-4'>Legal</h4><ul className='space-y-2 text-sm'><li><Link to='/privacy' className='hover:text-green-400'>Privacy Policy</Link></li><li><Link to='/terms' className='hover:text-green-400'>Terms of Service</Link></li><li><Link to='/refunds' className='hover:text-green-400'>Refund Policy</Link></li></ul></div>
      <div><h4 className='text-white font-bold mb-4'>Company</h4><ul className='space-y-2 text-sm'><li><Link to='/about' className='hover:text-green-400'>About Us</Link></li></ul></div>
    </div>
    <div className='text-center text-xs mt-8'>&copy; 2026 Game Complex. All rights reserved.</div>
  </footer>
);

export default Footer;
