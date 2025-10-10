'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const DiwaliFloatingBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed left-4 bottom-20 z-40"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Banner Container */}
          <motion.div
            animate={{
              scale: isHovered ? 1.05 : 1,
              rotateY: isHovered ? 5 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="relative bg-gradient-to-br from-orange-500 via-yellow-500 to-red-600 rounded-lg shadow-2xl overflow-hidden cursor-pointer group"
            style={{ width: '280px', height: '350px' }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 z-10 bg-black/20 hover:bg-black/40 rounded-full p-1 transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <XMarkIcon className="w-4 h-4 text-white" />
            </button>

            {/* Banner Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-6 text-white">
              {/* SVG Banner */}
              <div className="mb-4">
                <img 
                  src="/diwali_banner.svg" 
                  alt="Diwali Banner" 
                  className="w-32 h-32 object-contain filter drop-shadow-lg"
                />
              </div>

              {/* Text Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold mb-3 text-yellow-100">
                  Happy Diwali!
                </h3>
                <p className="text-base text-yellow-200 leading-tight">
                  Festival of Lights
                </p>
              </div>

              {/* Sparkle Animation */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                    style={{
                      top: `${20 + (i * 15)}%`,
                      left: `${10 + (i * 12)}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Hover Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-red-400/20"
              animate={{
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Floating Animation */}
          <motion.div
            className="absolute inset-0"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DiwaliFloatingBanner;