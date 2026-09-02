import React, { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { 
    try {
      if (!localStorage.getItem('cookiesAccepted')) setVisible(true); 
    } catch(e) {}
  }, []);
  
  if (!visible) return null;
  
  const accept = () => { 
    try { localStorage.setItem('cookiesAccepted', 'true'); } catch(e) {}
    setVisible(false); 
  };
  return (
    <div className='fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-gray-900/95 backdrop-blur-xl border border-gray-700 p-6 rounded-2xl shadow-2xl z-[100]'>
      <h3 className='text-white font-bold text-lg mb-2'>Cookies Preferences</h3>
      <p className='text-gray-400 text-sm mb-4'>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
      <div className='flex gap-3'>
        <button onClick={accept} className='flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-colors'>Accept All</button>
        <button onClick={accept} className='flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition-colors'>Essential Only</button>
      </div>
    </div>
  );
};

export default CookieBanner;
