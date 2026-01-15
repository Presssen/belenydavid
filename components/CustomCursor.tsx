import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Animation refs for the trailing effect
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const endX = useRef(0);
  const endY = useRef(0);

  useEffect(() => {
    // Check if the device has a precise pointer (mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsMobile(!mediaQuery.matches);

    const handleMouseMove = (e: MouseEvent) => {
      if (!mediaQuery.matches) return;

      // Update target position
      endX.current = e.clientX;
      endY.current = e.clientY;
      
      // Update the dot immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'textarea' ||
        target.classList.contains('cursor-pointer');
      
      setIsHovering(!!isClickable);
    };

    const animateCursor = (time: number) => {
      if (previousTimeRef.current !== undefined && mediaQuery.matches) {
        // Linear interpolation (lerp) for smooth trailing
        setPosition(prev => {
          const newX = prev.x + (endX.current - prev.x) * 0.15;
          const newY = prev.y + (endY.current - prev.y) * 0.15;
          
          if (cursorRef.current) {
            cursorRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
          }
          return { x: newX, y: newY };
        });
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(animateCursor);

    const listener = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
    mediaQuery.addEventListener('change', listener);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  // Do not render anything on mobile/tablets
  if (isMobile) return null;
  
  return (
    <>
      {/* The trailing circle */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 -ml-4 -mt-4 w-8 h-8 border border-wedding-800 rounded-full pointer-events-none z-[9999] transition-all duration-300 ease-out mix-blend-difference ${
          isHovering ? 'scale-150 bg-wedding-800/20 border-transparent' : 'scale-100'
        }`}
      />
      
      {/* The center dot */}
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 bg-wedding-900 rounded-full pointer-events-none z-[9999]"
      />
    </>
  );
};