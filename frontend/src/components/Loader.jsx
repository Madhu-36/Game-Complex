import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col justify-center items-center overflow-hidden z-[100]">
      <div className="relative w-64 h-64 flex justify-center items-center mb-8">
        
        {/* Floating Digital Particles in background */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-purple-500 rounded-sm mix-blend-screen shadow-[0_0_10px_rgba(168,85,247,0.8)] z-0"
            animate={{
              y: [0, -200],
              x: [(i - 2.5) * 40, (i - 2.5) * 80],
              opacity: [0, 0.8, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear"
            }}
            style={{ bottom: "20%" }}
          />
        ))}

        {/* VR User SVG */}
        <svg viewBox="0 0 200 200" className="w-56 h-56 z-10">
          {/* Body/Shoulders */}
          <path d="M40 180 Q100 120 160 180" stroke="#3b82f6" strokeWidth="8" fill="none" strokeLinecap="round" />
          
          {/* Head & VR Headset */}
          <motion.g
            animate={{ rotate: [-8, 8, -8], x: [-3, 3, -3], y: [0, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "100px 90px" }}
          >
            {/* Head Outline */}
            <circle cx="100" cy="85" r="35" fill="#1f2937" stroke="#3b82f6" strokeWidth="4" />
            
            {/* Hair (Boy style) */}
            <path d="M 65 80 Q 80 40 100 45 Q 120 40 135 80 Q 100 50 65 80" fill="#3b82f6" />
            
            {/* VR Headset Strap */}
            <path d="M 65 85 L 135 85" stroke="#4b5563" strokeWidth="6" />

            {/* VR Headset Visor */}
            <rect x="70" y="70" width="60" height="30" rx="8" fill="#111827" stroke="#8b5cf6" strokeWidth="3" />
            
            {/* Glowing VR Lenses Display */}
            <motion.rect 
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              x="76" y="76" width="48" height="18" rx="4" fill="#a855f7" 
              className="drop-shadow-[0_0_12px_rgba(168,85,247,0.9)]"
            />
          </motion.g>

          {/* Left Arm & Controller */}
          <motion.g
            animate={{ 
              x: [-15, -40, -15], 
              y: [10, -20, 10],
              rotate: [0, -30, 0]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "60px 130px" }}
          >
            {/* Arm */}
            <path d="M70 135 Q40 140 30 100" stroke="#3b82f6" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* Hand/Controller Base */}
            <circle cx="30" cy="100" r="10" fill="#111827" stroke="#8b5cf6" strokeWidth="3" />
            {/* VR Tracking Ring (Halo) */}
            <path d="M30 90 A 14 14 0 0 0 16 104" stroke="#a855f7" strokeWidth="3" fill="none" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"/>
          </motion.g>

          {/* Right Arm & Controller */}
          <motion.g
            animate={{ 
              x: [15, 30, 15], 
              y: [0, -40, 0],
              rotate: [0, 40, 0]
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            style={{ transformOrigin: "140px 130px" }}
          >
            {/* Arm */}
            <path d="M130 135 Q160 140 170 90" stroke="#3b82f6" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* Hand/Controller Base */}
            <circle cx="170" cy="90" r="10" fill="#111827" stroke="#8b5cf6" strokeWidth="3" />
            {/* VR Tracking Ring (Halo) */}
            <path d="M170 80 A 14 14 0 0 1 184 94" stroke="#a855f7" strokeWidth="3" fill="none" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"/>
          </motion.g>
        </svg>
      </div>

      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-fuchsia-400 tracking-widest uppercase text-center drop-shadow-lg"
      >
        ENTERING VR<br/><span className="text-sm font-medium text-gray-400 tracking-normal drop-shadow-none">Syncing Game Complex...</span>
      </motion.h2>
    </div>
  );
};

export default Loader;
