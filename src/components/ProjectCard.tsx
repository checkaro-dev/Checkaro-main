'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface Project {
  id: string;
  crnNumber: string;
  projectName: string;
  serviceType: string;
  image: string;
  videoUrl: string;
  videoId?: string;
  description: string;
  thumbnailUrl?: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  isCenter: boolean;
  position: number;
  translateY: number;
  translateZ: number;
  scale: number;
  opacity: number;
  zIndex: number;
  onClick: (index: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  isCenter,
  position,
  translateY,
  translateZ,
  scale,
  opacity,
  zIndex,
  onClick
}) => {
  // Use state to track viewport width
  const [isMobile, setIsMobile] = useState(false);
  
  // Effect to set mobile state based on window width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      key={project.id}
      className={`sm:absolute sm:left-0 sm:right-0 flex-shrink-0 sm:flex-shrink-auto cursor-pointer transition-all duration-500 rounded-xl overflow-hidden shadow-lg transform-gpu mx-2 sm:mx-0 ${isCenter ? 'shadow-xl ring-2 ring-orange-500' : ''}`}
      onClick={() => onClick(index)}
      style={{
        transform: `${isMobile 
          ? `translateX(${position * 160}px) translateZ(${translateZ}px)` 
          : `translateY(${position * 160}px) translateZ(${position === 0 ? 0 : -100}px)`
        } scale(${scale})`,
        opacity,
        zIndex,
        top: isMobile ? 'auto' : '40%',  // Position slightly higher than center (was 50%)
        marginTop: isMobile ? '0' : '-120px', // Reduced offset to show more of lower items
        width: isMobile ? '85%' : 'auto',
        margin: isMobile ? '0 4px' : '0 auto', // Center horizontally with auto margins
        left: isMobile ? 'auto' : '0',
        right: isMobile ? 'auto' : '0'
      }}
    >
      {/* Project Thumbnail */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
        <img 
          src={project.thumbnailUrl} 
          alt={project.projectName}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            // Fallback if image doesn't exist
            e.currentTarget.src = 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded mb-2">
            {project.crnNumber}
          </span>
          <h4 className="text-white text-lg font-bold">{project.projectName}</h4>
        </div>
      </div>
      
      <div className="p-4 bg-white">
        <p className="text-black text-sm">
          {project.serviceType} - {project.description.substring(0, 60)}...
        </p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-gray-500">{isCenter ? 'Currently playing' : 'Click to view'}</span>
          {isCenter ? (
            <Pause className="h-4 w-4 text-orange-500" />
          ) : (
            <Play className="h-4 w-4 text-orange-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
