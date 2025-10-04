'use client';

import { useState, useEffect, ReactNode } from 'react';

interface ClientSideWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Renders children only on the client side (after hydration)
 * Helps prevent "window is not defined" errors
 */
export default function ClientSideWrapper({ children, fallback = null }: ClientSideWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <>{children}</> : <>{fallback}</>;
}
