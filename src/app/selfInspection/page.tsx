"use client";

import React, { useState, useEffect, useRef, useCallback, useLayoutEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CheckCircleIcon,
  HomeIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  XMarkIcon,
  AcademicCapIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon, // Added for the new section
} from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// --- TYPE DEFINITIONS ---

interface InspectionArea {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

interface WhatYouGetItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

interface WhoIsThisForItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

interface WhyChooseItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface InspectionCarouselProps {
  items: InspectionArea[];
  isMobileView: boolean;
}

// --- IMPROVED CAROUSEL COMPONENT ---

const InspectionCarousel: React.FC<InspectionCarouselProps> = ({ items, isMobileView }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Ensure we have valid items
  const validInspectionItems = Array.isArray(items) && items.length > 0 ? items : [];
  const CARDS_PER_VIEW = 4;
  const maxIndex = validInspectionItems.length > CARDS_PER_VIEW ? validInspectionItems.length - CARDS_PER_VIEW : 0;

  // Cleanup auto-play timer
  const clearAutoPlayTimer = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  // Navigate to next slide
  const moveToNextSlide = useCallback(() => {
    if (validInspectionItems.length <= CARDS_PER_VIEW) return;
    setCurrentSlideIndex(prevIndex => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  }, [validInspectionItems.length, maxIndex]);

  // Navigate to previous slide
  const moveToPreviousSlide = useCallback(() => {
    if (validInspectionItems.length <= CARDS_PER_VIEW) return;
    setCurrentSlideIndex(prevIndex => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
  }, [maxIndex, validInspectionItems.length]);

  // Navigate to specific slide
  const jumpToSlide = useCallback((slideIndex: number) => {
    if (slideIndex >= 0 && slideIndex <= maxIndex) {
      setCurrentSlideIndex(slideIndex);
    }
  }, [maxIndex]);

  // Initialize card refs
  useEffect(() => {
    cardRefs.current = Array(validInspectionItems.length).fill(null);
  }, [validInspectionItems]);

  // Entry animation for carousel cards
  useLayoutEffect(() => {
    if (isMobileView || hasAnimatedIn || !carouselContainerRef.current) {
      return;
    }

    const container = carouselContainerRef.current;
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];

    if (cards.length === 0) {
      return;
    }

    setIsAutoPlayEnabled(false);

    // Set container visible
    gsap.set(container, { visibility: 'visible' });

    // Set initial state for cards - slide up from bottom with fade
    gsap.set(cards, {
      opacity: 0,
      y: 100,
      scale: 0.8,
      rotationY: 15
    });

    // Animate cards in with a wave effect
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationY: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power3.out',
      onComplete: () => {
        setIsAutoPlayEnabled(true);
        setHasAnimatedIn(true);
      }
    });

  }, [isMobileView, validInspectionItems, hasAnimatedIn]);

  // Auto-play functionality
  useEffect(() => {
    clearAutoPlayTimer();

    if (isAutoPlayEnabled && !isMobileView && validInspectionItems.length > CARDS_PER_VIEW) {
      autoPlayTimerRef.current = setInterval(moveToNextSlide, 3000);
    }

    return clearAutoPlayTimer;
  }, [isAutoPlayEnabled, isMobileView, moveToNextSlide, validInspectionItems.length, clearAutoPlayTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return clearAutoPlayTimer;
  }, [clearAutoPlayTimer]);

  // Handle empty data gracefully
  if (validInspectionItems.length === 0) {
    return (
      <div className="py-16 bg-gray-50 w-full">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">No inspection areas available</p>
        </div>
      </div>
    );
  }

  // Mobile implementation with horizontal scroll
  if (isMobileView) {
    return (
      <div className="py-16 bg-orange-50 w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-3">
              What's Covered in the Inspection
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-lg text-black max-w-2xl mx-auto">
              Our easy-to-follow checklist helps you inspect all key areas of your home,
              so nothing important gets missed.
            </p>
          </div>

          <div className="overflow-x-auto pb-3 -mx-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex space-x-3 px-3 min-w-max">
              {validInspectionItems.map((inspectionArea, index) => (
                <div key={`mobile-inspection-${index}`} className="w-48 flex-shrink-0">
                  <div className="relative w-full h-60 rounded-xl overflow-hidden shadow-lg group">
                    <img
                      src={inspectionArea.image}
                      alt={inspectionArea.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 text-orange-400">
                        {inspectionArea.icon}
                      </div>
                      <h3 className="text-base font-bold mb-1">{inspectionArea.title}</h3>
                      <p className="text-base text-gray-200">{inspectionArea.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop carousel implementation
  return (
    <div
      ref={carouselContainerRef}
      className="py-16 bg-orange-50 w-full"
      style={{ visibility: 'hidden' }}
      onMouseEnter={() => setIsAutoPlayEnabled(false)}
      onMouseLeave={() => setIsAutoPlayEnabled(true)}
    >
      {/* Section Header */}
      <div className="container mx-auto px-4 text-center mb-12">
        <h2 className="text-4xl font-bold text-black mb-3">
          What's Covered in the Inspection
        </h2>
        <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
        <p className="text-lg text-black max-w-2xl mx-auto">
          Our easy-to-follow checklist helps you inspect all key areas of your home,
          so nothing important gets missed.
        </p>
      </div>

      {/* Carousel Container */}
      <div className="container mx-auto px-4">
        <div className="relative max-w-5xl mx-auto">
          {/* Navigation Arrows */}
          {validInspectionItems.length > CARDS_PER_VIEW && maxIndex > 0 && (
            <>
              <button
                onClick={moveToPreviousSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-black hover:bg-white hover:shadow-xl transition-all duration-300 -ml-5"
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={moveToNextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-black hover:bg-white hover:shadow-xl transition-all duration-300 -mr-5"
                aria-label="Next slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Carousel Viewport */}
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentSlideIndex * (100 / validInspectionItems.length)}%)`,
                width: `${(validInspectionItems.length * 100) / CARDS_PER_VIEW}%`
              }}
            >
              {validInspectionItems.map((inspectionArea, index) => (
                <div
                  key={`desktop-inspection-${index}`}
                  ref={el => { cardRefs.current[index] = el; }}
                  className="px-2"
                  style={{ width: `${100 / validInspectionItems.length}%` }}
                >
                  <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <img
                      src={inspectionArea.image}
                      alt={inspectionArea.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    {/* Card Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 text-orange-400 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                        {inspectionArea.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2 leading-tight">{inspectionArea.title}</h3>
                      <p className="text-base text-gray-200 leading-relaxed transform translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                        {inspectionArea.description}
                      </p>
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-all duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Navigation Dots */}
          {validInspectionItems.length > CARDS_PER_VIEW && maxIndex > 0 && (
            <div className="flex justify-center mt-6 gap-1">
              {Array.from({ length: maxIndex + 1 }, (_, index) => (
                <button
                  key={`carousel-dot-${index}`}
                  onClick={() => jumpToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlideIndex
                      ? 'bg-orange-500 w-8'
                      : 'bg-orange-200 hover:bg-orange-300'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Slide Counter */}
          {validInspectionItems.length > CARDS_PER_VIEW && maxIndex > 0 && (
            <div className="text-center mt-4">
              <span className="text-base text-black">
                {currentSlideIndex + 1} - {Math.min(currentSlideIndex + CARDS_PER_VIEW, validInspectionItems.length)} of {validInspectionItems.length}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const SelfInspectionPage = () => {
  // State management
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isProfessionalBookingModalOpen, setIsProfessionalBookingModalOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [visibleNumberElements, setVisibleNumberElements] = useState<number[]>([]);

  // Refs for sections and animations
  const numbersAnimationRef = useRef<HTMLDivElement>(null);
  const whatYouGetSectionRef = useRef<HTMLDivElement>(null);
  const whoIsThisForSectionRef = useRef<HTMLDivElement>(null);
  const whyChooseSectionRef = useRef<HTMLDivElement>(null);

  // --- FIX: USE useMemo TO CREATE STABLE REF ARRAYS ---
  // This prevents the arrays from being recreated on every render, which was causing the useEffect hooks to re-run.
  // We use React.createRef here because it's the correct way to generate multiple refs in a loop/map.
  const whatYouGetCardRefs = useMemo(() => Array.from({ length: 6 }, () => React.createRef<HTMLDivElement>()), []);
  const whoIsThisForCardRefs = useMemo(() => Array.from({ length: 4 }, () => React.createRef<HTMLDivElement>()), []);
  const whyChooseCardRefs = useMemo(() => Array.from({ length: 6 }, () => React.createRef<HTMLDivElement>()), []);

  // Event handlers
  const openBookingModal = () => setIsBookingModalOpen(true);
  const closeBookingModal = () => setIsBookingModalOpen(false);
  const openProfessionalBookingModal = () => setIsProfessionalBookingModalOpen(true);
  const closeProfessionalBookingModal = () => setIsProfessionalBookingModalOpen(false);

  // Mobile viewport detection
  useEffect(() => {
    const detectMobileViewport = () => setIsMobileViewport(window.innerWidth < 1024);
    detectMobileViewport();
    window.addEventListener('resize', detectMobileViewport);
    return () => window.removeEventListener('resize', detectMobileViewport);
  }, []);

  // --- FIX: ADDED CLEANUP FUNCTION and STABLE DEPENDENCY ARRAY ---
  // What You Get Section Animation using GSAP
  useEffect(() => {
    const section = whatYouGetSectionRef.current;
    const cardElements = whatYouGetCardRefs.map(ref => ref.current).filter(Boolean);
    let st: ScrollTrigger | undefined;

    if (section && cardElements.length === 6) {
      gsap.set([cardElements[0], cardElements[3]], { autoAlpha: 0, x: -window.innerWidth - 300 });
      gsap.set([cardElements[2], cardElements[5]], { autoAlpha: 0, x: window.innerWidth + 300 });
      gsap.set(cardElements[1], { autoAlpha: 0, y: -window.innerHeight - 300 });
      gsap.set(cardElements[4], { autoAlpha: 0, y: window.innerHeight + 300 });

      st = ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to([cardElements[0], cardElements[3]], { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
          gsap.to([cardElements[2], cardElements[5]], { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
          gsap.to(cardElements[1], { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.3 });
          gsap.to(cardElements[4], { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.35 });
        },
      });
    }

    return () => {
      st?.kill(); // Cleanup function to kill the ScrollTrigger instance
    };
  }, []); // Empty dependency array ensures this effect runs only once

  // --- FIX: ADDED CLEANUP FUNCTION and STABLE DEPENDENCY ARRAY ---
  // Who Is This For Section Animation using GSAP
  useEffect(() => {
    const section = whoIsThisForSectionRef.current;
    const cardElements = whoIsThisForCardRefs.map(ref => ref.current).filter(Boolean);
    let st: ScrollTrigger | undefined;

    if (section && cardElements.length === 4) {
      gsap.set([cardElements[0], cardElements[2]], { autoAlpha: 0, x: -window.innerWidth - 200 });
      gsap.set([cardElements[1], cardElements[3]], { autoAlpha: 0, x: window.innerWidth + 200 });

      st = ScrollTrigger.create({
        trigger: section,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to([cardElements[0], cardElements[2]], { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
          gsap.to([cardElements[1], cardElements[3]], { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
        }
      });
    }

    return () => {
      st?.kill(); // Cleanup
    };
  }, []); // Empty dependency array

  // --- FIX: ADDED CLEANUP FUNCTION and STABLE DEPENDENCY ARRAY ---
  // Why Choose Section Animation using GSAP
  useEffect(() => {
    const section = whyChooseSectionRef.current;
    const cardElements = whyChooseCardRefs.map(ref => ref.current).filter(Boolean);
    let st: ScrollTrigger | undefined;

    if (section && cardElements.length > 0) {
      gsap.set(cardElements, { autoAlpha: 0, y: 50, scale: 0.95 });

      st = ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(cardElements, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
          });
        },
      });
    }

    return () => {
      st?.kill(); // Cleanup
    };
  }, []); // Empty dependency array

  // Numbers animation
  useEffect(() => {
    const observerOptions = { threshold: 0.2, rootMargin: '0px 0px -50px 0px' };
    const numbersObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        for (let i = 1; i <= 5; i++) {
          setTimeout(() => setVisibleNumberElements(prev => [...new Set([...prev, i])]), (i - 1) * 180);
        }
        numbersObserver.disconnect();
      }
    }, observerOptions);
    if (numbersAnimationRef.current) numbersObserver.observe(numbersAnimationRef.current);
    return () => numbersObserver.disconnect();
  }, []);

  // Data arrays
  const inspectionAreaData: InspectionArea[] = [
    { title: 'External Walls & Structure', description: 'Check for cracks, dampness, and structural integrity', icon: <HomeIcon className="h-6 w-6" />, image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Terrace & Roof', description: 'Inspect for leaks, waterproofing, and drainage issues', icon: <HomeIcon className="h-6 w-6" />, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Plumbing System', description: 'Check for leaks, water pressure, and drainage', icon: <WrenchScrewdriverIcon className="h-6 w-6" />, image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Electrical Safety', description: 'Inspect wiring, switches, and safety mechanisms', icon: <WrenchScrewdriverIcon className="h-6 w-6" />, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Doors & Windows', description: 'Check for proper functioning, sealing, and security', icon: <HomeIcon className="h-6 w-6" />, image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Bathrooms & Kitchens', description: 'Inspect fixtures, tiling, and ventilation', icon: <HomeIcon className="h-6 w-6" />, image: 'https://images.unsplash.com/photo-1556912998-c57cc6b3d4d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Interior Finishes', description: 'Look for paint issues, flooring problems, and wall damage', icon: <AcademicCapIcon className="h-6 w-6" />, image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Safety Features', description: 'Check smoke detectors, railings, and other safety devices', icon: <CheckCircleIcon className="h-6 w-6" />, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  ];

  const whatYouGetData: WhatYouGetItem[] = [
    { title: 'Full Home Inspection Checklist', description: 'Comprehensive digital and printable checklist covering all areas of your home', icon: <DocumentTextIcon className="h-6 w-6 text-orange-500" />, image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { title: 'Step-by-Step Video Tutorials', description: 'Short video guides for every section to help you inspect like a pro', icon: <VideoCameraIcon className="h-6 w-6 text-orange-500" />, image: '/selfinspectionPage/wyg_step_by_step_video.png' },
    { title: 'Visual References', description: 'Images to help you identify and verify common issues', icon: <CheckCircleIcon className="h-6 w-6 text-orange-500" />, image: '/selfinspectionPage/wyg_visual_ref.png' },
    { title: 'Automated Report', description: 'Generate a professional inspection report automatically', icon: <DocumentTextIcon className="h-6 w-6 text-orange-500" />, image: '/selfinspectionPage/wyg_automated_report.png' },
    { title: 'Basic Tools List', description: 'Basic tools you\'ll need for a thorough inspection', icon: <WrenchScrewdriverIcon className="h-6 w-6 text-orange-500" />, image: '/selfinspectionPage/wyg_basic_tools.png' },
    { title: 'Lifetime Updates', description: 'Free updates to the guide as we improve it', icon: <CheckCircleIcon className="h-6 w-6 text-orange-500" />, image: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }
  ];

  const whoIsThisForData: WhoIsThisForItem[] = [
    { title: 'Homeowners', description: "Check your home and catch small problems early.", icon: <HomeIcon className="h-5 w-5" />, image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { title: 'Tenants', description: "Record the home's condition before moving in or out.", icon: <UserGroupIcon className="h-5 w-5" />, image: '/selfinspectionPage/tenants.png' },
    { title: 'Home Buyers', description: "Get a basic idea of the home's condition before buying.", icon: <DocumentTextIcon className="h-5 w-5" />, image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { title: 'DIY Enthusiasts', description: "Learn how to spot and fix simple home issues.", icon: <WrenchScrewdriverIcon className="h-5 w-5" />, image: '/selfinspectionPage/DIY.png' }
  ];

  const whyChooseData: WhyChooseItem[] = [
    {
      icon: <span className="font-bold text-xl">₹</span>,
      title: "Highly Affordable",
      description: "At just ₹999, it's a fraction of the cost of professional inspections which can cost thousands.",
    },
    {
      icon: <ClockIcon className="h-6 w-6" />,
      title: "Complete Convenience",
      description: "No waiting for technicians. Inspect on your own schedule, any day, any time that works for you.",
    },
    {
      icon: <VideoCameraIcon className="h-6 w-6" />,
      title: "Easy to Follow",
      description: "Step-by-step videos and clear visual tutorials make the entire process simple, even for beginners.",
    },
    {
      icon: <CheckCircleIcon className="h-6 w-6" />,
      title: "Comprehensive Coverage",
      description: "Our detailed checklist ensures you don't miss any critical areas, from the roof to the foundation.",
    },
    {
      icon: <DocumentTextIcon className="h-6 w-6" />,
      title: "Instant Report Generation",
      description: "Automatically compile your findings into a clean, professional report to track and address issues.",
    },
    {
      icon: <WrenchScrewdriverIcon className="h-6 w-6" />,
      title: "Learn & Empower",
      description: "Understand your home better and learn to spot minor issues before they become major problems.",
    },
  ];


  const sectionIncludesData: string[] = ['What to check', 'How to check', 'What it means', 'What you can do', 'When to call a pro'];

  // Form submission handlers
  const handleSelfInspectionFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Self-inspection form submitted');
    closeBookingModal();
  };

  const handleProfessionalInspectionFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Professional inspection form submitted');
    closeProfessionalBookingModal();
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar onBookingOpen={openBookingModal} />

      <style jsx>{`
        @keyframes slideInUp { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.5) translateY(-30px); } 50% { opacity: 1; transform: scale(1.08) translateY(0); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes flash { 0%, 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7); } 50% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); } }
        .animate-slideInUp { animation: slideInUp 0.5s ease-out forwards; }
        .animate-bounceIn { animation: bounceIn 0.6s ease-out forwards; }
        .animate-flash { animation: flash 1.2s infinite; }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
      `}</style>

      <main className="text-black w-full">
        {/* Welcome Section */}
        <section className="bg-gradient-to-br from-orange-50 to-white pt-48 pb-16 w-full">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[48vh]">
              {/* Left side - Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tight mb-6 leading-tight">
                  Inspect Your Home Like an Expert
                  <span className="block mt-2 text-orange-500 text-5xl">
                    Anytime, Anywhere
                  </span>
                </h1>
                <div className="space-y-4 mb-8 max-w-lg mx-auto lg:mx-0">
                  <div className="flex items-center space-x-3 text-base text-black">
                    <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <span>No technical experience needed</span>
                  </div>
                  <div className="flex items-center space-x-3 text-base text-black">
                    <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <span>Professional-grade checklist for just ₹999</span>
                  </div>
                  <div className="flex items-center space-x-3 text-base text-black">
                    <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <span>Instant access with lifetime updates</span>
                  </div>
                </div>
                <button onClick={openBookingModal} className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1">
                  Start Inspecting Today
                </button>
              </div>

              {/* Right side - Contact Form */}
              <div className="bg-white rounded-xl p-8 shadow-xl border border-gray-100 mt-16 lg:mt-0">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-black mb-3">Get Your Checklist</h3>
                  <div className="text-3xl font-bold text-orange-600 mb-2">₹999/-</div>
                  <p className="text-base text-black">One-time payment • Instant access</p>
                </div>
                <form className="space-y-4" onSubmit={handleSelfInspectionFormSubmit}>
                  <div>
                    <label className="block text-base font-medium text-black mb-2"><UserGroupIcon className="h-4 w-4 inline mr-2" />Full Name</label>
                    <input type="text" required className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-black mb-2"><EnvelopeIcon className="h-4 w-4 inline mr-2" />Email Address</label>
                    <input type="email" required className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Enter your email" />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-black mb-2"><PhoneIcon className="h-4 w-4 inline mr-2" />Phone Number</label>
                    <input type="tel" required className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Enter your phone number" />
                  </div>
                  <button type="submit" className="w-full bg-orange-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors duration-300">Get Instant Access</button>
                </form>
                <p className="text-base text-gray-500 text-center mt-4">🔒 Secure payment • Instant report • Life time access • No extra cost</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Self Home Inspection App Section */}
        <section className="py-16 bg-orange-50 w-full">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-3">
                Self Home Inspection App
              </h2>
              <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left side - App mockups */}
              <div className="flex justify-center items-center gap-4 sm:gap-6">
                <div className="bg-black p-2 rounded-[2rem] shadow-2xl transform -rotate-6 transition-transform hover:rotate-0">
                  <img 
                    src="/selfInspectionAppPictures/self_inspection_app_1.jpeg" 
                    alt="Self Inspection App Interface 1" 
                    className="rounded-[1.5rem] w-40 h-80 sm:w-48 sm:h-96 object-cover object-center"
                  />
                </div>
                <div className="bg-black p-2 rounded-[2rem] shadow-2xl transform rotate-6 z-10 transition-transform hover:rotate-0">
                  <img 
                    src="/selfInspectionAppPictures/self_inspection_app_3.jpg" 
                    alt="Self Inspection App Interface 2" 
                    className="rounded-[1.5rem] w-40 h-80 sm:w-48 sm:h-96 object-cover object-center"
                  />
                </div>
              </div>

              {/* Right side - Content */}
              <div className="text-center lg:text-left">
                <h3 className="text-xl font-bold text-black mb-8 ml-20">
                  Inspections, Upgraded.
                </h3>
                
                {/* Feature points */}
                <div className="space-y-6 mb-10">
                  <div className="flex items-center space-x-4 text-black">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 ml-20">
                      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-lg">Snap photos</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-black">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 ml-20">
                      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <span className="text-lg">Follow guided steps</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-black">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 ml-20">
                      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <span className="text-lg">Submit with one tap</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-black">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 ml-20">
                      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-lg">Get your report fast</span>
                  </div>
                </div>

                <p className="text-xl font-semibold text-black mb-8 ml-20">
                  Download the Checkaro app now
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 ml-20">
                  <a 
                    href="#" 
                    className="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <svg viewBox="0 0 384 512" fill="currentColor" height="1em" width="1em" className="h-8 w-8">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C39.2 141.6 0 184.2 0 241.7c0 61.6 31.5 112.6 61.2 150.9 29.7 38.3 62.5 77.3 99.8 77.3 37.2 0 40.7-24.8 77.8-24.8 37.1 0 43.7 24.8 78.3 24.8 35.5 0 69.3-38.3 98.8-76.8 21.4-28.2 33.2-56.1 33.2-89.5zM212.2 93.3c15.6-16.7 33.1-33.2 51.6-42.3-20.7-9.3-43.7-3.3-56.6 10-13.3 13.3-23.3 33.3-25.8 52.3-2.5 19 6.2 38.3 15.6 51.6 19.7 27.8 44.3 40.7 68.3 35.5-21.7-33.3-44.3-58.8-53.1-77.3z"></path>
                    </svg>
                    <div>
                      <p className="text-sm">Download on the</p>
                      <p className="text-lg font-semibold -mt-1">App Store</p>
                    </div>
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <svg viewBox="0 0 512 512" fill="currentColor" height="1em" width="1em" className="h-7 w-7">
                      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0L11 27.3v457.4L47 512l290.9-172.3-60.1-60.1zM111.9 324.8L416 215.7 185 48.7l-73.1 276.1zM362.2 359.7l41.1-23.9-239.5-239.5-41.1 23.9 239.5 239.5z"></path>
                    </svg>
                    <div>
                      <p className="text-sm">GET IT ON</p>
                      <p className="text-lg font-semibold -mt-1">Google Play</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get Section */}
        <section ref={whatYouGetSectionRef} className="py-16 bg-white w-full">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-3">What You Get</h2>
              <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whatYouGetData.map((item, index) => (
                <div key={index} ref={whatYouGetCardRefs[index]} className="card-hover bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100" style={{ opacity: 0 }}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4"><div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-orange-500">{item.icon}</div></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-black">{item.title}</h3>
                    <p className="text-base text-black leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who Is This For Section */}
        <section ref={whoIsThisForSectionRef} className="py-16 bg-gray-50 w-full">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-3">Who Is This For?</h2>
              <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {whoIsThisForData.map((item, index) => (
                <div key={index} ref={whoIsThisForCardRefs[index]} className="card-hover bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100" style={{ opacity: 0 }}>
                  <div className="relative h-40 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4"><div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-orange-500">{item.icon}</div></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-black">{item.title}</h3>
                    <p className="text-base text-black leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Each Section Includes */}
        <section className="py-16 bg-white w-full" ref={numbersAnimationRef}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-3">Each Section Includes</h2>
              <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Black dotted line */}
                <div className="absolute top-8 left-0 right-0 h-0 border-t-2 border-dotted border-black"></div>

                {/* Flex container for items */}
                <div className="relative flex justify-between">
                  {sectionIncludesData.map((item, index) => (
                    <div key={index} className={`text-center transition-all duration-600 ${visibleNumberElements.includes(index + 1) ? 'opacity-100 animate-bounceIn' : 'opacity-0'}`} style={{ opacity: 0 }}>
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg border-4 border-white">
                        {index + 1}
                      </div>
                      <h3 className="text-base font-bold text-black mb-2 max-w-[140px] mx-auto">{item}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inspection Carousel Section */}
        <InspectionCarousel items={inspectionAreaData} isMobileView={isMobileViewport} />

        {/* Why Choose Section - REBUILT SECTION */}
        <section ref={whyChooseSectionRef} className="py-16 bg-orange-50 w-full">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-3">Why Choose Our Self-Inspection?</h2>
              <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {whyChooseData.map((item, index) => (
                <div key={index} ref={whyChooseCardRefs[index]} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 card-hover flex flex-col items-center text-center" style={{ opacity: 0 }}>
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
                  <p className="text-base text-black leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Self-Inspection VS Professional Home Inspector & Start Today */}
        <section className="py-16 bg-white w-full">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-3">
              Self Inspection vs Professional Home Inspection
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Image Section */}
            <div className="mb-10">
              <img 
                src="/selfvsproffesionalInspection.png" 
                alt="Self vs Professional Inspection Comparison" 
                className="w-full max-w-3xl mx-auto rounded-xl"
              />
            </div>
            {/* Call to Action */}
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-4">₹999/-</div>
              <h3 className="text-xl font-bold text-black mb-6">Start Today</h3>
              <p className="text-black mb-8 leading-relaxed max-w-2xl mx-auto text-lg">
                You don't need to wait for someone to tell you what's wrong. With this checklist, 
                you can become your own home inspector — smart, safe, and fully informed.
              </p>
              <p className="text-base text-black mb-2">(Inclusive of all taxes)</p>
              <p className="text-base text-black mb-8">Free updates to the guide, if we improve or expand it in the future</p>
              <button 
                onClick={openBookingModal} 
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                Access Checklist Now
              </button>
            </div>
          </div>
        </div>
      </section>

        {/* Need Help After Inspection */}
        <section className="py-16 bg-gray-50 w-full">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-black mb-3">Need Help After Inspection?</h2>
              <div className="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
              <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
                <div className="text-left">
                  <h3 className="text-xl font-bold text-black mb-6">We're still here for you!</h3>
                  <p className="text-lg text-black mb-8 leading-relaxed">If you detect serious issues and want expert help, you can always book our Professional Home Inspection Service separately.</p>
                  <button onClick={openProfessionalBookingModal} className="px-8 py-4 bg-orange-500 text-white text-lg font-semibold rounded-full hover:bg-orange-600 transition-colors duration-300 animate-flash">Book Professional Inspection</button>
                </div>
                <div><img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Professional Home Inspection" className="w-full h-64 object-cover rounded-xl shadow-lg" /></div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 bg-white w-full">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Inspect Your Home Like a Pro?</h2>
            <p className="text-lg text-black mb-8 max-w-2xl mx-auto">Get instant access to our comprehensive self-inspection checklist for just{' '}<span className="font-bold text-orange-600 text-2xl">₹999/-</span></p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={openBookingModal} className="px-8 py-4 bg-orange-500 text-white text-lg font-semibold rounded-full hover:bg-orange-600 transition-colors duration-300">Get Started Now</button>
              <button onClick={openProfessionalBookingModal} className="px-8 py-4 bg-transparent text-black text-lg font-semibold border-2 border-gray-300 rounded-full hover:bg-gray-100 transition-colors duration-300">Need Professional Help?</button>
            </div>
            <p className="mt-6 text-base text-gray-500">One-time payment • Instant access • Lifetime updates</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative animate-slideInUp">
            <button onClick={closeBookingModal} className="absolute top-4 right-4 text-gray-500 hover:text-black"><XMarkIcon className="h-6 w-6" /></button>
            <h3 className="text-xl font-bold text-black mb-4">Get Self-Inspection Checklist</h3>
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">₹999/-</div>
              <p className="text-base text-black">One-time payment • Instant access</p>
            </div>
            <form className="space-y-4" onSubmit={handleSelfInspectionFormSubmit}>
              <div><label className="block text-base font-medium text-black mb-2">Name</label><input type="text" required className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" /></div>
              <div><label className="block text-base font-medium text-black mb-2">Email</label><input type="email" required className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" /></div>
              <div><label className="block text-base font-medium text-black mb-2">Phone</label><input type="tel" required className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" /></div>
              <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors duration-300">Access Checklist Now</button>
            </form>
            <p className="text-base text-gray-500 text-center mt-4">🔒 Secure payment • Instant digital delivery • 30-day money-back guarantee</p>
          </div>
        </div>
      )}

      {/* Professional Booking Modal */}
      {isProfessionalBookingModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative animate-slideInUp">
            <button onClick={closeProfessionalBookingModal} className="absolute top-4 right-4 text-gray-500 hover:text-black"><XMarkIcon className="h-6 w-6" /></button>
            <h3 className="text-xl font-bold text-black mb-4">Book Professional Inspection</h3>
            <p className="text-base text-black mb-6">Get a comprehensive professional home inspection with detailed report</p>
            <form className="space-y-4" onSubmit={handleProfessionalInspectionFormSubmit}>
              <div><label className="block text-base font-medium text-black mb-2">Name</label><input type="text" required className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" /></div>
              <div><label className="block text-base font-medium text-black mb-2">Email</label><input type="email" required className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" /></div>
              <div><label className="block text-base font-medium text-black mb-2">Phone</label><input type="tel" required className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" /></div>
              <div><label className="block text-base font-medium text-black mb-2">Property Address</label><textarea required className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" rows={3}></textarea></div>
              <div><label className="block text-base font-medium text-black mb-2">Preferred Date</label><input type="date" required className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" /></div>
              <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors duration-300">Book Professional Inspection</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfInspectionPage;