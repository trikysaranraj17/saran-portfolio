"use client";

import { useEffect, useRef, useState } from 'react';

export default function SmoothScroll({ children }) {
  const scrollContainerRef = useRef(null);
  const [pageHeight, setPageHeight] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);

    return () => {
      window.removeEventListener('resize', checkViewport);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Track scroll container height changes dynamically to update spacer height
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setPageHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(scrollContainer);

    let requestRef;
    let currentY = 0;
    let targetY = 0;
    const lerpFactor = 0.08;

    const handleScroll = () => {
      targetY = -window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const animateSmoothScroll = () => {
      currentY += (targetY - currentY) * lerpFactor;
      
      // Optimize drawing: snap to target if difference is negligible
      if (Math.abs(targetY - currentY) > 0.05) {
        scrollContainer.style.transform = `translate3d(0, ${currentY}px, 0)`;
      } else {
        scrollContainer.style.transform = `translate3d(0, ${targetY}px, 0)`;
        currentY = targetY;
      }
      
      requestRef = requestAnimationFrame(animateSmoothScroll);
    };

    requestRef = requestAnimationFrame(animateSmoothScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(requestRef);
      resizeObserver.disconnect();
    };
  }, [isDesktop]);

  if (!isDesktop) {
    return <div className="mobile-scroll-container">{children}</div>;
  }

  return (
    <>
      <div
        ref={scrollContainerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          overflow: 'hidden',
          willChange: 'transform',
          zIndex: 1,
        }}
      >
        {children}
      </div>
      <div style={{ height: pageHeight }} className="scroll-spacer" />
    </>
  );
}
