'use client';

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Pause, X, ZoomIn, ArrowRight } from 'lucide-react';

interface Hotspot {
  id: string;
  top: string;
  left: string;
  title: string;
  content: string;
}

interface HouseInspectionTourProps {
  onDownloadModalOpen?: () => void;
}

// Create a memoized Hotspot component for better performance
const Hotspot = memo(({ 
  hotspot, 
  isActive, 
  onMouseEnter, 
  onMouseLeave,
  onClick,
  isVisible
}: { 
  hotspot: Hotspot, 
  isActive: boolean, 
  onMouseEnter: () => void, 
  onMouseLeave: () => void,
  onClick: () => void,
  isVisible: boolean
}) => {
  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
        isVisible 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-0'
      }`}
      style={{
        top: hotspot.top,
        left: hotspot.left
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Hotspot Button - Reduced size */}
      <button 
        className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg hover:bg-orange-600 hover:scale-110 transition-all duration-200 relative touch-manipulation"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-75"></div>
      </button>

      {/* Tooltip */}
      {isActive && (
        <div 
          className="absolute z-10 w-64 bg-white rounded-lg shadow-xl p-4 border border-gray-200 pointer-events-none"
          style={{
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '10px'
          }}
        >
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
          <h3 className="font-bold text-gray-900 text-sm mb-2">
            {hotspot.title}
          </h3>
          <p className="text-black text-xs leading-relaxed">
            {hotspot.content}
          </p>
        </div>
      )}
    </div>
  );
});

Hotspot.displayName = 'Hotspot';

const HouseInspectionTour: React.FC<HouseInspectionTourProps> = ({ onDownloadModalOpen }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [hotspotsVisible, setHotspotsVisible] = useState(false);
  const [visibleHotspotIndexes, setVisibleHotspotIndexes] = useState<number[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [wasCarouselResumed, setWasCarouselResumed] = useState(false);
  const [hoverCounter, setHoverCounter] = useState(0); // New counter for hovers
  const [initialGarageShown, setInitialGarageShown] = useState(false); // Track if garage was initially shown

  // Sample report images
  const sampleReportImages = [
    '/sample_report/enhanced_sample_report_1.png',
    '/sample_report/enhanced_sample_report_2.png',
    '/sample_report/enhanced_sample_report_3.png',
    '/sample_report/enhanced_sample_report_4.png',
    '/sample_report/enhanced_sample_report_5.png'
  ];

  // Updated hotspot data with new content and evenly distributed positions
  const hotspots: Hotspot[] = useMemo(() => [
    {
      id: 'window',
      top: '20%',
      left: '28%',
      title: 'Window Inspection',
      content: 'Check for cracks in glass, frame damage, smooth operation, proper locking, and signs of water leakage or air drafts. Clean tracks and lubricate hinges.'
    },
    
    {
      id: 'terrace',
      top: '15%',
      left: '55%',
      title: 'Terrace Inspection',
      content: 'Check for cracks, water leakage, drainage blockages, and tile or surface damage. Inspect waterproofing and railing safety.'
    },
    {
      id: 'structure',
      top: '40%',
      left: '29%',
      title: 'Structure Inspection',
      content: 'Check for wall cracks, slab or beam damage, dampness, seepage, and overall building stability. Inspect plaster quality and alignment of walls and ceilings.'
    },
    {
      id: 'door',
      top: '43%',
      left: '34%',
      title: 'Door Inspection',
      content: 'Check for alignment, smooth opening/closing, hinge condition, lock functionality, and any signs of damage or termite infestation.'
    },
    {
      id: 'exterior-siding',
      top: '43%',
      left: '10%',
      title: 'Exterior Siding Inspection',
      content: 'For cracks, dampness, loose panels, paint peel, or seepage on outer wall finishes.'
    },
    {
      id: 'garage',
      top: '67%',
      left: '85%',
      title: 'Garage Door',
      content: 'Check springs, pulleys, rollers, track, and motor. Test remote and safety sensor. Grease moving parts.'
    },
    {
      id: 'plumbing',
      top: '56%',
      left: '34%',
      title: 'Plumbing Inspection',
      content: 'Check for pipe leaks, water pressure, tap and flush function, drainage flow, and signs of rust or blockage in pipelines.'
    },
    {
      id: 'hvac',
      top: '65%',
      left: '22%',
      title: 'HVAC Inspection',
      content: 'Check AC cooling, leaks, drainage; fans for operation; heaters for safety; ventilation for airflow and cleanliness.'
    },
    {
      id: 'electrical',
      top: '65%',
      left: '47%',
      title: 'Electrical Inspection',
      content: 'Check wiring, switchboards, MCBs, earthing, socket polarity, and proper functioning of lights, fans, and appliances. Look for loose connections or exposed wires.'
    },
    {
      id: 'flooring',
      top: '84%',
      left: '50%',
      title: 'Flooring Inspection',
      content: 'Check for cracks, hollow tiles, uneven surfaces, loose edges, and proper grouting. Look for water stains or dampness, especially near bathrooms and kitchens.'
    },
    {
      id: 'kitchen',
      top: '75%',
      left: '70%',
      title: 'Kitchen Inspection',
      content: 'Check countertop and cabinet condition, sink drainage, tap function, wall tiles, chimney/exhaust fan, electrical points, and gas line safety. Look for leaks or dampness under the sink.'
    },
    {
      id: 'foundation',
      top: '90%',
      left: '65%',
      title: 'Foundation Inspection',
      content: 'Check for visible cracks, settling, dampness, or water seepage in plinth area, basement, or ground level walls. Look for signs of structural movement or soil erosion.'
    }
  ], []);

  // Animate hotspots in batches for better performance
  useEffect(() => {
    // Initial delay before starting animations
    const initialTimer = setTimeout(() => {
      setHotspotsVisible(true);
      
      // Show hotspots in batches of 3 for better performance
      const batchSize = 3;
      const totalHotspots = hotspots.length;
      
      for (let i = 0; i < Math.ceil(totalHotspots / batchSize); i++) {
        setTimeout(() => {
          setVisibleHotspotIndexes(prev => {
            const newIndexes = [...prev];
            for (let j = 0; j < batchSize; j++) {
              const index = i * batchSize + j;
              if (index < totalHotspots) {
                newIndexes.push(index);
              }
            }
            return newIndexes;
          });
        }, i * 200); // 200ms delay between batches
      }
    }, 500);
    
    return () => clearTimeout(initialTimer);
  }, [hotspots.length]);

  // Show garage door hotspot initially after hotspots are loaded
  useEffect(() => {
    if (hotspotsVisible && visibleHotspotIndexes.length === hotspots.length && !initialGarageShown && hoverCounter === 0) {
      const garageTimer = setTimeout(() => {
        setActiveTooltip('garage');
        setInitialGarageShown(true);
      }, 1000); // Show garage tooltip 1 second after all hotspots are visible
      
      return () => clearTimeout(garageTimer);
    }
  }, [hotspotsVisible, visibleHotspotIndexes.length, hotspots.length, initialGarageShown, hoverCounter]);

  // Auto-slide carousel using sample images count
  useEffect(() => {
    if (isCarouselPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sampleReportImages.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [sampleReportImages.length, isCarouselPaused]);

  // Close tooltip when clicking outside hotspots
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if the click is on a hotspot button or its children
      const isHotspotClick = target.closest('button') && 
                            target.closest('[data-hotspot]');
      
      // If not clicking on a hotspot, close all tooltips
      if (!isHotspotClick) {
        setActiveTooltip(null);
      }
    };

    // Add event listeners to document
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('touchend', handleClickOutside, true);
    
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('touchend', handleClickOutside, true);
    };
  }, []);

  // Memoize handlers to prevent recreation on each render
  const handleMouseEnter = useCallback((hotspotId: string) => {
    // Only show on hover for desktop (non-touch devices)
    if (!('ontouchstart' in window)) {
      setActiveTooltip(hotspotId);
      setHoverCounter(prev => prev + 1); // Increment counter on hover
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Only hide on mouse leave for desktop (non-touch devices)
    if (!('ontouchstart' in window)) {
      setActiveTooltip(null);
    }
  }, []);

  // New handler for hotspot click/touch - always opens the clicked hotspot
  const handleHotspotClick = useCallback((hotspotId: string) => {
    setActiveTooltip(hotspotId);
    setHoverCounter(prev => prev + 1); // Increment counter on click/touch
  }, []);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + sampleReportImages.length) % sampleReportImages.length);
  }, [sampleReportImages.length]);

  const handleNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sampleReportImages.length);
  }, [sampleReportImages.length]);

  const toggleCarousel = useCallback(() => {
    setIsCarouselPaused(!isCarouselPaused);
  }, [isCarouselPaused]);

  const handleCarouselClick = useCallback(() => {
    // Store the current state before opening full screen
    setWasCarouselResumed(!isCarouselPaused);
    setIsFullScreen(true);
    setIsCarouselPaused(true);
  }, [isCarouselPaused]);

  const closeFullScreen = useCallback(() => {
    setIsFullScreen(false);
    // Resume carousel if it was playing before expansion
    if (wasCarouselResumed) {
      setIsCarouselPaused(false);
    }
  }, [wasCarouselResumed]);

  // Handle click outside to close fullscreen (like WhatsApp)
  const handleFullScreenBackdropClick = useCallback((e: React.MouseEvent) => {
    // Only close if clicking on the backdrop, not on the image or controls
    if (e.target === e.currentTarget) {
      closeFullScreen();
    }
  }, [closeFullScreen]);

  // Handle download button click
  const handleDownloadClick = useCallback(() => {
    if (onDownloadModalOpen) {
      onDownloadModalOpen();
    }
  }, [onDownloadModalOpen]);

  return (
    <>
      {/* Main Section */}
      <div className="w-full bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
              Home Inspection Tour
            </h2>
            <div className="h-1 w-24 mt-3 mb-6 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>

          {/* Content Layout: Report on left (30%), House image on right (70%) with minimal gap */}
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            {/* Left Side - A4 Document Carousel - 30% width */}
            <div className="w-full lg:w-[30%] flex flex-col mb-10">
              <div className="flex-1 flex flex-col">
                {/* A4 Document Display */}
                <div className="flex-1 flex items-center justify-center p-2">
                  {/* A4 Paper Container - Responsive sizing */}
                  <div 
                    className="bg-white relative cursor-pointer hover:scale-105 transition-all duration-300 rounded-lg overflow-hidden group shadow-lg w-full"
                    style={{
                      maxWidth: '280px', // Reduced max width
                      aspectRatio: '210/297', // A4 ratio
                    }}
                    onClick={handleCarouselClick}
                  >
                    {/* Sample Document Image */}
                    <div className="w-full h-full relative">
                      <Image 
                        src={sampleReportImages[currentSlide]}
                        alt={`Sample report ${currentSlide + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3">
                          <ZoomIn size={20} className="text-orange-500" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Navigation Controls Overlay */}
                    <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-80 hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePrevSlide(); }}
                        className="p-1 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-orange-500 transition-colors"
                        aria-label="Previous document"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleCarousel(); }}
                        className="p-1 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-orange-500 transition-colors"
                        aria-label={isCarouselPaused ? "Play carousel" : "Pause carousel"}
                      >
                        {isCarouselPaused ? <Play size={14} /> : <Pause size={14} />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleNextSlide(); }}
                        className="p-1 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-orange-500 transition-colors"
                        aria-label="Next document"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Slide Indicators and Controls */}
                <div className="p-3 bg-transparent">
                  <div className="flex justify-center space-x-2 mb-3">
                    {sampleReportImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-orange-500 scale-125' 
                            : 'bg-gray-300 hover:bg-orange-300'
                        }`}
                        aria-label={`Go to document ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="text-center text-xs text-gray-600 mb-4">
                    <span className="font-medium">Sample Report Preview {currentSlide + 1}</span> of {sampleReportImages.length}
                  </div>
                  
                  {/* Download Sample Report Button */}
                  <div className="text-center">
                    <button 
                      onClick={handleDownloadClick}
                      className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 w-full" 
                    > 
                      <span>Download Sample Report</span> 
                      <ArrowRight size={14} /> 
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - House Image with Hotspots - 70% width */}
            <div className="w-full lg:w-[70%] flex items-end">
              <div className="relative w-full">
                {/* House Image */}
                <Image 
                  src="/PicturesforCheckaro/frontpage/house_image.png" 
                  alt="House Illustration" 
                  width={1200}
                  height={800} 
                  className="w-full h-auto block rounded-lg"
                /> 
                
                {/* Hotspots - Positioned absolutely relative to the image */}
                <div className="absolute inset-0" data-hotspot>
                  {hotspots.map((hotspot, index) => (
                    <Hotspot 
                      key={hotspot.id}
                      hotspot={hotspot}
                      isActive={activeTooltip === hotspot.id}
                      onMouseEnter={() => handleMouseEnter(hotspot.id)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleHotspotClick(hotspot.id)}
                      isVisible={hotspotsVisible && visibleHotspotIndexes.includes(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Modal - Improved layout without bottom thumbnail bar */}
      {isFullScreen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={handleFullScreenBackdropClick}
        >
          {/* Close Button */}
          <button
            onClick={closeFullScreen}
            className="absolute top-4 right-4 z-10 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          {/* Page Counter - Top Left */}
          <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white text-sm font-medium">
              {currentSlide + 1} / {sampleReportImages.length}
            </span>
          </div>

          {/* Main Image Container - Full height with proper padding */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Left Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevSlide(); }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Main Document Image - Properly sized to fit screen */}
            <div 
              className="max-w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={sampleReportImages[currentSlide]}
                alt={`Document ${currentSlide + 1}`}
                width={800}
                height={1131}
                className="max-w-full max-h-full object-contain"
                style={{
                  maxHeight: 'calc(100vh - 2rem)', // Account for padding
                  maxWidth: 'calc(100vw - 8rem)', // Account for arrow buttons
                }}
              />
            </div>

            {/* Right Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); handleNextSlide(); }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Export as memoized component to prevent unnecessary re-renders from parent
export default memo(HouseInspectionTour);