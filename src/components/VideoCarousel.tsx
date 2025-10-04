'use client';

import React, { useState, useRef, memo, useCallback, useEffect } from 'react';
import { ChevronUp, ChevronDown, Play, Pause } from 'lucide-react';

interface Project {
  id: string;
  videoUrl: string;
  videoId?: string;
  projectName: string;
  description: string;
  thumbnailUrl?: string;
  serviceType?: string;
}

// Memoized YouTube Video component to reduce memory usage
const MemoizedYouTubeVideo = memo(({ videoId, isActive }: { videoId: string, isActive: boolean }) => {
  // Only render iframe when active to save memory
  if (!videoId) return null;
  
  return (
    <iframe
      className="absolute inset-0 w-full h-full"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=${isActive ? '1' : '0'}&mute=1&rel=0&modestbranding=1`}
      title="YouTube Video"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
    ></iframe>
  );
});

MemoizedYouTubeVideo.displayName = 'MemoizedYouTubeVideo';

interface VideoCarouselProps {
  projects: Project[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ 
  projects, 
  currentIndex, 
  onIndexChange 
}) => {
  const [isVideoError, setIsVideoError] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  
  // Track mobile state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Video error handler
  const handleVideoError = useCallback((projectId: string) => {
    setIsVideoError(prev => ({ ...prev, [projectId]: true }));
  }, []);

  return (
    <div className="relative sm:h-[650px] overflow-hidden bg-white" ref={videoContainerRef}>
      {/* Container with proper perspective and centering */}
      <div className="relative h-full w-full flex sm:block overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 no-scrollbar" style={{ perspective: '1000px' }}>
        {projects.map((project, index) => {
          // Calculate position: -1 for above, 0 for center, 1 for below
          let position = 0;
          if (index === (currentIndex - 1 + projects.length) % projects.length) {
            position = -1; // Above center
          } else if (index === currentIndex) {
            position = 0;  // Center
          } else if (index === (currentIndex + 1) % projects.length) {
            position = 1;   // Below center
          } else {
            return null; // Don't render other items
          }
          
          // Calculate styles for perfect symmetry
          const isCenter = position === 0;
          const translateY = position * 160; // Symmetric spacing
          const translateX = isMobile ? position * 160 : 0; // Mobile horizontal scroll
          const translateZ = isCenter ? 0 : -80; // Subtle depth
          const rotateX = isMobile ? 0 : position * -5; // Subtle 3D rotation for desktop
          const scale = isCenter ? 1 : 0.9; // Subtle scaling
          const opacity = isCenter ? 1 : 0.8; // Subtle fade
          const zIndex = isCenter ? 30 : 20 - Math.abs(position);
          
          const videoId = project.videoId || 
            (project.videoUrl && project.videoUrl.includes('youtube.com/watch?v=')
              ? project.videoUrl.split('v=')[1].split('&')[0]
              : null);
          
          return (
            <div
              key={project.id}
              className={`${isMobile ? 'flex-shrink-0' : 'absolute inset-x-0'} cursor-pointer transition-all duration-500 rounded-xl overflow-hidden shadow-lg transform-gpu mx-2 sm:mx-auto ${isCenter ? 'shadow-2xl ring-2 ring-orange-500' : 'shadow-md'}`}
              onClick={() => !isCenter && onIndexChange(index)}
              style={{
                transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`,
                opacity,
                zIndex,
                top: isMobile ? 'auto' : '50%',
                marginTop: isMobile ? '0' : '-160px', // Half of approximate card height
                width: isMobile ? '280px' : '90%',
                maxWidth: isMobile ? '280px' : '500px',
                height: 'auto'
              }}
            >
              {/* YouTube Player */}
              <div className="relative w-full bg-black rounded-t-xl" style={{ paddingBottom: '56.25%' }}>
                {videoId ? (
                  isCenter ? (
                    <MemoizedYouTubeVideo videoId={videoId} isActive={isCenter} />
                  ) : (
                    // Enhanced thumbnail for non-active videos
                    <div 
                      className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden group"
                      style={{
                        backgroundImage: project.thumbnailUrl ? `url(${project.thumbnailUrl})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-25 transition-all duration-300"></div>
                      <div className="relative z-10">
                        <div className="bg-orange-500 rounded-full p-4 group-hover:scale-110 group-hover:bg-orange-400 transition-all duration-300 shadow-xl">
                          <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-center text-black">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gray-400 rounded-full flex items-center justify-center">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-sm font-medium">Video Unavailable</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Video-only display - no captions */}
            </div>
          );
        })}
      </div>
      
      {/* Enhanced Navigation Controls */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-6">
        <button 
          className="w-full h-20 bg-gradient-to-b from-white/90 via-white/50 to-transparent flex items-start justify-center pt-4 pointer-events-auto opacity-80 hover:opacity-100 transition-all duration-200"
          onClick={() => onIndexChange((currentIndex - 1 + projects.length) % projects.length)}
          disabled={projects.length <= 1}
        >
          <div className="bg-white backdrop-blur-md rounded-full p-3 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 border border-gray-100">
            <ChevronUp className="text-black hover:text-orange-500 transition-colors" size={24} />
          </div>
        </button>
        
        <button 
          className="w-full h-20 bg-gradient-to-t from-white/90 via-white/50 to-transparent flex items-end justify-center pb-4 pointer-events-auto opacity-80 hover:opacity-100 transition-all duration-200"
          onClick={() => onIndexChange((currentIndex + 1) % projects.length)}
          disabled={projects.length <= 1}
        >
          <div className="bg-white backdrop-blur-md rounded-full p-3 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 border border-gray-100">
            <ChevronDown className="text-black hover:text-orange-500 transition-colors" size={24} />
          </div>
        </button>
      </div>
      
      {/* Enhanced Progress Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex 
                ? 'bg-orange-500 w-8 h-3' 
                : 'bg-gray-300 hover:bg-gray-400 w-3 h-3'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoCarousel;