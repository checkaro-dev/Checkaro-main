'use client';

import React, { useRef, useEffect, useState } from 'react';

interface CursorAwareBorderProps {
  children: React.ReactNode;
  className?: string;
  borderWidth?: number;
  borderColor?: string;
  glowIntensity?: number;
  animationDuration?: number;
}

const CursorAwareBorder: React.FC<CursorAwareBorderProps> = ({
  children,
  className = '',
  borderWidth = 2,
  borderColor = '#f97316', // orange-500
  glowIntensity = 50,
  animationDuration = 3000,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileAngle, setMobileAngle] = useState(0);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile auto-animation
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        setMobileAngle(prev => (prev + 2) % 360);
      }, 16); // ~60fps
      
      return () => clearInterval(interval);
    }
  }, [isMobile]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isMobile) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
    }
  };

  const getGradientPosition = () => {
    if (isMobile) {
      // Convert angle to x,y coordinates for mobile animation
      const radians = (mobileAngle * Math.PI) / 180;
      const x = 50 + 50 * Math.cos(radians);
      const y = 50 + 50 * Math.sin(radians);
      return { x, y };
    }

    if (!containerRef.current || !isHovered) {
      return { x: 50, y: 50 };
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = (mousePosition.x / rect.width) * 100;
    const y = (mousePosition.y / rect.height) * 100;
    
    return { x, y };
  };

  const { x, y } = getGradientPosition();
  
  const gradientStyle = {
    background: `
      radial-gradient(
        ${glowIntensity}px circle at ${x}% ${y}%,
        ${borderColor}${isMobile || isHovered ? 'FF' : '40'},
        ${borderColor}${isMobile || isHovered ? 'AA' : '20'} 30%,
        transparent 70%
      )
    `,
    transition: isMobile ? 'none' : 'background 0.2s ease-out',
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        borderRadius: 'inherit',
      }}
    >
      {/* Border overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          padding: `${borderWidth}px`,
          borderRadius: 'inherit',
          ...gradientStyle,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default CursorAwareBorder;