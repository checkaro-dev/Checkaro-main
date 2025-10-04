'use client';

import { useState, useEffect } from 'react';

/**
 * A custom hook to safely access window/browser properties during server-side rendering
 * @param serverFallback The fallback value to use during SSR
 * @param clientCallback The function to call on the client side to get the real value
 * @returns The client-side value, or the fallback value during SSR
 */
export function useClientSideValue<T>(
  serverFallback: T, 
  clientCallback: () => T
): T {
  const [value, setValue] = useState<T>(serverFallback);
  
  useEffect(() => {
    // This will only execute in the browser, after hydration
    setValue(clientCallback());
  }, [clientCallback]);
  
  return value;
}

/**
 * A custom hook specifically for checking if the screen is above a certain width
 * @param breakpointWidth The width in pixels to check against
 * @param fallback The fallback value to use during SSR (default: true)
 * @returns Boolean indicating if screen is wider than the breakpoint
 */
export function useIsWiderThan(breakpointWidth: number, fallback: boolean = true): boolean {
  return useClientSideValue(fallback, () => window.innerWidth >= breakpointWidth);
}

/**
 * A helper to safely use window on the client side
 * This will be undefined during SSR and the actual window object on the client
 */
export const getClientWindow = (): Window | undefined => {
  if (typeof window !== 'undefined') {
    return window;
  }
  return undefined;
}
