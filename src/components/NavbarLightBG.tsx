'use client';

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Phone, Mail, Menu, X, ChevronRight, Calendar, Facebook, Linkedin, Instagram, Home, Settings, Info, Calculator, MessageSquare, Contact, Search, Building, Package } from 'lucide-react';
import Image from 'next/image';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  onBookingOpen: () => void;
}

// Memoized menu item component for better performance
const MenuItem = memo(({ 
  item, 
  onClick,
  isActive,
  isScrolled,
  isMobile = false
}: { 
  item: {id: string, label: string, href: string, icon: any}, 
  onClick: (id: string) => void,
  isActive: boolean,
  isScrolled: boolean,
  isMobile?: boolean
}) => {
  if (isMobile) {
    return (
      <button
        onClick={() => onClick(item.id)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-240 w-full text-left ${
          isActive
            ? isScrolled
              ? 'bg-orange-50 text-orange-600 border-l-3 border-orange-500'
              : 'bg-orange-50 text-orange-600 border-l-3 border-orange-500'
            : isScrolled
              ? 'text-black hover:bg-orange-50 hover:text-orange-600'
              : 'text-black hover:bg-orange-50 hover:text-orange-600'
        }`}
      >
        <item.icon size={14} className={`flex-shrink-0 ${
          isActive ? 'text-orange-500' : 'text-orange-500'
        }`} />
        <span className="font-medium text-sm">{item.label}</span>
        {isActive && (
          <div className="ml-auto w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse flex-shrink-0"></div>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={() => onClick(item.id)}
      className={`relative px-2 lg:px-5 py-1.5 lg:py-2 text-xs lg:text-xs font-semibold transition-all duration-160 rounded-lg whitespace-nowrap ${
        isScrolled 
          ? isActive 
            ? 'text-orange-600 bg-orange-50' 
            : 'text-black hover:text-orange-600 hover:bg-orange-50'
          : isActive
            ? 'text-orange-600 bg-orange-50'
            : 'text-black hover:text-orange-600 hover:bg-orange-50'
      }`}
    >
      <span className="relative z-10 flex items-center space-x-1 lg:space-x-1.5">
        <item.icon size={11} className={`lg:w-3 lg:h-3 ${isActive ? 'text-orange-500' : ''}`} />
        <span className="hidden sm:inline">{item.label}</span>
      </span>
    </button>
  );
});

MenuItem.displayName = 'MenuItem';

const NavbarLightBG: React.FC<NavbarProps> = ({ onBookingOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(false);

  // Memoize menuItems to prevent unnecessary re-renders
  const menuItems = useMemo(() => [
    { id: 'home', label: 'Home', href: '/', icon: Home },
    { id: 'services', label: 'Services', href: '/services', icon: Settings },
    { id: 'portfolio', label: 'Portfolio', href: '/portfolio', icon: Building },
    { id: 'about', label: 'About Us', href: '/aboutus', icon: Info },
    { id: 'packages', label: 'Packages', href: '/#packages', icon: Package },
    { id: 'selfInspection', label: 'Self Inspection', href: '/selfInspection', icon: Search },
  ], []);

  // Get current page from URL and set active section
  useEffect(() => {
    const getCurrentPage = () => {
      const path = window.location.pathname;
      const foundItem = menuItems.find(item => item.href === path);
      if (foundItem) {
        setActiveSection(foundItem.id);
      } else if (path === '/') {
        setActiveSection('home');
      }
    };

    getCurrentPage();
    
    // Listen for browser navigation
    window.addEventListener('popstate', getCurrentPage);
    return () => window.removeEventListener('popstate', getCurrentPage);
  }, [menuItems]);

  // Handle scroll event with optimized performance
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 40;
          if (scrolled !== isScrolled) {
            setIsScrolled(scrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Set initial scroll state
    setIsScrolled(window.scrollY > 40);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // Navigate to the appropriate page or section with loading state
  const handleNavigation = useCallback(async (itemId: string) => {
    const item = menuItems.find(item => item.id === itemId);
    if (!item) return;

    setIsLoading(true);
    setActiveSection(itemId);
    setIsMobileMenuOpen(false); // Close mobile menu
    
    try {
      await new Promise(resolve => setTimeout(resolve, 120));
      
      if (item.href === '/' && window.location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.location.href = item.href;
      }
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 240);
    }
  }, [menuItems]);

  // Handle booking with feedback
  const handleBookingClick = useCallback(() => {
    setIsLoading(true);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      onBookingOpen();
      setIsLoading(false);
    }, 80);
  }, [onBookingOpen]);

  return (
    <>
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="relative flex flex-col items-center">
            <div className="relative w-13 h-13 lg:w-19 lg:h-19">
              <div className="absolute inset-0 rounded-full border-3 border-orange-200/30 animate-spin"></div>
              <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-orange-500 animate-spin" style={{animationDuration: '0.8s'}}></div>
              <div className="absolute inset-1.5 rounded-full border-3 border-transparent border-t-orange-400 animate-spin" style={{animationDuration: '1.2s', animationDirection: 'reverse'}}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="mt-3 text-center">
              <h3 className="text-sm lg:text-base font-bold text-white drop-shadow-md">Loading...</h3>
              <p className="text-xs lg:text-xs text-white/80 mt-0.5">Please wait</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header 
        className={`fixed top-0 w-full z-40 transition-all duration-300 ease-out ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-1.5' 
            : 'bg-white/95 backdrop-blur-md py-2 lg:py-3'
        }`}
      >
        <div className="container mx-auto px-3 lg:px-5">
          {/* Desktop Header - Hidden on mobile/tablet */}
          <div className="hidden xl:block">
            {/* Full header when not scrolled */}
            <div className={`transition-all duration-560 ease-out ${
              isScrolled 
                ? 'opacity-0 max-h-0 overflow-hidden transform -translate-y-3' 
                : 'opacity-100 max-h-77 transform translate-y-0'
            }`}>
              {/* Top section */}
              <div className="py-3 flex items-center justify-between">
                {/* Left - Social Media Icons */}
                <div className="flex space-x-2">
                  <a 
                    href="#" 
                    className="w-8 h-8 bg-gradient-to-r from-[#1877f2] to-[#1565c0] rounded-md flex items-center justify-center text-white transition-all duration-240"
                    aria-label="Facebook"
                  >
                    <Facebook size={14} />
                  </a>
                  <a 
                    href="#" 
                    className="w-8 h-8 bg-gradient-to-r from-[#0077b5] to-[#004182] rounded-md flex items-center justify-center text-white transition-all duration-240"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={14} />
                  </a>
                  <a 
                    href="#" 
                    className="w-8 h-8 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] rounded-md flex items-center justify-center text-white transition-all duration-240"
                    aria-label="Instagram"
                  >
                    <Instagram size={14} />
                  </a>
                </div>

                {/* Center - Logo */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-3 mb-1.5">
                    <div className="relative">
                      <Image
                        src="/Checkaro_Logo_removed_bg.png"
                        alt="ChecKaro Logo"
                        width={96}
                        height={96}
                        className="h-13 w-auto object-contain"
                      />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-black tracking-wider">
                        ChecKaro
                      </h1>
                      <p className="text-xs text-orange-600 font-semibold tracking-wide mt-0.5">Inspect Today | Secure Tomorrow</p>
                    </div>
                  </div>
                </div>

                {/* Right - Contact */}
                <div className="flex items-center space-x-5">
                  <a 
                    href="mailto:info@checkaro.in" 
                    className="flex items-center space-x-2 text-black hover:text-orange-600 transition-all duration-240"
                  >
                    <Mail size={14} className="text-orange-500" />
                    <span className="text-sm font-semibold">info@checkaro.in</span>
                  </a>
                  <a 
                    href="tel:7396360908" 
                    className="flex items-center space-x-2 text-black hover:text-orange-600 transition-all duration-240"
                  >
                    <Phone size={14} className="text-orange-500" />
                    <span className="text-sm font-semibold">+91 7396360908</span>
                  </a>
                </div>
              </div>

              {/* Navigation */}
              <div className="py-2 border-t border-gray-200">
                <nav className="flex justify-center items-center space-x-1.5">
                  {menuItems.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      onClick={handleNavigation}
                      isActive={activeSection === item.id}
                      isScrolled={false}
                    />
                  ))}
                  <button
                    onClick={handleBookingClick}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-lg text-xs font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-240 animate-flash shadow-lg flex items-center space-x-1.5 disabled:opacity-70"
                  >
                    <Calendar size={13} className={isLoading ? 'animate-spin' : ''} />
                    <span>{isLoading ? 'Loading...' : 'Book Inspection'}</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Compact header when scrolled */}
            <div className={`transition-all duration-560 ease-out ${
              isScrolled 
                ? 'opacity-100 max-h-77 py-2' 
                : 'opacity-0 max-h-0 overflow-hidden'
            }`}>
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                  <Image
                    src="/Checkaro_Logo_removed_bg.png"
                    alt="ChecKaro Logo"
                    width={32}
                    height={32}
                    className="h-8 w-auto object-contain"
                  />
                  <div>
                    <h1 className="text-lg font-bold text-black">
                      ChecKaro
                    </h1>
                    <p className="text-xs text-black font-semibold -mt-0.5">Inspect Today, Secure Tomorrow</p>
                  </div>
                </div>
                
                {/* Navigation */}
                <nav className="flex items-center space-x-0.5">
                  {menuItems.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      onClick={handleNavigation}
                      isActive={activeSection === item.id}
                      isScrolled={true}
                    />
                  ))}
                </nav>
                
                {/* Contact & Book */}
                <div className="flex items-center space-x-2">
                  <a href="mailto:info@checkaro.in" className="text-black hover:text-orange-500 p-1.5 rounded-md hover:bg-orange-50">
                    <Mail size={13} />
                  </a>
                  <a href="tel:7396360908" className="text-black hover:text-orange-500 p-1.5 rounded-md hover:bg-orange-50">
                    <Phone size={13} />
                  </a>
                  <button
                    onClick={handleBookingClick}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-240 animate-flash shadow-md flex items-center space-x-1.5 disabled:opacity-70"
                  >
                    <Calendar size={11} className={isLoading ? 'animate-spin' : ''} />
                    <span>{isLoading ? 'Loading...' : 'Book Now'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Header - Shown on xl and below */}
          <div className="xl:hidden">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-0 lg:space-x-0 min-w-0 flex-1">
                <Image
                  src="/Checkaro_Logo_removed_bg.png"
                  alt="ChecKaro Logo"
                  width={32}
                  height={32}
                  className="h-6 w-6 lg:h-8 lg:w-8 object-contain flex-shrink-0"
                />
                <div className="min-w-0">
                  <h1 className="text-base lg:text-lg font-bold tracking-wide transition-all duration-240 truncate text-black">
                    ChecKaro
                  </h1>
                  <p className="text-xs font-medium -mt-0.5 transition-colors duration-240 truncate text-orange-600">
                    Inspect Today
                  </p>
                </div>
              </div>

              {/* Tablet Navigation - Hidden on mobile */}
              <nav className="hidden lg:flex xl:hidden items-center space-x-0.5 flex-shrink-0 mx-3">
                {menuItems.slice(0, 4).map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    onClick={handleNavigation}
                    isActive={activeSection === item.id}
                    isScrolled={isScrolled}
                  />
                ))}
              </nav>

              {/* Right side buttons */}
              <div className="flex items-center space-x-1.5 lg:space-x-2 flex-shrink-0">
                <a href="tel:7396360908" className="text-black hover:text-orange-500 hover:bg-orange-50 p-1.5 rounded-md transition-all duration-240">
                  <Phone size={14} />
                </a>
                <button
                  onClick={handleBookingClick}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 py-1.5 lg:px-3 lg:py-1.5 rounded-lg text-xs lg:text-xs font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-240 shadow-md flex items-center space-x-0.5 lg:space-x-1.5 disabled:opacity-70"
                >
                  <Calendar size={11} className={isLoading ? 'animate-spin' : ''} />
                  <span className="whitespace-nowrap">{isLoading ? 'Loading...' : 'Book'}</span>
                </button>
                
                {/* Mobile Menu Toggle */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-black hover:text-orange-500 hover:bg-orange-50 p-1.5 rounded-md transition-all duration-240"
                  aria-label="Toggle mobile menu"
                >
                  <div className="relative w-5 h-5">
                    <Menu size={19} className={`absolute inset-0 transition-all duration-240 ${isMobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
                    <X size={19} className={`absolute inset-0 transition-all duration-240 ${isMobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`xl:hidden overflow-hidden transition-all duration-400 ease-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="container mx-auto px-3 lg:px-5 pb-3">
            <div className="mt-3 py-3 px-2 rounded-lg bg-white shadow-lg border border-gray-100">
              <nav className="flex flex-col space-y-0.5">
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    onClick={handleNavigation}
                    isActive={activeSection === item.id}
                    isScrolled={isScrolled}
                    isMobile={true}
                  />
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default NavbarLightBG;