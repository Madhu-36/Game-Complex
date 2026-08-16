import React from 'react';

const ImageBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Dark overlay to ensure text is readable over the epic image */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      <img
        src="/images/wukong_bg.jpg"
        alt="Black Myth Wukong Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
};

export default ImageBackground;
