"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const pathname = usePathname();
  const router = useRouter();

  // Handle nav background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
      
      // Track active section only when on homepage
      if (pathname === '/') {
        const sections = ['hero', 'about', 'services', 'skills', 'contact'];
        const scrollPos = window.scrollY + window.innerHeight * 0.4;

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const top = element.offsetTop;
            const height = element.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
              setActiveSection(section);
              break;
            }
          }
        }
      } else if (pathname === '/projects') {
        setActiveSection('projects');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial run
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Handle clicking navbar links
  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);

    if (sectionId === 'projects') {
      router.push('/projects');
      return;
    }

    if (pathname === '/') {
      // Smooth scroll to element on homepage
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        // dispatch camera shake just for fun when navigating sections
        window.dispatchEvent(new CustomEvent('hero-cta-click'));
      }
    } else {
      // Navigate back to home page with hash
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo" onClick={() => handleNavClick('hero')}>
          <img src="/logo.png" alt="Saranraj TS Logo" className="nav-logo-img" />
        </div>
        
        <div className="nav-links">
          {['hero', 'about', 'services', 'skills', 'projects', 'contact'].map((item) => (
            <span
              key={item}
              className={`nav-link ${activeSection === item ? 'active' : ''}`}
              onClick={() => handleNavClick(item)}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span style={{ transform: mobileMenuOpen ? 'rotate(45deg) translate(6px, 5px)' : 'none' }}></span>
          <span style={{ opacity: mobileMenuOpen ? 0 : 1 }}></span>
          <span style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translate(6px, -5px)' : 'none' }}></span>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {['hero', 'about', 'services', 'skills', 'projects', 'contact'].map((item) => (
          <span
            key={item}
            className={`nav-link ${activeSection === item ? 'active' : ''}`}
            onClick={() => handleNavClick(item)}
          >
            {item}
          </span>
        ))}
      </div>
    </>
  );
}
