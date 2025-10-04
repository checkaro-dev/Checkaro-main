'use client';

import React, { useState, useEffect, useRef, forwardRef, useLayoutEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { ChevronLeft, ChevronRight, Home, Package, CheckCircle2, Wrench, Building, Lightbulb, ShieldCheck, Eye} from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import BookingModal from '@/components/BookingModal';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger, Flip);

// DefectCarousel Component with Faster Animations
const DefectCarousel: React.FC<{ defects: DefectItem[]; isMobileView: boolean }> = ({ defects, isMobileView }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ITEMS_VISIBLE = 5; 
  const maxIndex = defects.length > ITEMS_VISIBLE ? defects.length - ITEMS_VISIBLE : 0;

  const nextDefect = useCallback(() => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevDefect = useCallback(() => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    cardRefs.current = Array(defects.length).fill(null);
  }, [defects]);

  useLayoutEffect(() => {
    if (isMobileView || hasAnimatedIn || !desktopContainerRef.current) {
      return;
    }

    const container = desktopContainerRef.current;
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];

    if (cards.length === 0) {
      return;
    }

    setIsAutoPlaying(false);

    // Set container visible
    gsap.set(container, { visibility: 'visible' });
    
    // Set initial state for cards - slide up from bottom with fade
    gsap.set(cards, { 
      opacity: 0, 
      y: 100, 
      scale: 0.8,
      rotationY: 15
    });

    // Animate cards in with a wave effect - FASTER
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationY: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power3.out',
      onComplete: () => {
        setIsAutoPlaying(true);
        setHasAnimatedIn(true);
      }
    });

  }, [isMobileView, defects, hasAnimatedIn]);

  useEffect(() => {
    if (isAutoPlaying && !isMobileView && defects.length > ITEMS_VISIBLE) {
      autoPlayIntervalRef.current = setInterval(nextDefect, 2500);
    } else if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }
    return () => {
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    };
  }, [isAutoPlaying, isMobileView, nextDefect, defects.length, ITEMS_VISIBLE]);

  return (
    <div className="w-full">
      {isMobileView ? (
        <div className="overflow-x-auto no-scrollbar touch-pan-x py-3">
          <div className="flex space-x-3 px-3 min-w-max">
            {defects.map((defect, index) => (
              <div key={`mobile-${defect.name}-${index}`} className="w-48 flex-shrink-0">
                <div className="rounded-lg overflow-hidden shadow-md relative group h-full bg-white">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                      <h3 className="text-base font-bold text-white mb-1">{defect.name}</h3>
                      <p className="text-gray-200 text-base">Professional detection & assessment</p>
                    </div>
                    <Image
                      src={defect.image}
                      alt={defect.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-400 group-hover:scale-110"
                      priority={index < 2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={desktopContainerRef}
          className="relative w-full group/main-carousel overflow-hidden" 
          style={{ visibility: 'hidden' }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="relative carousel-wrapper">
            <div 
              className="flex transition-transform duration-600 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / ITEMS_VISIBLE)}%)` }}
            >
              {defects.map((defect, index) => (
                <div
                  key={`${defect.name}-${index}`}
                  ref={el => { cardRefs.current[index] = el; }}
                  className="w-1/5 flex-shrink-0 px-2"
                >
                  <div className="rounded-lg overflow-hidden relative group bg-white shadow-lg">
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 group-hover:from-black/90 transition-all duration-200"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-200 transition-colors">
                          {defect.name}
                        </h3>
                        <p className="text-gray-200 text-base transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                          Professional detection & assessment
                        </p>
                      </div>
                      <Image
                        src={defect.image}
                        alt={defect.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-400 group-hover:scale-110"
                        priority={index < ITEMS_VISIBLE}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={`absolute left-3 right-3 top-1/2 -translate-y-1/2 flex justify-between z-30 transition-opacity duration-300 ${isAutoPlaying ? 'opacity-100' : 'opacity-0 group-hover/main-carousel:opacity-100'}`}>
            <button
              onClick={prevDefect}
              className="bg-white/95 hover:bg-white text-black p-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-200 backdrop-blur-sm"
              aria-label="Previous defect"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextDefect}
              className="bg-white/95 hover:bg-white text-black p-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-200 backdrop-blur-sm"
              aria-label="Next defect"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ServiceCard Component
const ServiceCard = forwardRef<HTMLDivElement, {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}>(({ icon: Icon, title, description }, ref) => (
  <div
    ref={ref}
    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 relative opacity-0"
  >
    <div className="p-6">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
          {Icon && <Icon className="w-8 h-8 text-white" />}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-black group-hover:text-orange-600 transition-colors mb-3">
            {title}
          </h3>
          <p className="text-black text-base leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  </div>
));
ServiceCard.displayName = 'ServiceCard';


// BenefitBox Component
const BenefitBox = forwardRef<HTMLDivElement, { icon: React.ComponentType<{ className?: string }>; title: string; description: string }>(
  ({ icon: Icon, title, description }, ref) => (
    <div
      ref={ref}
      className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-orange-200 opacity-0"
    >
      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
        {Icon && <Icon className="w-8 h-8 text-white" />}
      </div>
      <h3 className="text-xl font-bold text-black mb-3 group-hover:text-orange-700 transition-colors">{title}</h3>
      <p className="text-black leading-relaxed text-base">{description}</p>
    </div>
  )
);
BenefitBox.displayName = 'BenefitBox';

// Interface for DefectItem
interface DefectItem {
  name: string;
  image: string;
}

// Interface for InspectionIncludes
interface InspectionIncludes {
  text: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  description: string;
}

const initialDefectsData: DefectItem[] = [
  { name: 'Cracked Tiles', image: '/PicturesforCheckaro/IYSMpics/Cracked tile.png' },
  { name: 'Plumbing Leak', image: '/PicturesforCheckaro/IYSMpics/Plumbing Leakage.png' },
  { name: 'Electrical Issues', image: '/PicturesforCheckaro/IYSMpics/electricalissues.png' },
  { name: 'Water Seepage', image: '/PicturesforCheckaro/IYSMpics/Seepage.png' },
  { name: 'Poor Finishes', image: '/PicturesforCheckaro/IYSMpics/Poor Finishes.png' },
  { name: 'Uneven Flooring', image: '/PicturesforCheckaro/IYSMpics/Uneven Flooring.png' },
  { name: 'Structural Cracks', image: '/PicturesforCheckaro/IYSMpics/Structural crack.png' },
];

// WhatsApp Icon Component
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
    <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a4 4 0 0 1 -4 -4v-1a.5 .5 0 0 0 -1 0v1" />
  </svg>
);

export default function ServicesPage() {
  const [isMobileView, setIsMobileView] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const serviceCard1Ref = useRef<HTMLDivElement>(null);
  const serviceCard2Ref = useRef<HTMLDivElement>(null);
  const serviceCard3Ref = useRef<HTMLDivElement>(null);
  const serviceCard4Ref = useRef<HTMLDivElement>(null);
  const whatsIncludedSectionRef = useRef<HTMLElement>(null);
  const includedBox1Ref = useRef<HTMLDivElement>(null);
  const includedBox2Ref = useRef<HTMLDivElement>(null);
  const includedBox3Ref = useRef<HTMLDivElement>(null);
  const whatYouGetSectionRef = useRef<HTMLElement>(null);
  const benefitBox1Ref = useRef<HTMLDivElement>(null);
  const benefitBox2Ref = useRef<HTMLDivElement>(null);
  const benefitBox3Ref = useRef<HTMLDivElement>(null);
  const benefitBox4Ref = useRef<HTMLDivElement>(null);
  const benefitBox5Ref = useRef<HTMLDivElement>(null);
  const benefitBox6Ref = useRef<HTMLDivElement>(null);
  const inspectionIncludesSectionRef = useRef<HTMLElement>(null);
  const inspectionIncludesBox1Ref = useRef<HTMLDivElement>(null);
  const inspectionIncludesBox2Ref = useRef<HTMLDivElement>(null);
  const inspectionIncludesBox3Ref = useRef<HTMLDivElement>(null);
  const inspectionIncludesBox4Ref = useRef<HTMLDivElement>(null);
  const inspectionIncludesBox5Ref = useRef<HTMLDivElement>(null);
  const inspectionIncludesBox6Ref = useRef<HTMLDivElement>(null);
  const inspectorImageRef = useRef<HTMLImageElement>(null);

  const inspectionIncludes: InspectionIncludes[] = [
    {
      text: 'What You\'ll Receive with Every Checkaro Inspection',
      icon: <Home className="text-orange-500" />,
      description: 'Clear, confident insights — every time.',
    },
    {
      text: 'Inside Your Checkaro Inspection',
      icon: <Eye className="text-orange-500" />,
      description: 'More than just a checklist — it\'s a complete protection plan.',
    },
    {
      text: 'Your Inspection. Our Full Commitment.',
      icon: <ShieldCheck className="text-orange-500" />,
      description: 'Everything you need to move forward with confidence.',
    },
    {
      text: 'From Our Toolkit to Your Doorstep',
      icon: <Wrench className="text-orange-500" />,
      description: 'Essential insights, expert-backed findings, and total peace of mind.',
    },
    {
      text: 'Your Property, Fully Examined',
      icon: <CheckCircle2 className="text-orange-500" />,
      description: 'What we deliver to help you make smarter decisions.',
    },
    {
      text: 'Clarity You Can Act On',
      icon: <Lightbulb className="text-orange-500" />,
      description: 'Accurate reports, actionable results — so you\'re never left guessing.',
    },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Inspector image tilting animation
  useEffect(() => {
    const imageElement = inspectorImageRef.current;
    if (!imageElement) return;

    // Create continuous tilting animation
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(imageElement, {
      rotation: 3,
      duration: 2,
      ease: "power2.inOut"
    })
    .to(imageElement, {
      rotation: -3,
      duration: 2,
      ease: "power2.inOut"
    })
    .to(imageElement, {
      rotation: 0,
      duration: 2,
      ease: "power2.inOut"
    });

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const cards = [serviceCard1Ref.current, serviceCard2Ref.current, serviceCard3Ref.current, serviceCard4Ref.current].filter(Boolean) as HTMLDivElement[];
    if (cards.length === 4) {
      gsap.set([cards[0], cards[2]], { autoAlpha: 0, x: -window.innerWidth - 200 });
      gsap.set([cards[1], cards[3]], { autoAlpha: 0, x: window.innerWidth + 200 });
      
      ScrollTrigger.create({
        trigger: cards[0].parentElement,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to([cards[0], cards[2]], { 
            autoAlpha: 1, 
            x: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power3.out'
          });
          
          gsap.to([cards[1], cards[3]], { 
            autoAlpha: 1, 
            x: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power3.out'
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    const section = whatsIncludedSectionRef.current;
    const boxes = [includedBox1Ref.current, includedBox2Ref.current, includedBox3Ref.current].filter(Boolean) as HTMLDivElement[];
    if (section && boxes.length === 3) {
      gsap.set(boxes, { autoAlpha: 0, x: -100 });
      ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(boxes, { 
            autoAlpha: 1, 
            x: 0, 
            duration: 0.8,
            stagger: 0.3,
            ease: 'power3.out' 
          });
        },
      });
    }
  }, []);

  useEffect(() => {
    const section = whatYouGetSectionRef.current;
    const boxes = [benefitBox1Ref.current, benefitBox2Ref.current, benefitBox3Ref.current, benefitBox4Ref.current, benefitBox5Ref.current, benefitBox6Ref.current].filter(Boolean) as HTMLDivElement[];
    if (section && boxes.length === 6) {
      gsap.set([boxes[0], boxes[3]], { autoAlpha: 0, x: -window.innerWidth - 300 });
      gsap.set([boxes[2], boxes[5]], { autoAlpha: 0, x: window.innerWidth + 300 });
      gsap.set(boxes[1], { autoAlpha: 0, y: -window.innerHeight - 300 });
      gsap.set(boxes[4], { autoAlpha: 0, y: window.innerHeight + 300 });
      
      ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to([boxes[0], boxes[3]], { 
            autoAlpha: 1, 
            x: 0, 
            duration: 0.6,
            stagger: 0.05,
            ease: 'power3.out' 
          });
          
          gsap.to([boxes[2], boxes[5]], { 
            autoAlpha: 1, 
            x: 0, 
            duration: 0.6,
            stagger: 0.05,
            ease: 'power3.out'
          });
          
          gsap.to(boxes[1], { 
            autoAlpha: 1, 
            y: 0, 
            duration: 0.6,
            ease: 'power3.out',
            delay: 0.3
          });
          
          gsap.to(boxes[4], { 
            autoAlpha: 1, 
            y: 0, 
            duration: 0.6,
            ease: 'power3.out',
            delay: 0.35
          });
        },
      });
    }
  }, []);

  useEffect(() => {
    const section = inspectionIncludesSectionRef.current;
    const boxes = [
      inspectionIncludesBox1Ref.current, 
      inspectionIncludesBox2Ref.current, 
      inspectionIncludesBox3Ref.current, 
      inspectionIncludesBox4Ref.current, 
      inspectionIncludesBox5Ref.current, 
      inspectionIncludesBox6Ref.current
    ].filter(Boolean) as HTMLDivElement[];
    
    if (section && boxes.length === 6) {
      gsap.set(boxes, { autoAlpha: 0, y: 30 });
      ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(boxes, { 
            autoAlpha: 1, 
            y: 0, 
            duration: 0.3,
            stagger: 0.05,
            ease: 'power2.out' 
          });
        },
      });
    }
  }, []);

  const navigateToPackages = () => window.location.href = '/#calculator';

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      <Navbar onBookingOpen={() => setIsBookingOpen(true)} />
      <main className="pt-0">

        {/* Defect Gallery Carousel */}
        <section className="py-12 sm:py-24 mt-3 sm:mt-6">
          <div className="container mx-auto px-3 mb-6 sm:mb-12">
            <div className="text-center">
              <h2 className="text-4xl sm:text-4xl font-bold text-black mb-2 sm:mb-3">Issues You Shouldn't Miss</h2>
              <div className="h-1 w-24 mt-2 sm:mt-3 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            </div>
          </div>
          <DefectCarousel defects={initialDefectsData} isMobileView={isMobileView} />
        </section>

        {/* Services We Offer */}
        <section id="services" className="py-16 bg-gradient-to-b from-white via-gray-50 to-white">
          <div className="container mx-auto px-3">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-3">Services We Offer</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <ServiceCard ref={serviceCard1Ref} icon={Home} title="New Home Inspections" description="Bought a new house? Need to check for defects before starting renovation?" buttonText="Book Now" onButtonClick={() => setIsBookingOpen(true)} />
              <ServiceCard ref={serviceCard2Ref} icon={Wrench} title="Post-Renovation Inspections" description="Started your renovation but unsure if your contractor is meeting the agreed-upon standards?" buttonText="Book Now" onButtonClick={() => setIsBookingOpen(true)} />
              <ServiceCard ref={serviceCard3Ref} icon={Building} title="Rental Move In/Move Out" description="Ensure a smooth transition between tenants with a detailed inspection—whether someone is moving in or out." buttonText="Book Now" onButtonClick={() => setIsBookingOpen(true)} />
              <ServiceCard ref={serviceCard4Ref} icon={Package} title="Customized Inspection" description="Residential or commercial? Customize to suit your needs. We offer both one-time and full inspection packages." buttonText="View Packages" onButtonClick={navigateToPackages} />
            </div>
          </div>
        </section>

        {/* What's Included Section */}
        <section ref={whatsIncludedSectionRef} className="py-16 bg-orange-50 relative overflow-hidden">
          <div className="container mx-auto px-3 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-3">
                What's <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Included</span>
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            </div>
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="order-1 lg:order-1 flex justify-center">
                  <div className="relative overflow-hidden rounded-lg w-fit">
                    <img 
                      src="/HomeInspector_Transparent.png" 
                      alt="Checkaro Inspector" 
                      className="lg:h-96 w-auto object-contain"
                      style={{ objectFit: 'contain' }}
                    />
                   </div>
                </div>
                <div className="space-y-6 order-2 lg:order-2">
                  <div ref={includedBox1Ref} className="bg-white rounded-xl p-6 shadow-lg border border-orange-300 hover:shadow-xl transition-shadow duration-200 opacity-0">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">1</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-black mb-3">Comprehensive Property Evaluation</h3>
                        <p className="text-black text-base leading-relaxed">
                          A qualified inspector evaluates various aspects of a property to assess its condition and identify any potential issues. Typically, <span className="font-semibold text-orange-600">86% of home inspections reveal flaws</span> that could become costly problems.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div ref={includedBox2Ref} className="bg-white rounded-xl p-6 shadow-lg border border-orange-300 hover:shadow-xl transition-shadow duration-200 opacity-0">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">2</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-black mb-3">Thorough Multi-Point Inspection</h3>
                        <p className="text-black text-base leading-relaxed">
                         Our team of inspectors and specialists conducts over <span className="font-semibold text-orange-600">200+</span> thorough checks during each house inspection, typically taking <span className="font-semibold text-orange-600">3-6 hours</span> to ensure nothing is missed.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div ref={includedBox3Ref} className="bg-white rounded-xl p-6 shadow-lg border border-orange-300 hover:shadow-xl transition-shadow duration-200 opacity-0">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">3</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-black mb-3">Detailed Reporting & Assessment</h3>
                        <p className="text-black text-base leading-relaxed">
                          After the inspection, the inspector provides a detailed report with photos and descriptions of issues. The chief engineer gives an impact assessment with prioritized recommendations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get Section */}
        <section ref={whatYouGetSectionRef} className="py-16 bg-white">
          <div className="container mx-auto px-3">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-3">What You Get</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            </div>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BenefitBox ref={benefitBox1Ref} icon={Home} title="Detailed Room-by-Room Assessment" description="We carefully inspect every corner — from living spaces to basements and attics — leaving no stone unturned." />
              <BenefitBox ref={benefitBox2Ref} icon={Package} title="HD Photo Documentation" description="Receive high-resolution images that clearly show issues, helping you understand exactly what needs attention." />
              <BenefitBox ref={benefitBox3Ref} icon={CheckCircle2} title="Digital Report Within 24 Hours" description="Get a clean, easy-to-read report delivered directly to your inbox the next day." />
              <BenefitBox ref={benefitBox4Ref} icon={Wrench} title="Repair Recommendations" description="Along with the problems, we provide suggestions for next steps — whether it's urgent fixes or long-term improvements." />
              <BenefitBox ref={benefitBox5Ref} icon={Building} title="Inspection Summary Walkthrough" description="After the inspection, our expert will walk you through the major findings and answer your questions in real time." />
              <BenefitBox ref={benefitBox6Ref} icon={WhatsAppIcon} title="WhatsApp Support" description="Direct communication channel for any questions or clarifications throughout the inspection process." />
            </div>
          </div>
        </section>

        {/* Checkaro: What Every Inspection Includes Section - About Us Style */}
<section ref={inspectionIncludesSectionRef} className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
  <div className="container mx-auto px-4">
    <div className="grid md:grid-cols-3 gap-10 items-center">
      <div className="md:col-span-1">
        <h2 className="text-4xl font-bold text-black mb-8">
          Checkaro: <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">What Every Inspection Includes</span>
        </h2>
      </div>
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        <div ref={inspectionIncludesBox1Ref} className="flex items-start space-x-3 opacity-0">
          <div className="flex-shrink-0 inline-block p-2 rounded-full bg-orange-500 text-white">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-2">{inspectionIncludes[0].text}</h3>
            <p className="text-black leading-relaxed text-base">{inspectionIncludes[0].description}</p>
          </div>
        </div>
        
        <div ref={inspectionIncludesBox2Ref} className="flex items-start space-x-3 opacity-0">
          <div className="flex-shrink-0 inline-block p-2 rounded-full bg-orange-500 text-white">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-2">{inspectionIncludes[1].text}</h3>
            <p className="text-black leading-relaxed text-base">{inspectionIncludes[1].description}</p>
          </div>
        </div>
        
        <div ref={inspectionIncludesBox3Ref} className="flex items-start space-x-3 opacity-0">
          <div className="flex-shrink-0 inline-block p-2 rounded-full bg-orange-500 text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-2">{inspectionIncludes[2].text}</h3>
            <p className="text-black leading-relaxed text-base">{inspectionIncludes[2].description}</p>
          </div>
        </div>
        
        <div ref={inspectionIncludesBox4Ref} className="flex items-start space-x-3 opacity-0">
          <div className="flex-shrink-0 inline-block p-2 rounded-full bg-orange-500 text-white">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-2">{inspectionIncludes[3].text}</h3>
            <p className="text-black leading-relaxed text-base">{inspectionIncludes[3].description}</p>
          </div>
        </div>
        
        <div ref={inspectionIncludesBox5Ref} className="flex items-start space-x-3 opacity-0">
          <div className="flex-shrink-0 inline-block p-2 rounded-full bg-orange-500 text-white">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-2">{inspectionIncludes[4].text}</h3>
            <p className="text-black leading-relaxed text-base">{inspectionIncludes[4].description}</p>
          </div>
        </div>
        
        <div ref={inspectionIncludesBox6Ref} className="flex items-start space-x-3 opacity-0">
          <div className="flex-shrink-0 inline-block p-2 rounded-full bg-orange-500 text-white">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-2">{inspectionIncludes[5].text}</h3>
            <p className="text-black leading-relaxed text-base">{inspectionIncludes[5].description}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      </main>
      <Footer />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <style jsx global>{`
        .typing-text {
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.01em;
        }
      `}</style>
    </div>
  );
}