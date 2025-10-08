'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useResponsive } from '../utils/clientUtils';
import Footer from '@/components/Footer';
import { 
  Target, 
  Home as HomeIcon, 
  Phone, 
  Clock, 
  Award, 
  Star, 
  Shield, 
  Check, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Ruler,
  Thermometer
} from 'lucide-react';
import Navbar from '../components/Navbar';
import BookingModal from '../components/BookingModal';
import HouseInspectionTour from '../components/HouseInspectionTour';
import Link from 'next/link';
import DownloadModal from '@/components/DownloadModal';
import { motion } from 'framer-motion';

// --- Interfaces ---
interface ProcessStep {
  title: string;
  description: string;
  icon: string;
}

interface Package {
  name: string;
  features: string[];
  popular?: boolean;
}

// --- NEW PORTFOLIO INTERFACE ---
interface PortfolioItem {
  crn: string;
  service: string;
  clientName: string;
  clientProfession: string;
  comment: string;
  thumbnailUrl: string;
}

interface CounterAnimationProps {
  end: string | number;
  suffix?: string;
  duration?: number;
}

interface StaticStatProps {
  number: string | number;
  suffix: string;
}

// Helper function to parse bold text
const parseBoldText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const processSteps: ProcessStep[] = [
  { title: 'Book a Date with Us', description: 'Schedule your inspection at your convenience', icon: '📅' },
  { title: 'Key Collection', description: 'We collect keys from your designated location', icon: '🔑' },
  { title: 'Checkaro Inspection', description: 'Our certified team conducts thorough inspection', icon: '🔍' },
  { title: 'Joint Inspection', description: 'Review findings together with our expert', icon: '👥' },
  { title: 'Comprehensive Report', description: 'Detailed report with findings and recommendations', icon: '📋' },
  { title: 'Defect Rectification', description: 'Support for addressing identified issues', icon: '🔧' },
  { title: 'Verify Job Completion', description: 'Ensure all issues have been properly addressed', icon: '✅' },
  { title: 'Home Sweet Home', description: 'Enjoy your perfect, worry-free home', icon: '🏠' },
];

const packages: Package[] = [
  { 
    name: 'BASIC',
    features: [
      '**4 Point Inspection**',
      '**Civil** - Wall finish, cracks, dampness, slope. Etc',
      '**Electrical** - DB panel, switches, wiring, earthing. Etc',
      '**Plumbing** - Tap flow, leaks, pressure. Etc',
      '**Interior** - Tile work, paint finish, doors/windows. Etc',
      '**Structural Integrity**',
      '**Identifying Damp Walls or Ceilings**',
      '**Floor Area Measurement** (as per RERA)',
      '**Thermal Scan** (US-German Tech)'
    ] 
  },
  { 
    name: 'STANDARD',
    features: [
      '**4 Point Inspection**',
      '**Civil** - Wall finish, cracks, dampness, slope. Etc',
      '**Electrical** - DB panel, switches, wiring, earthing. Etc',
      '**Plumbing** - Tap flow, leaks, pressure. Etc',
      '**Interior** - Tile work, paint finish, doors/windows. Etc',
      '**German-Tech Wall Scanning**',
      '**Structural Integrity**',
      '**Identifying Damp Walls or Ceilings**',
      '**Material Quality Check**',
      '**Water Quality**',
      '**Material Check**',
      '**Floor Area Measurement** (as per RERA)',
      '**Thermal Scan** (US-German Tech)'
    ], 
    popular: true 
  },
  { 
    name: 'PREMIUM',
    features: [
      '**4 Point Inspection**',
      '**Civil** - Wall finish, cracks, dampness, slope. Etc',
      '**Electrical** - DB panel, switches, wiring, earthing. Etc',
      '**Plumbing** - Tap flow, leaks, pressure. Etc',
      '**Interior** - Tile work, paint finish, doors/windows, Marble Glossy Check. Etc',
      '**German-Tech Wall Scanning**',
      '**Structural Integrity**',
      '**Identifying Damp Walls or Ceilings**',
      '**Material Quality Check**',
      '**Water Quality**',
      '**Material Check**',
      '**Material Brand Check**',
      '**Floor Area Measurement** (as per RERA)',
      '**Material Measurement**',
      '**Borescope Deep Scan**',
      '**Thermal Scan** (US-German Tech)',
      '**Gas Meter Check**',
      '**Dedicated Inspection Manager**',
      '**Repair Estimation Report**',
      '**Premium Presentation Report**',
      '**Reinspection**'
    ] 
  },
];

// --- NEW PORTFOLIO DATA ---
const portfolioItems: PortfolioItem[] = [
    {
        crn: 'CH-07E923',
        service: 'Rental Move In Inspection',
        clientName: 'Manoj Kumar',
        clientProfession: 'Doctor',
        comment: 'Went with the Standard package from Checkaro. Prakash did a super detailed job, checked every corner patiently. Helped me catch issues early and save money.Big thanks to the team!',
        thumbnailUrl: '/PicturesforCheckaro/Portfoliopictures/07E923.png'
    },
    {
        crn: 'CH-07E969',
        service: 'Post-Renovation Inspection',
        clientName: "Tatta's Residence",
        clientProfession: 'Advocate',
        comment: "Krishna from Checkaro did the inspection for our new house. The process was super detailed – took around 5 hours. They checked every tile, paint finish, and even toilet slopes. Found that all toilets had slope issues, which we flagged to the builder.Really helpful service!",
        thumbnailUrl: '/PicturesforCheckaro/Portfoliopictures/07E969.png'
    },
    {
        crn: 'CH-07E999',
        service: 'Pre-Purchase Inspection',
        clientName: "Alladi's Residence",
        clientProfession: 'Software Engineer',
        comment: 'Absolutely worth it! I recently bought a 3600 sft triplex villa worth ₹2.5 Cr and thought everything was perfect—until the team from Checkaro did a full inspection. They uncovered 24+ hidden issues that could\'ve cost me ₹3-4lakhs down the line. Thanks to their detailed report, I was able to get the builder to fix everything free of cost before moving in. As a software professional, I highly recommend Checkaro for anyone investing in property. It\'s a small step that saved me big time!',
        thumbnailUrl: '/PicturesforCheckaro/Portfoliopictures/07E999.jpg'
    },
    {
        crn: 'CH-07E949',
        service: 'Pre-Purchase Inspection',
        clientName: 'Madhu kumar',
        clientProfession: 'Fashion Designer',
        comment: 'Booked the Basic package with Checkaro for my flat inspection in Kompally. They checked structure, plumbing, electrical, and dampness. The report was clear, well-organized, and easy to understand.Great service – thanks, Checkaro!',
        thumbnailUrl: '/PicturesforCheckaro/Portfoliopictures/07E949.png'
    },
    {
        crn: 'CH-07E936',
        service: 'Pre-Purchase Inspection',
        clientName: 'Bangaraju Villa',
        clientProfession: 'Business Owner',
        comment: "I took the Standard Package from Checkaro Home Inspection before starting interiors, and it was a great decision. On my interior designer's suggestion, I went for it—they used advanced German & US tech tools to detect issues like termites, broken tiles, floor slope errors, and wall leakage. Very professional team with a detailed report. Highly recommend for new homeowners!",
        thumbnailUrl: '/PicturesforCheckaro/Portfoliopictures/07E936.png'
    },
    {
        crn: 'CH-07E972',
        service: 'Rental Move Out Inspection',
        clientName: 'Rishika residence',
        clientProfession: 'Architect',
        comment: 'I used Checkaro for my move-in and move-out inspections. The move-out report helped me show my owner the issues on his side and avoid charges in the debit note.',
        thumbnailUrl: '/PicturesforCheckaro/Portfoliopictures/07E972.jpg'
    }
];

// --- Helper Components for the new Banner Section ---
const CounterAnimation: React.FC<CounterAnimationProps> = ({ end, suffix = "", duration = 800 }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    const endValue = parseInt(end.toString());
    const increment = endValue / (duration / 16); // ~60fps
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [hasStarted, end, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      onViewportEnter={() => setHasStarted(true)}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="text-5xl font-bold text-orange-500 mb-2">
        {count}{suffix}
      </div>
    </motion.div>
  );
};

const StaticStat: React.FC<StaticStatProps> = ({ number, suffix }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5 }}
    className="text-center"
  >
    <div className="text-5xl font-bold text-orange-500 mb-2">
      {number}{suffix}
    </div>
  </motion.div>
);

// --- Main Component ---
const Home = () => {
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const projectsCarouselRef = useRef<HTMLDivElement>(null);
  const [hasUserOpenedBooking, setHasUserOpenedBooking] = useState<boolean>(false);
  
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const checkScrollPosition = () => {
    if (projectsCarouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = projectsCarouselRef.current;
      setShowLeftArrow(scrollLeft > 5); // Use a small buffer
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5); // Use a small buffer
    }
  };

  useEffect(() => {
    const carousel = projectsCarouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollPosition, { passive: true });
      // Initial check
      checkScrollPosition();
      
      // Re-check on window resize
      window.addEventListener('resize', checkScrollPosition);

      return () => {
        carousel.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [portfolioItems]);

  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = ref.current.offsetWidth * 0.8; 
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      
      // The scroll event listener will naturally update the arrows,
      // but a timeout can help catch the state after the smooth scroll animation.
      setTimeout(checkScrollPosition, 500);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasUserOpenedBooking) {
        setIsBookingOpen(true);
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [hasUserOpenedBooking]);

  useEffect(() => {
    const timer = setInterval(() => {
      requestAnimationFrame(() => {
        setActiveStep((prev) => (prev + 1) % processSteps.length);
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleBookingOpen = () => {
    setHasUserOpenedBooking(true);
    setIsBookingOpen(true);
  };

  const sectionTitleAnimation = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeInOut" },
    viewport: { once: true, amount: 0.3 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const inspectionServices = [
    {
      title: "Certified Professionals",
      image: "/why_checkaro/icon1.png",
      points: [
        "Our experts undergo rigorous training to deliver top-notch inspections",
        "Backed by years of on-site inspection experience across home inspection"
      ]
    },
    {
      title: "Advanced Technology", 
      image: "/why_checkaro/icon2.png",
      points: [
        "Backed by advanced German technology for precise measurements and defect detection",
        "Utilizes thermal imaging and moisture detection techniques used in global inspection standards"
      ]
    },
    {
      title: "Detailed Report",
      image: "/why_checkaro/icon3.png",
      points: [
        "Covers every area of the property with a room-by-room breakdown",
        "Includes clear visuals, defect highlights, and lifetime access to the report"
      ]
    },
    {
      title: "Save Money",
      image: "/why_checkaro/icon4.png",
      points: [
        "Save ₹4 for every ₹1 spent - our inspectors identify issues before your Defects Liability Period ends",
        "Avoid costly repairs with quality checks that ensure peace of mind"
      ]
    }
  ];

  const stats = [
    { number: "10", suffix: "+", label: "Years Experience", animated: true },
    { number: "1000", suffix: "+", label: "Home Inspections Completed", animated: true },
    { number: "99.9", suffix: "%", label: "Satisfaction Rate", animated: false },
    { number: "24", suffix: "/7", label: "Support Available", animated: false }
  ];

  return (
    <div className="min-h-screen bg-white relative border-b-0 overflow-x-hidden">
      <Navbar onBookingOpen={handleBookingOpen} />
      
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)}/>

      <main className="transition-all duration-400" id="main-content">
        {/* Hero Section */}
        <section 
          id="home" 
          className="w-full h-screen flex items-center relative pt-16 md:pt-0"
          style={{ 
            backgroundImage: 'url("/PicturesforCheckaro/frontpage/herobglaptop.png")', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center center', 
            backgroundRepeat: 'no-repeat', 
            width: '100%' 
          }}
        > 
          <div className="w-full px-3 relative z-10"> 
            <div className="grid lg:grid-cols-2 gap-8 items-center"> 
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
                className="space-y-4 mt-[-30vh] md:mt-0"
              > 
                <motion.h1 
                  variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
                  className="text-4xl md:text-5xl font-bold text-white mb-4"
                > 
                  Home Inspection Services<br />
                  <span className="md:text-orange-500">In Hyderabad</span> 
                </motion.h1> 
                <motion.p 
                  variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
                  className="text-lg md:text-xl text-white leading-relaxed max-w-lg"
                > 
                  With ChecKaro, detect issues early, save money, and live stress-free.
                </motion.p> 
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                  className="flex flex-col sm:flex-row gap-3 pt-3"
                > 
                  <button 
                    onClick={() => setIsDownloadModalOpen(true)} 
                    className="bg-orange-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2" 
                  > 
                    <span>Download sample Report</span> 
                    <ArrowRight size={16} /> 
                  </button>
                </motion.div> 
              </motion.div> 
            </div> 
          </div>
          
          <motion.div 
            className="absolute bottom-6 left-6 z-20 hidden md:block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                  </svg>
                </div>
                <p className="text-white text-m">100% Reliable</p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <p className="text-white text-m">1000+ Inspections</p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                    <path d="m12 19 7-7 3 3-7 7-3-3z"></path>
                    <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                    <path d="m2 2 7.586 7.586"></path>
                    <circle cx="11" cy="11" r="2"></circle>
                  </svg>
                </div>
                <p className="text-white text-m">Expert Team</p>
              </div>
            </div>
          </motion.div>
          
          <motion.video 
            className="absolute bottom-5 right-5 z-20 w-[80vw] md:w-[600px] h-[25vh] md:h-[40vh] rounded-lg"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            preload="metadata" 
            controls 
            autoPlay 
            muted 
            loop
          > 
            <source src="/PicturesforCheckaro/Video/inspection_video.mp4" type="video/mp4" /> 
            Your browser does not support the video tag. 
          </motion.video>
        </section>

        {/* Choose an Inspection Section */}
         <section className="py-8 md:py-10 bg-gray-50">
          <div className="container mx-auto px-3">
            <motion.div {...sectionTitleAnimation} className="text-center mb-8 md:mb-12">
              <h2 className="text-4xl font-bold text-black mb-3">Choose an Inspection</h2>
              <div className="h-1 w-24 mt-3 mb-3 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
                  <img 
                    src="/professional.jpg" 
                    alt="Professional Home Inspection" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mb-3">
                      <Settings className="text-white" size={24} />
                    </div>
                    <ul className="space-y-2 text-center">
                      <li className="flex items-center space-x-2 text-m">
                        <CheckCircle className="text-orange-400" size={14} />
                        <span>Certified Inspector Team</span>
                      </li>
                      <li className="flex items-center space-x-2 text-m">
                        <CheckCircle className="text-orange-400" size={14} />
                        <span>Comprehensive 4-Point Inspection</span>
                      </li>
                      <li className="flex items-center space-x-2 text-m">
                        <CheckCircle className="text-orange-400" size={14} />
                        <span>Detailed Professional Report</span>
                      </li>
                      <li className="flex items-center space-x-2 text-m">
                        <CheckCircle className="text-orange-400" size={14} />
                        <span>Expert Guidance & Support</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="absolute bottom-3 left-3 group-hover:opacity-0 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <Settings className="text-white" size={20} />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-black mb-2">Professional Home Inspection</h3>
                  <p className="text-black text-base mb-4 leading-relaxed">
                    Comprehensive inspection by certified professionals covering all aspects of your property.
                  </p>
                  <button
                    onClick={handleBookingOpen}
                    className="w-full bg-orange-500 text-white py-2.5 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Book Now</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-300 h-full cursor-not-allowed group opacity-60"
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <img 
                    src="/self_home_inspection.jpg" 
                    alt="Self Home Inspection" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white p-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mb-3">
                      <Search className="text-white" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold">Coming Soon</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="bg-gray-100 text-gray-500 w-full py-2.5 rounded-lg text-center mt-4">
                    <span className="text-lg font-bold">Coming Soon</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Services Section */}
        <section id="services" className="py-8 md:py-10 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
          <div className="container mx-auto px-3">
            <motion.div {...sectionTitleAnimation} className="text-center mb-8 md:mb-12">
              <div className="inline-block">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 relative">
                  Our Services
                  <div className="h-1 w-24 mt-3 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
                </h2>
              </div>
            </motion.div>
            <div className="relative max-w-5xl mx-auto">
              <motion.div 
                className="relative z-10 grid md:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {[
                  { title: "New Home", emoji: "🏠", description: "Bought a new house? Need to check for defects before starting renovation?", color: "blue" as const },
                  { title: "Post-Renovation", emoji: "🛠️", description: "Started your renovation but unsure if your contractor is meeting the agreed-upon standards?", color: "green" as const },
                  { title: "Rental / Move-In & Move-Out", emoji: "🔑", description: "Inspect when tenants move in or out to keep your property safe and ready", color: "purple" as const }
                ].map((service, index) => {
                  const colorClasses: Record<typeof service.color, any> = {
                    blue: { bg: 'bg-blue-50', border: 'border-blue-200', hoverBg: 'hover:bg-blue-500', button: 'bg-orange-500', accent: 'bg-blue-500' },
                    green: { bg: 'bg-green-50', border: 'border-green-200', hoverBg: 'hover:bg-green-500', button: 'bg-orange-500', accent: 'bg-green-500' },
                    purple: { bg: 'bg-purple-50', border: 'border-purple-200', hoverBg: 'hover:bg-purple-500', button: 'bg-orange-500', accent: 'bg-purple-500' }
                  };
                  const colors = colorClasses[service.color];
                  return (
                    <motion.div key={index} variants={staggerItem} className="relative group cursor-pointer transition-all duration-400 ease-out transform hover:scale-105" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <div className={`relative p-6 rounded-2xl border-2 backdrop-blur-sm ${colors.bg} ${colors.border} ${colors.hoverBg} shadow-md hover:shadow-lg transition-all duration-400 h-80 flex flex-col justify-between`}>
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-white/60 group-hover:bg-white/20 group-hover:scale-110 group-hover:rotate-12 shadow-md transition-all duration-400 transform"> 
                            {service.emoji} 
                          </div>
                        </div>
                        <div className="text-center flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-white transition-colors duration-400 min-h-[2.5rem] flex items-center justify-center">
                              {service.title}
                            </h3>
                            <div className="min-h-[4rem] flex items-center justify-right mb-4">
                              <p className="text-m leading-relaxed text-black group-hover:text-white/90 transition-colors duration-400 line-clamp-3">
                                {service.description}
                              </p>
                            </div>
                          </div>
                          <div className="mt-auto">
                            <Link href="/services">
                              <button className={`inline-flex items-center px-6 py-2 rounded-full font-semibold ${colors.button} text-white hover:scale-105 group-hover:bg-white group-hover:text-gray-800 group-hover:shadow-md transition-all duration-300 transform`}>
                                Learn More
                                <svg className="ml-1.5 w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </Link>
                          </div>
                        </div>
                        <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-200 group-hover:${colors.accent} group-hover:scale-125 transition-all duration-400 transform`}></div>
                        <div className={`absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-gray-300 group-hover:${colors.accent} group-hover:scale-110 transition-all duration-400 transform`}></div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
              <div className="text-center mt-8 md:mt-12">
                <div className="inline-flex items-center space-x-2 text-gray-600 text-s font-large">
                  <span>Ready to get started?</span>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Checkaro Section */}
        <section className="py-8 md:py-10 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
          <div className="container mx-auto px-3">
            <motion.div {...sectionTitleAnimation} className="text-center mb-8 md:mb-12">
              <h2 className="md:text-4xl text-3xl font-bold text-black mb-3 relative">
                Why ChecKaro
                <div className="h-1 w-24 mt-3 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-8 mb-6 md:mb-8">
              {inspectionServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-40 h-40 mx-auto mb-4">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-4">
                    {service.title}
                  </h3>
                  <div className="space-y-2">
                    {service.points.map((point, pointIndex) => (
                      <div key={pointIndex} className="flex items-start space-x-2 text-left">
                        <CheckCircle className="text-orange-500 flex-shrink-0 mt-1.5" size={16} />
                        <span className="text-black text-base leading-relaxed">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <button 
                onClick={handleBookingOpen}
                className="inline-flex items-center px-8 py-3 rounded-full text-lg font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors transform hover:scale-105 shadow-lg"
              >
                Book Inspection
                <ArrowRight className="ml-2" size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Interactive House Tour Section */}
        <motion.section id="inspection-tour" className="py-0 md:py-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6 }}>
            <HouseInspectionTour onDownloadModalOpen={() => setIsDownloadModalOpen(true)} />
        </motion.section>

        {/* Process Steps Section */}
        <section id="processsteps" className="py-8 md:py-10 bg-gray-50">
          <div className="container mx-auto px-3">
            <motion.div {...sectionTitleAnimation} className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl font-bold text-black mb-3">Our home inspection steps are simple and easy to understand: Book – Inspect – Report – Relax</h2>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: "easeOut" }} className="max-w-5xl mx-auto">
              <div className="md:hidden">
                <div className="overflow-x-auto pb-3 -mx-3 px-3"><div className="flex space-x-3 min-w-max">
                  {processSteps.map((step, index) => (<motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }} className={`flex-shrink-0 w-52 p-3 rounded-lg transition-all duration-300 ${index === activeStep? 'bg-orange-500 text-white shadow-md' : 'bg-white text-black shadow-sm'}`}>
                    <div className="text-center"><div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mb-2 mx-auto ${index === activeStep ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-500'}`}>{index + 1}</div><div className="text-lg mb-1">{step.icon}</div><h3 className="font-bold text-lg mb-1">{step.title}</h3><p className="text-sm opacity-90 leading-relaxed">{step.description}</p></div>
                  </motion.div>))}
                </div></div>
                <div className="text-center mt-3"><p className="text-sm text-gray-500">← Swipe to explore all steps →</p></div>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center justify-between mb-6 relative">
                  {processSteps.map((step, index) => (<React.Fragment key={index}><button onClick={() => setActiveStep(index)} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 z-10 relative flex-shrink-0 ${index <= activeStep? 'bg-orange-500 text-white shadow-md transform scale-110' : 'bg-white text-gray-400 border-2 border-gray-200 hover:border-orange-300'}`}>{index + 1}</button>{index < processSteps.length - 1 && (<div className="flex-1 h-0.5 mx-1.5 bg-gray-200 relative"><div className={`h-full bg-orange-500 transition-all duration-400 ${index < activeStep ? 'w-full' : 'w-0'}`}/></div>)}</React.Fragment>))}
                </div>
                <div className="relative overflow-hidden bg-white rounded-lg shadow-lg min-h-[160px]">
                  {processSteps.map((step, index) => (<div key={index} className={`absolute inset-0 p-6 transition-transform duration-400 ease-in-out ${index === activeStep? 'transform translate-x-0' : index < activeStep? 'transform -translate-x-full' : 'transform translate-x-full'}`}>
                    <div className="text-center"><div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3"><span className="text-2xl">{step.icon}</span></div><h3 className="text-xl font-bold text-black mb-3">{step.title}</h3><p className="text-black text-lg leading-relaxed max-w-lg mx-auto">{step.description}</p></div>
                  </div>))}
                </div>
                <div className="flex justify-center mt-4 space-x-1.5">{processSteps.map((_, index) => (<button key={index} onClick={() => setActiveStep(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeStep? 'bg-orange-500 scale-125' : 'bg-gray-300 hover:bg-orange-300'}`}/>))}</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Packages Section */}
        <section id="packages" className="py-8 md:py-10">
          <div className="container mx-auto px-3">
            <motion.div {...sectionTitleAnimation} className="text-center mb-8 md:mb-12">
              <h2 className="text-4xl font-bold text-black mb-3">Packages</h2>
              <div className="h-1 w-24 mt-3 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            </motion.div>
            
            {/* Mobile View */}
            <div className="md:hidden">
              <div className="relative overflow-hidden">
                <div 
                  className="overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide" 
                  style={{
                    scrollSnapType: 'x mandatory',
                    scrollPaddingLeft: '1rem',
                    scrollPaddingRight: '1rem'
                  }}
                >
                  <div className="flex space-x-4 px-1" style={{width: 'max-content'}}>
                    {packages.map((pkg, index) => ( 
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 24 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }} 
                        transition={{ duration: 0.5, delay: index * 0.1 }} 
                        className={`flex flex-col flex-shrink-0 bg-white rounded-lg shadow-md relative transition-all duration-300 ${pkg.popular ? 'border-2 border-orange-500 shadow-lg' : 'hover:shadow-lg'} w-72 max-w-[85vw]`}
                        style={{
                          scrollSnapAlign: 'start',
                          minHeight: '650px'
                        }}
                      >
                        {pkg.popular && (
                          <div 
                            className="absolute bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md z-20 border-2 border-white mt-2"
                            style={{
                              top: '-8px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Most Popular
                          </div>
                        )}
                        <div className={`bg-gradient-to-r from-orange-50 to-orange-100 p-3 text-center transition-all duration-300 rounded-t-lg ${pkg.popular ? 'pt-6' : 'pt-3'}`}>
                          <h3 className="text-lg font-bold text-black mb-1">{pkg.name}</h3>
                        </div>
                        <div className="p-3 flex flex-col flex-grow">
                          <ul className="space-y-1.5 mb-4 flex-grow">
                            {pkg.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start space-x-2">
                                <CheckCircle className="text-orange-500 flex-shrink-0 mt-0.5" size={12} />
                                <span className="text-black text-xs leading-relaxed break-words">
                                  {parseBoldText(feature)}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <button 
                            onClick={handleBookingOpen} 
                            className={`w-full mt-auto py-2 px-2 rounded-md text-sm font-semibold transition-all duration-300 ${pkg.popular? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-sm' : 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50'}`}
                          >
                            Choose {pkg.name}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-center mt-3">
                <p className="text-sm text-gray-500">← Swipe to see all packages →</p>
              </div>
            </div>

            {/* Desktop View */}
            <motion.div 
              className="hidden md:grid md:grid-cols-3 gap-6" 
              variants={staggerContainer} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, amount: 0.2 }}
            >
              {packages.map((pkg, index) => (
                <motion.div 
                  key={index} 
                  variants={staggerItem} 
                  className={`flex flex-col bg-white rounded-lg shadow-md relative overflow-hidden transition-all duration-300 transform ${pkg.popular ? 'border-2 border-orange-500 md:scale-105 hover:scale-110 md:hover:scale-110' : 'hover:shadow-lg hover:scale-105'}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md z-20 border-2 border-white mt-2">
                      Most Popular
                    </div>
                  )}
                  <div className={`bg-gradient-to-r from-orange-50 to-orange-100 p-4 text-center transition-all duration-300 ${pkg.popular ? 'pt-6' : 'pt-4'}`}>
                    <h3 className="text-xl font-bold text-black mt-2 mb-2">{pkg.name}</h3>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <ul className="space-y-2 mb-6 flex-grow">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-2 transition-all duration-300 transform hover:translate-x-1 hover:text-gray-900">
                          <CheckCircle className="text-orange-500 flex-shrink-0 mt-1.5" size={14} />
                          <span className="text-black text-base leading-relaxed">
                            {parseBoldText(feature)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={handleBookingOpen} 
                      className={`w-full mt-auto py-2 px-3 rounded-md text-lg font-semibold transition-all duration-300 transform active:scale-95 ${pkg.popular ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-md hover:scale-105 shadow-sm' : 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:shadow-sm hover:scale-105 hover:border-orange-600'}`}
                    >
                      Choose {pkg.name}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">*Terms and conditions apply</p>
            </div>
          </div>
        </section>

        {/* Community Banner Section */}
        <section id="about" className="py-8 md:py-10">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 md:mb-12"
            >
              <p className="text-orange-500 text-xl font-bold mb-2">Confidence Starts Here!</p>
              <h2 className="text-4xl font-bold text-black mb-8">
                Trusted by the Community
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-6 md:mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  {stat.animated ? (
                    <CounterAnimation 
                      end={stat.number} 
                      suffix={stat.suffix}
                      duration={800 + (index * 100)}
                    />
                  ) : (
                    <StaticStat 
                      number={stat.number} 
                      suffix={stat.suffix}
                    />
                  )}
                  <p className="text-black text-base mt-1.5 leading-relaxed px-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <Link href="/portfolio">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md text-lg font-semibold transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl">
                  Read Our Reviews
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-8 md:py-10 bg-gray-50">
          <div className="container mx-auto px-3">
            <motion.div {...sectionTitleAnimation} className="text-center mb-8 md:mb-12">
              <h2 className="text-4xl font-bold text-black mb-3">Client Success Stories</h2>
              <div className="h-1 w-24 mt-3 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            </motion.div>

            {/* Mobile View */}
            <div className="block md:hidden">
              <div className="relative overflow-hidden">
                <div 
                  className="overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide" 
                  style={{
                    scrollSnapType: 'x mandatory',
                    scrollPaddingLeft: '1rem',
                    scrollPaddingRight: '1rem'
                  }}
                >
                  <div className="flex space-x-4 px-1" style={{width: 'max-content'}}>
                    {portfolioItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex-shrink-0 w-80 max-w-[85vw] bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        style={{ scrollSnapAlign: 'start' }}
                      >
                        <div className="relative h-48 rounded-t-lg overflow-hidden">
                          <img 
                            src={item.thumbnailUrl} 
                            alt={`${item.clientName} Project`}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                            {item.crn}
                          </span>
                        </div>
                        <div className="p-6">
                          <div className="mb-3">
                            <h3 className="font-bold text-xl text-black">{item.clientName}</h3>
                            <p className="text-orange-500 text-sm font-medium">{item.clientProfession}</p>
                          </div>
                          <p className="text-gray-600 text-sm mb-2 font-medium">{item.service}</p>
                          <div className="relative">
                            <p className={`text-black text-sm leading-relaxed ${
                              expandedProject === index ? '' : 'line-clamp-3'
                            }`}>
                              {item.comment}
                            </p>
                            {item.comment.length > 120 && (
                              <button
                                onClick={() => setExpandedProject(expandedProject === index ? null : index)}
                                className="text-orange-500 text-xs font-medium mt-1.5 hover:text-orange-600 transition-colors"
                              >
                                {expandedProject === index ? 'Read Less' : 'Read More'}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-center mt-3">
                <p className="text-sm text-gray-500">← Swipe to see more stories →</p>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
              <div className="relative">
                {showLeftArrow && (
                  <button
                    onClick={() => handleScroll(projectsCarouselRef, 'left')}
                    className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 z-20 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="text-gray-700" size={24} />
                  </button>
                )}
                
                <div 
                  ref={projectsCarouselRef}
                  className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide"
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {portfolioItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <div className="relative h-48 rounded-t-lg overflow-hidden">
                        <img 
                          src={item.thumbnailUrl} 
                          alt={`${item.clientName} Project`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                          {item.crn}
                        </span>
                      </div>
                      <div className="p-6">
                        <div className="mb-3">
                          <h3 className="font-bold text-xl text-black">{item.clientName}</h3>
                          <p className="text-orange-500 text-sm font-medium">{item.clientProfession}</p>
                        </div>
                        <p className="text-gray-600 text-sm mb-2 font-medium">{item.service}</p>
                        <div className="relative">
                          <p className={`text-black text-sm leading-relaxed ${
                            expandedProject === index ? '' : 'line-clamp-3'
                          }`}>
                            {item.comment}
                          </p>
                          {item.comment.length > 120 && (
                            <button
                              onClick={() => setExpandedProject(expandedProject === index ? null : index)}
                              className="text-orange-500 text-xs font-medium mt-1.5 hover:text-orange-600 transition-colors"
                            >
                              {expandedProject === index ? 'Read Less' : 'Read More'}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {showRightArrow && (
                  <button
                    onClick={() => handleScroll(projectsCarouselRef, 'right')}
                    className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4 z-20 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="text-gray-700" size={24} />
                  </button>
                )}
              </div>
              <div className="text-center mt-3">
                <p className="text-sm text-gray-500">← Use arrows to see more stories →</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      <style jsx global>{`
        .scrollbar-hide {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* WebKit */
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          body {
            overflow-x: hidden;
          }
          .overflow-x-auto {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;