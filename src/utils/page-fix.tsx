'use client';
import { useEffect } from 'react';

export function PageWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      html { font-size: 16px !important; overflow-x: hidden !important; }
      body { overflow-x: hidden !important; width: 100vw !important; }
      .container { max-width: min(100vw - 2rem, 1280px) !important; }
      h1 { font-size: clamp(2rem, 6vw, 3.5rem) !important; }
      h2 { font-size: clamp(1.75rem, 5vw, 3rem) !important; }
    `;
    document.head.appendChild(style);
  }, []);
  
  return <div className="w-full overflow-x-hidden">{children}</div>;
}