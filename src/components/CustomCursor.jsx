"use client";

import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Prevent execution on mobile viewports for performance
    if (window.innerWidth < 768) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!visible) setVisible(true);

      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const onMouseLeave = () => {
      setVisible(false);
    };

    const onMouseEnter = () => {
      setVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Track cursor targets for hover animation triggers
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isHoverable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.hex-item-wrap') ||
        target.closest('.project-card') ||
        target.closest('.dot-indicator') ||
        target.closest('.nav-link') ||
        target.closest('.nav-logo') ||
        target.classList.contains('interactive');

      setHovered(!!isHoverable);
    };

    window.addEventListener('mouseover', handleMouseOver);

    // Animation frame callback for ring lag animation (lerp)
    let animationFrameId;
    const render = () => {
      const lerpFactor = 0.15;
      ringX += (mouseX - ringX) * lerpFactor;
      ringY += (mouseY - ringY) * lerpFactor;

      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [visible]);

  return (
    <>
      <div 
        ref={dotRef} 
        className="custom-cursor-dot" 
        style={{ 
          opacity: visible ? 1 : 0, 
          transition: 'opacity 0.2s ease',
          display: 'block'
        }} 
      />
      <div 
        ref={ringRef} 
        className={`custom-cursor-ring ${hovered ? 'hovered' : ''}`} 
        style={{ 
          opacity: visible ? 1 : 0, 
          display: 'block'
        }} 
      />
    </>
  );
}
