'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Safely check if code is running in a browser environment
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Hook to track responsive breakpoints
 * @returns Object with boolean values for different breakpoints
 */
export const useResponsive = () => {
  const getMatches = useCallback((query: string): boolean => {
    // Check if we're in the browser
    if (isBrowser) {
      return window.matchMedia(query).matches;
    }
    return false;
  }, []);

  // Set initial values for SSR
  const [matches, setMatches] = useState({
    isMobile: false,      // < 640px (sm)
    isTablet: false,      // >= 640px (sm) and < 1024px (lg)
    isDesktop: true,      // >= 1024px (lg)
    // Add specific breakpoint checks
    sm: true,             // >= 640px
    md: true,             // >= 768px
    lg: true,             // >= 1024px
    xl: true,             // >= 1280px
  });

  useEffect(() => {
    if (!isBrowser) return;

    const updateMatches = () => {
      setMatches({
        isMobile: getMatches('(max-width: 639px)'),
        isTablet: getMatches('(min-width: 640px) and (max-width: 1023px)'),
        isDesktop: getMatches('(min-width: 1024px)'),
        // Add specific breakpoint checks
        sm: getMatches('(min-width: 640px)'),  // Tailwind sm breakpoint
        md: getMatches('(min-width: 768px)'),  // Tailwind md breakpoint
        lg: getMatches('(min-width: 1024px)'), // Tailwind lg breakpoint
        xl: getMatches('(min-width: 1280px)'), // Tailwind xl breakpoint
      });
    };

    // Initial check
    updateMatches();

    // Set up listener for changes
    window.addEventListener('resize', updateMatches);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateMatches);
    };
  }, [getMatches]);

  return matches;
};

/**
 * Safe wrapper to get window width
 * @returns Window width (or 1024 as default during SSR)
 */
export const useWindowWidth = () => {
  const [width, setWidth] = useState(isBrowser ? window.innerWidth : 1024);

  useEffect(() => {
    if (!isBrowser) return;

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};

/**
 * Safe wrapper to get window height
 * @returns Window height (or 768 as default during SSR)
 */
export const useWindowHeight = () => {
  const [height, setHeight] = useState(isBrowser ? window.innerHeight : 768);

  useEffect(() => {
    if (!isBrowser) return;
    
    const handleResize = () => {
      setHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return height;
};

/**
 * Component to safely handle client-side rendering
 * @param children Components that need browser APIs
 * @returns The children components only rendered client-side
 */
export const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  return <>{children}</>;
};
