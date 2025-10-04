'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircleIcon, HomeIcon, VideoCameraIcon, DocumentTextIcon, WrenchScrewdriverIcon, UserGroupIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon, PlayIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import BookingModal from '../../components/BookingModal';
import Footer from '../../components/Footer';

// Custom Quote Icon Component
const QuoteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
  </svg>
);

// Helper components for app store icons
const AppleStoreIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 384 512" fill="currentColor" height="1em" width="1em" {...props}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C39.2 141.6 0 184.2 0 241.7c0 61.6 31.5 112.6 61.2 150.9 29.7 38.3 62.5 77.3 99.8 77.3 37.2 0 40.7-24.8 77.8-24.8 37.1 0 43.7 24.8 78.3 24.8 35.5 0 69.3-38.3 98.8-76.8 21.4-28.2 33.2-56.1 33.2-89.5zM212.2 93.3c15.6-16.7 33.1-33.2 51.6-42.3-20.7-9.3-43.7-3.3-56.6 10-13.3 13.3-23.3 33.3-25.8 52.3-2.5 19 6.2 38.3 15.6 51.6 19.7 27.8 44.3 40.7 68.3 35.5-21.7-33.3-44.3-58.8-53.1-77.3z" />
  </svg>
);

const GooglePlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 512 512" fill="currentColor" height="1em" width="1em" {...props}>
    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0L11 27.3v457.4L47 512l290.9-172.3-60.1-60.1zM111.9 324.8L416 215.7 185 48.7l-73.1 276.1zM362.2 359.7l41.1-23.9-239.5-239.5-41.1 23.9 239.5 239.5z" />
  </svg>
);

interface PortfolioItem {
  crn: string;
  service: string;
  clientName: string;
  clientProfession: string;
  comment: string;
  thumbnailUrl: string;
  rating: number;
}

const PortfolioPage = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  
  // Enhanced touch handling refs and states
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchCurrentX = useRef<number>(0);
  const touchCurrentY = useRef<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTime = useRef<number>(0);
  const isHorizontalSwipe = useRef<boolean>(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll for mobile carousel
  useEffect(() => {
    if (isMobile && isAutoScrolling && !isDragging) {
      autoScrollRef.current = setInterval(() => {
        setCurrentProjectIndex(prev => (prev + 1) % portfolioItems.length);
      }, 4500);
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };
  }, [isMobile, isAutoScrolling, isDragging]);

  // Pause auto-scroll when user interacts
  const pauseAutoScroll = () => {
    setIsAutoScrolling(false);
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
    // Resume auto-scroll after 5 seconds of inactivity
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 5000);
  };

  const handleBookingOpen = () => {
    setIsBookingOpen(true);
  };

  // Real portfolio data with ratings
  const portfolioItems: PortfolioItem[] = [
    {
      crn: 'CH-07E923',
      service: 'Rental Move In Inspection',
      clientName: 'Manoj Kumar',
      clientProfession: 'Doctor',
      comment: 'Went with the Standard package from Checkaro. Prakash did a super detailed job, checked every corner patiently. Helped me catch issues early and save money. Big thanks to the team!',
      thumbnailUrl: '/PicturesforCheckaro/Portfoliopictures/07E923.png',
      rating: 5
    },
    {
      crn: 'CH-07E969',
      service: 'Post-Renovation Inspection',
      clientName: "Tatta's Residence",
      clientProfession: 'Advocate',
      comment: "Krishna from Checkaro did the inspection for our new house. The process was super detailed – took around 5 hours. They checked every tile, paint finish, and even toilet slopes. Found that all toilets had slope issues, which we flagged to the builder. Really helpful service!",
      thumbnailUrl: '/PicturesforCheckaro/Portfoliopictures/07E969.png',
      rating: 4
    },
    {
      crn: 'CH-07E999',
      service: 'Pre-Purchase Inspection',
      clientName: "Alladi's Residence",
      clientProfession: 'Software Engineer',
      comment: 'Absolutely worth it! I recently bought a 3600 sft triplex villa worth ₹2.5 Cr and thought everything was perfect—until the team from Checkaro did a full inspection. They uncovered 24+ hidden issues that could\'ve cost me ₹3-4lakhs down the line. Thanks to their detailed report, I was able to get the builder to fix everything free of cost before moving in. As a software professional, I highly recommend Checkaro for anyone investing in property. It\'s a small step that saved me big time!',
      thumbnailUrl: '/PicturesforCheckaro/Portfoliopictures/07E999.jpg',
      rating: 5
    },
    {
      crn: 'CH-07E949',
      service: 'Pre-Purchase Inspection',
      clientName: 'Madhu Kumar',
      clientProfession: 'Fashion Designer',
      comment: 'Booked the Basic package with Checkaro for my flat inspection in Kompally. They checked structure, plumbing, electrical, and dampness. The report was clear, well-organized, and easy to understand. Great service – thanks, Checkaro!',
      thumbnailUrl: '/PicturesforCheckaro/Portfoliopictures/07E949.png',
      rating: 3
    },
    {
      crn: 'CH-07E936',
      service: 'Pre-Purchase Inspection',
      clientName: 'Bangaraju Villa',
      clientProfession: 'Business Owner',
      comment: "I took the Standard Package from Checkaro Home Inspection before starting interiors, and it was a great decision. On my interior designer's suggestion, I went for it—they used advanced German & US tech tools to detect issues like termites, broken tiles, floor slope errors, and wall leakage. Very professional team with a detailed report. Highly recommend for new homeowners!",
      thumbnailUrl: '/PicturesforCheckaro/Portfoliopictures/07E936.png',
      rating: 5
    },
    {
      crn: 'CH-07E972',
      service: 'Rental Move Out Inspection',
      clientName: 'Rishika Residence',
      clientProfession: 'Architect',
      comment: 'I used Checkaro for my move-in and move-out inspections. The move-out report helped me show my owner the issues on his side and avoid charges in the debit note.',
      thumbnailUrl: '/PicturesforCheckaro/Portfoliopictures/07E972.jpg',
      rating: 4
    }
  ];

  // Improved touch handlers that properly handle vertical vs horizontal gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchCurrentX.current = touch.clientX;
    touchCurrentY.current = touch.clientY;
    touchStartTime.current = Date.now();
    isHorizontalSwipe.current = false;
    setIsDragging(false); // Start with dragging false
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchCurrentX.current = touch.clientX;
    touchCurrentY.current = touch.clientY;
    
    const deltaX = Math.abs(touchStartX.current - touchCurrentX.current);
    const deltaY = Math.abs(touchStartY.current - touchCurrentY.current);
    const minSwipeDistance = 15; // Minimum distance to determine direction
    
    // Only determine swipe direction after sufficient movement
    if (deltaX > minSwipeDistance || deltaY > minSwipeDistance) {
      // If horizontal movement is significantly greater than vertical movement
      if (deltaX > deltaY * 1.5 && deltaX > 30) {
        // This is a horizontal swipe - prevent default and enable carousel dragging
        isHorizontalSwipe.current = true;
        setIsDragging(true);
        e.preventDefault(); // Prevent vertical scrolling only for horizontal swipes
        pauseAutoScroll();
      } else if (!isHorizontalSwipe.current) {
        // This is vertical movement - allow normal page scrolling
        // Don't prevent default to allow vertical scrolling
        return;
      }
    }
  };

  const handleTouchEnd = () => {
    // Only process horizontal swipe if it was determined to be horizontal
    if (isHorizontalSwipe.current && isDragging) {
      const deltaX = touchStartX.current - touchCurrentX.current;
      const deltaTime = Date.now() - touchStartTime.current;
      const minSwipeDistance = 50;
      const maxSwipeTime = 300;
      
      // Process swipe only if it meets distance and time criteria
      if (Math.abs(deltaX) > minSwipeDistance && deltaTime < maxSwipeTime) {
        if (deltaX > 0 && currentProjectIndex < portfolioItems.length - 1) {
          // Swipe left - next slide
          setCurrentProjectIndex(currentProjectIndex + 1);
        } else if (deltaX < 0 && currentProjectIndex > 0) {
          // Swipe right - previous slide
          setCurrentProjectIndex(currentProjectIndex - 1);
        }
      }
    }
    
    // Reset all touch states
    setIsDragging(false);
    isHorizontalSwipe.current = false;
  };

  // Navigation functions
  const goToNext = () => {
    if (currentProjectIndex < portfolioItems.length - 1) {
      setCurrentProjectIndex(currentProjectIndex + 1);
      pauseAutoScroll();
    }
  };

  const goToPrevious = () => {
    if (currentProjectIndex > 0) {
      setCurrentProjectIndex(currentProjectIndex - 1);
      pauseAutoScroll();
    }
  };

  const goToSlide = (index: number) => {
    setCurrentProjectIndex(index);
    pauseAutoScroll();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }, 
  };

  // Function to render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <StarIconSolid
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar onBookingOpen={handleBookingOpen} />

      <main className="pt-0 text-black w-full">
        {/* Our Projects Section */}
        <section className="pt-16 sm:pt-28 pb-12 sm:pb-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2 sm:mb-3">
                Our Projects & Client Stories
              </h2>
              <div className="h-1 w-24 mb-2 sm:mb-3 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Real inspections, real results. See how we've helped homeowners make informed decisions.
              </p>
            </motion.div>

            {/* Desktop Grid Layout */}
            <div className="hidden md:block">
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {portfolioItems.map((item, index) => (
                  <motion.div
                    key={item.crn}
                    variants={itemVariants}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group"
                  >
                    {/* Project Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.thumbnailUrl}
                        alt={`${item.service} - ${item.clientName}`}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      
                      {/* CRN Number Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                          {item.crn}
                        </span>
                      </div>

                      {/* Star Rating */}
                      <div className="absolute top-3 right-3">
                        {renderStars(item.rating)}
                      </div>

                      {/* Project Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white text-lg font-bold mb-1">
                          {item.clientName}
                        </h3>
                        <p className="text-orange-300 text-sm font-medium">
                          {item.service}
                        </p>
                        <p className="text-gray-300 text-xs mt-1">
                          {item.clientProfession}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Quote Icon */}
                      <div className="flex items-start mb-3">
                        <QuoteIcon className="h-5 w-5 text-orange-500 flex-shrink-0 mr-2 mt-1" />
                        <div className="flex-1">
                          <p className={`text-gray-700 text-sm leading-relaxed ${
                            expandedProject === index ? '' : 'line-clamp-4'
                          }`}>
                            "{item.comment}"
                          </p>
                          {item.comment.length > 120 && (
                            <button
                              onClick={() => setExpandedProject(expandedProject === index ? null : index)}
                              className="text-orange-500 text-xs font-medium mt-2 hover:text-orange-600 transition-colors"
                            >
                              {expandedProject === index ? 'Read Less' : 'Read More'}
                            </button>
                          )}
                        </div>
                      </div>
              
                      {/* Client Info */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <p className="font-semibold text-black text-sm">{item.clientName}</p>
                          <p className="text-gray-500 text-xs">{item.clientProfession}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Mobile Enhanced Swipeable Carousel with Improved Touch Handling */}
            <div className="md:hidden">
              <div className="relative">
                {/* Navigation Arrows */}
                <button
                  onClick={goToPrevious}
                  disabled={currentProjectIndex === 0}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-300 ${
                    currentProjectIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:scale-110'
                  }`}
                >
                  <ChevronLeftIcon className="h-6 w-6 text-black" />
                </button>

                <button
                  onClick={goToNext}
                  disabled={currentProjectIndex === portfolioItems.length - 1}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-300 ${
                    currentProjectIndex === portfolioItems.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:scale-110'
                  }`}
                >
                  <ChevronRightIcon className="h-6 w-6 text-black" />
                </button>

                {/* Carousel Container with improved touch handling */}
                <div 
                  ref={carouselRef}
                  className="overflow-hidden"
                  style={{ 
                    touchAction: 'pan-y pinch-zoom', // Allow vertical scrolling and pinch zoom
                    overscrollBehaviorX: 'contain' // Prevent horizontal overscroll
                  }}
                >
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentProjectIndex * 100}%)` }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {portfolioItems.map((item) => (
                      <div key={item.crn} className="w-full flex-shrink-0 px-2 select-none">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                          {/* Project Image */}
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                              src={item.thumbnailUrl}
                              alt={`${item.service} - ${item.clientName}`}
                              layout="fill"
                              objectFit="cover"
                              draggable={false}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            
                            {/* CRN Number Badge */}
                            <div className="absolute top-2 left-2">
                              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {item.crn}
                              </span>
                            </div>

                             {/* Star Rating for Mobile */}
                             <div className="absolute top-2 right-2">
                                {renderStars(item.rating)}
                             </div>

                            {/* Project Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <h3 className="text-white text-base font-bold mb-1">
                                {item.clientName}
                              </h3>
                              <p className="text-orange-300 text-xs font-medium">
                                {item.service}
                              </p>
                              <p className="text-gray-300 text-xs">
                                {item.clientProfession}
                              </p>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            {/* Quote */}
                            <div className="flex items-start mb-3">
                              <QuoteIcon className="h-4 w-4 text-orange-500 flex-shrink-0 mr-2 mt-1" />
                              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                                "{item.comment}"
                              </p>
                            </div>
                            
                            {/* Client Info */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div>
                                <p className="font-semibold text-black text-sm">{item.clientName}</p>
                                <p className="text-gray-500 text-xs">{item.clientProfession}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Dots Indicator */}
                <div className="flex justify-center mt-6 space-x-2">
                  {portfolioItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentProjectIndex 
                          ? 'bg-orange-500 w-6' 
                          : 'bg-gray-300 w-2 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Slide Counter */}
                <div className="text-center mt-4 text-sm text-gray-600">
                  {currentProjectIndex + 1} of {portfolioItems.length}
                </div>
              </div>
            </div>
          </div>
        </section>


      </main>

      {/* Footer - Moved outside main tag and ensured it's always visible */}
      <Footer />
      
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PortfolioPage;