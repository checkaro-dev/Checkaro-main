'use client';

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { 
  Phone, 
  Mail, 
  Menu, 
  X, 
  Shield, 
  Calendar, 
  Facebook, 
  Linkedin, 
  Instagram, 
  BadgeCheck, 
  Home, 
  Settings, 
  Info, 
  Search, 
  Building, 
  Package 
} from 'lucide-react';
import Image from 'next/image';

interface NavbarProps {
  onBookingOpen: () => void;
}

const MenuItem = memo(({ 
  item, 
  onClick,
  isActive,
  isMobile = false
}: { 
  item: {id: string, label: string, href: string, icon: any}, 
  onClick: (id: string) => void,
  isActive: boolean,
  isMobile?: boolean
}) => {
  if (isMobile) {
    return (
      <button
        onClick={() => onClick(item.id)}
        className={`flex items-center space-x-2 px-4 py-3 rounded-md transition-all duration-300 w-full text-left ${
          isActive
            ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500'
            : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
        }`}
      >
        <item.icon size={16} className={`flex-shrink-0 ${
          isActive ? 'text-orange-500' : 'text-gray-500'
        }`} />
        <span className="font-medium text-base">{item.label}</span>
        {isActive && (
          <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full animate-pulse flex-shrink-0"></div>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={() => onClick(item.id)}
      className={`relative px-4 py-2 text-base font-medium transition-all duration-200 rounded-md ${
        isActive 
          ? 'text-black bg-orange-50' 
          : 'text-black hover:text-orange-600 hover:bg-orange-50'
      }`}
    >
      <span className="relative z-10">{item.label}</span>
      {isActive && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-orange-500 rounded-full"></div>
      )}
    </button>
  );
});

MenuItem.displayName = 'MenuItem';

const Navbar: React.FC<NavbarProps> = ({ onBookingOpen }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(false);

  const menuItems = useMemo(() => [
    { id: 'home', label: 'Home', href: '/', icon: Home },
    { id: 'services', label: 'Services', href: '/services', icon: Settings },
    { id: 'portfolio', label: 'Portfolio', href: '/portfolio', icon: Building },
    { id: 'about', label: 'About us', href: '/aboutus', icon: Info },
    { id: 'packages', label: 'Packages', href: '/#packages', icon: Package },
  ], []);
  
  useEffect(() => {
    const checkActivePage = () => {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const matchingItem = menuItems.find(item => item.href === currentPath);
        
        if (matchingItem) {
          setActiveSection(matchingItem.id);
        } else if (currentPath === '/') {
          setActiveSection('home');
        }
      }
    };

    checkActivePage();
    window.addEventListener('popstate', checkActivePage);
    return () => window.removeEventListener('popstate', checkActivePage);
  }, [menuItems]);

  const handleNavigation = useCallback(async (itemId: string) => {
  const item = menuItems.find(i => i.id === itemId);
  if (!item) return;

  setIsLoading(true);
  setIsMobileMenuOpen(false);
  setActiveSection(itemId);

  try {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const isAnchorLink = item.href.startsWith('/#');
    const targetId = isAnchorLink ? item.href.substring(2) : '';

    if (isAnchorLink && window.location.pathname === '/') {
      const element = document.getElementById(targetId);
      if (element) {
        // Calculate offset for fixed header (navbar height + some padding)
        const navbarHeight = 50; // Your navbar is h-20 (80px)
        const additionalOffset = 0; // Extra padding
        const totalOffset = navbarHeight + additionalOffset;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - totalOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else if (item.href === window.location.pathname) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = item.href;
    }
  } catch (error) {
    console.error('Navigation error:', error);
  } finally {
    setTimeout(() => setIsLoading(false), 300);
  }
}, [menuItems]);

  const handleBookingClick = useCallback(() => {
    setIsLoading(true);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      onBookingOpen();
      setIsLoading(false);
    }, 150);
  }, [onBookingOpen]);

  return (
    <>
      {isLoading && <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"></div>}
      
      <header className="fixed top-0 w-full z-40 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Increased size */}
            <div className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="ChecKaro Logo" 
                width={200} 
                height={50} 
                className="w-56 h-14 object-contain" 
                priority
              />
            </div>

            {/* Desktop Navigation with Book Inspection Button - Increased spacing */}
            <div className="hidden md:flex items-center space-x-2">
              <nav className="flex items-center space-x-6">
                {menuItems.map((item) => (
                  <MenuItem 
                    key={item.id} 
                    item={item} 
                    onClick={handleNavigation} 
                    isActive={activeSection === item.id} 
                  />
                ))}
              </nav>
              
              {/* Book Inspection Button - Now in center area */}
              <div className="ml-8">
                <button 
                  onClick={handleBookingClick} 
                  disabled={isLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 disabled:opacity-70 whitespace-nowrap"
                >
                  {isLoading ? 'Loading...' : 'Book Inspection'}
                </button>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Phone Number - Hidden on mobile */}
              <a 
                href="tel:7396360908" 
                className="hidden sm:flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors mr-4"
              >
                <Phone size={24} className="text-black" />
                <span className="font-medium">7396360908</span>
              </a>

              {/* Mobile Book Inspection Button - Only show on mobile */}
              <button 
                onClick={handleBookingClick} 
                disabled={isLoading}
                className="md:hidden bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 disabled:opacity-70 whitespace-nowrap"
              >
                {isLoading ? 'Loading...' : 'Book'}
              </button>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="py-4 border-t border-gray-100">
              <nav className="flex flex-col space-y-1">
                {menuItems.map((item) => (
                  <MenuItem 
                    key={item.id} 
                    item={item} 
                    onClick={handleNavigation} 
                    isActive={activeSection === item.id} 
                    isMobile={true} 
                  />
                ))}
              </nav>
              
              {/* Mobile Phone Number */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <a 
                  href="tel:7396360908" 
                  className="flex items-center space-x-2 px-4 py-2 text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <Phone size={16} />
                  <span className="font-medium">7396360908</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;