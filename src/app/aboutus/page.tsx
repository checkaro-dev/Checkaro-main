'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';

// --- ICONS ---
import {
  ArrowRightIcon,
  BanknotesIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  EyeIcon,
  HomeIcon,
  LightBulbIcon,
  MagnifyingGlassIcon, // Correct, existing icon
  RocketLaunchIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

// --- TYPE DEFINITIONS for Full Type Safety ---
type IconComponentType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface DynamicCounterProps {
  end: number;
  duration?: number;
}

interface WelcomeStat {
  icon: IconComponentType;
  label: string;
  value: React.ReactNode;
  color: string;
}

interface WelcomeFeature {
  icon: IconComponentType;
  text: string;
  color: string;
}

interface CoreCommitment {
  text: string;
  icon: IconComponentType;
  description: string;
  color: string;
}

interface CultureItem {
    text: string;
    icon: IconComponentType;
}

interface TeamMember {
  name: string;
  role: string;
  initial: string;
  gradient: string;
}

// --- DYNAMIC COUNTER COMPONENT ---
const DynamicCounter: React.FC<DynamicCounterProps> = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (startTime.current === null) {
        startTime.current = timestamp;
      }
      
      const elapsed = timestamp - (startTime.current || 0);
      const percentage = Math.min(elapsed / duration, 1);
      const currentVal = Math.floor(percentage * end);
      setCount(currentVal);

      if (elapsed < duration) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startTime.current = null;
          animationFrameId.current = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [end, duration]);

  return <span ref={ref}>{count}</span>;
};


// --- MAIN PAGE COMPONENT ---
const AboutUsPage: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const sectionTitleAnimation = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.5 },
  };

  const welcomeFeatures: WelcomeFeature[] = [
    { icon: BanknotesIcon, text: "Cost Saving", color: "text-blue-500" },
    { icon: DocumentTextIcon, text: "Comprehensive Report", color: "text-green-500" },
    { icon: WrenchScrewdriverIcon, text: "Problem Identification and Remedies", color: "text-yellow-500" }
  ];

  const welcomeStats: WelcomeStat[] = [
    { icon: ClockIcon, label: "Years Experience", value: "10+", color: "from-blue-500 to-blue-600" },
    { icon: HomeIcon, label: "Homes Inspected", value: <><DynamicCounter end={1000} />+</>, color: "from-green-500 to-green-600" },
    { icon: StarIcon, label: "Satisfaction Rate", value: "99%", color: "from-yellow-500 to-yellow-600" },
    { icon: ShieldCheckIcon, label: "Support Available", value: "24/7", color: "from-purple-500 to-purple-600" }
  ];

  const coreCommitments: CoreCommitment[] = [
    { text: 'Transparency', icon: SparklesIcon, description: 'Clear communication and detailed reporting.', color: 'from-orange-400 to-orange-600' },
    { text: 'Accuracy', icon: CheckCircleIcon, description: 'Precise identification of issues with documentation.', color: 'from-green-400 to-green-600' },
    { text: 'Timeliness', icon: RocketLaunchIcon, description: 'Fast turnaround times without compromising quality.', color: 'from-purple-400 to-purple-600' },
    { text: 'Empowerment', icon: LightBulbIcon, description: 'Educational insights to help you make decisions.', color: 'from-yellow-400 to-yellow-600' },
    { text: 'Reliability', icon: BuildingOffice2Icon, description: 'Systematic processes ensuring safety.', color: 'from-red-400 to-red-600' },
    { text: 'Customer Focus', icon: UsersIcon, description: 'Tailored solutions that prioritize your satisfaction.', color: 'from-indigo-400 to-indigo-600' },
  ];

  const cultureItems: CultureItem[] = [
    { text: 'We value transparency.', icon: EyeIcon },
    { text: 'We ensure accuracy.', icon: ScaleIcon },
    { text: 'Trust is our priority.', icon: ShieldCheckIcon },
    { text: 'We provide clear insights.', icon: LightBulbIcon },
  ];

  const teamMembers: TeamMember[] = [
    // First row: Rithwik, Praveen, Anitha
    { name: 'Rithwik', role: 'Senior principle consultant', initial: 'R', gradient: 'from-orange-400 to-orange-600' },
    { name: 'Praveen', role: 'Senior Principal Consultant', initial: 'P', gradient: 'from-blue-400 to-cyan-600' },
    { name: 'Anitha', role: 'Technical Head', initial: 'A', gradient: 'from-purple-400 to-pink-600' },
    // Second row: Chandrababu (Senior Inspector), Prakash, Nikhil
    { name: 'Chandrababu', role: 'Senior Inspector', initial: 'C', gradient: 'from-teal-400 to-blue-500' },
    { name: 'Prakash', role: 'Inspector', initial: 'P', gradient: 'from-orange-600 to-yellow-500' },
    { name: 'Nikhil', role: 'Inspector', initial: 'N', gradient: 'from-green-400 to-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Navbar onBookingOpen={() => setIsBookingOpen(true)} />
      <main className="text-black pt-20">

        {/* --- Revamped Welcome Section --- */}
        <section id="about" className="py-6 bg-gradient-to-br from-gray-50 to-orange-50 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div {...sectionTitleAnimation} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-3">
                About ChecKaro
              </h2>
              <div className="h-1 w-24 mb-3 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-10 items-start">
              {/* Left Column */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-6"
              >
                <p className="text-black leading-relaxed text-base">
                  At ChecKaro, we conduct thorough home inspections to help you make informed decisions. Our expert engineers detect problems and provide simple, effective solutions. We adhere to ISO standards to ensure precision and reliability. Whether you are buying, selling, or maintaining your home, we're here to support you.
                </p>
                
                <div className="space-y-4">
                  {welcomeFeatures.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.text} className="flex items-center space-x-4 p-4 rounded-lg bg-white shadow-sm group">
                        <div className="p-3 rounded-md bg-gray-50 group-hover:bg-orange-50 transition-colors duration-300">
                          <Icon className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform duration-300`} />
                        </div>
                        <span className="font-medium text-black text-base">
                          {item.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-4">
                  <button 
                    onClick={() => setIsBookingOpen(true)}
                    className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center space-x-2"
                  >
                    <span className="text-lg">Get Started Today</span>
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </motion.div>
              
              {/* Right Column */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Vision & Mission Card */}
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg p-6 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-400"></div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-3">
                      <MagnifyingGlassIcon className="w-8 h-8 text-white" />
                      <h3 className="text-xl font-bold">Our Vision & Mission</h3>
                    </div>
                    <p className="text-orange-100 leading-relaxed text-base">
                      Identify defects, safeguard investments; be the leading one-stop home inspection service for peace of mind.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {welcomeStats.map(stat => {
                    const Icon = stat.icon;
                    return(
                      <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-lg p-4 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-lg cursor-pointer group`}>
                        <Icon className="w-6 h-6 mb-3 group-hover:scale-110 transition-transform duration-300" />
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-base opacity-90">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- Core Commitments Section with Centered Title --- */}
        <section id="ourcorecommitments" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-10 items-center">
              <div className="md:col-span-1 flex items-center justify-center md:justify-start">
                <h2 className="text-4xl font-bold text-black text-center md:text-left mb-6">
                  Our <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Core Commitment</span>
                </h2>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                {coreCommitments.map((commitment) => {
                  const Icon = commitment.icon;
                  return (
                    <div key={commitment.text} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 inline-block p-3 rounded-full bg-gradient-to-r ${commitment.color} text-white`}>
                        <Icon className='h-6 w-6' />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-black mb-2">{commitment.text}</h3>
                        <p className="text-black leading-relaxed text-base">{commitment.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* --- Culture Section --- */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-black mb-3">
                Our Culture
              </h2>
              <div className="h-1 w-24 mb-8 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {cultureItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-center bg-white p-6 rounded-xl shadow-md border-l-4 border-r-4 border-b-8 border-orange-400">
                      <Icon className="h-8 w-8 text-orange-500 mr-4 flex-shrink-0" />
                      <span className="text-xl text-left font-medium text-black">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* --- Team Section with Improved Spacing and Centering --- */}
        <section className="py-20 bg-white" id="ourteam">
          <div className="container mx-auto px-6">
            <motion.div 
              {...sectionTitleAnimation} 
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                Meet Our <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Team</span>
              </h2>
              <div className="h-1 w-24 mb-3 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            </motion.div>
            
            {/* Improved Team Grid with Better Spacing and Centering */}
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 max-w-4xl">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-3 border border-gray-100 group w-full max-w-sm mx-auto"
                  >
                    <div className={`w-28 h-28 rounded-full mx-auto mb-6 bg-gradient-to-r ${member.gradient} flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {member.initial}
                    </div>
                    <h3 className="text-xl font-bold text-black mb-3">
                      {member.name}
                    </h3>
                    <p className="text-orange-600 font-semibold text-base leading-relaxed">
                      {member.role}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Optional: Add a subtle background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-orange-100 rounded-full opacity-10 -translate-y-1/2"></div>
              <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-red-100 rounded-full opacity-10"></div>
            </div>
          </div>
        </section>

        <Footer />
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      </main>
    </div>
  );
};

export default AboutUsPage;