"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Icons from 'lucide-react';

const YoutubeIcon = ({ size = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const InstagramIcon = ({ size = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Home() {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [progress, setProgress] = useState(0);
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  
  // Stats animation trigger
  const [animateStats, setAnimateStats] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState('idle'); // idle | loading | success | error
  const [formResultMsg, setFormResultMsg] = useState('');

  // --- 1. CINEMATIC LOADING TIMER ---
  useEffect(() => {
    // Track visitor page count on initial load
    fetch('/api/analytics/track', { method: 'POST' }).catch(err => 
      console.warn('Analytics tracking failed:', err)
    );

    const duration = 2000; // 2 seconds total
    const interval = 20;
    const increment = 100 / (duration / interval);
    
    let currentVal = 0;
    const timer = setInterval(() => {
      currentVal += increment;
      if (currentVal >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => {
          setLoaderComplete(true);
        }, 1200); // Wait for shatter clip-path animation to finish
      } else {
        setProgress(Math.floor(currentVal));
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // --- 2. SCROLL WATCHER (For Dot Indicators & Stat Triggers) ---
  useEffect(() => {
    const handleScroll = () => {
      // Section tracking
      const sections = ['hero', 'about', 'services', 'skills', 'contact'];
      const scrollPos = window.scrollY + window.innerHeight * 0.4; // Mid-screen trigger

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            
            // Trigger stats counting if about is visible
            if (section === 'about') {
              setAnimateStats(true);
              window.dispatchEvent(new CustomEvent('about-hover', { detail: { hovered: true } }));
            } else {
              window.dispatchEvent(new CustomEvent('about-hover', { detail: { hovered: false } }));
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- 3. 3D CARD INTERACTIVE TILT ---
  const handleCardMouseMove = (e, cardId) => {
    const card = document.getElementById(cardId);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    // Rotate maximum 12 degrees
    const tiltX = -(y - yc) / 10;
    const tiltY = (x - xc) / 10;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px) translateZ(10px)`;
    card.style.boxShadow = `0 20px 35px rgba(0, 245, 255, 0.2), 0 0 30px rgba(191, 0, 255, 0.1)`;
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  };

  const handleCardMouseLeave = (cardId) => {
    const card = document.getElementById(cardId);
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) translateZ(0px)';
    card.style.boxShadow = '';
  };

  // --- 4. CONTACT FORM TRANSMIT SUBMIT ---
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) {
      setFormStatus('error');
      setFormResultMsg('Please fill in all required fields.');
      return;
    }

    setFormStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          subject: formSubject || 'Saranraj Space Portfolio Feedback',
          message: formMessage
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormStatus('success');
        setFormResultMsg('Received. Responding at light speed. 🚀');
        // Clear fields
        setFormName('');
        setFormEmail('');
        setFormSubject('');
        setFormMessage('');
      } else {
        setFormStatus('error');
        setFormResultMsg(data.error || 'Transmission failed. Signal lost.');
      }
    } catch (err) {
      console.error(err);
      setFormStatus('error');
      setFormResultMsg('Transmission failed. Signal lost in stellar wind.');
    }
  };

  // --- 5. SMOOTH SCROLL ANCHOR CLICK ---
  const handleHeroCTA = (targetId) => {
    // Dispatch camera shake event to SpaceScene Three.js background
    window.dispatchEvent(new CustomEvent('hero-cta-click'));
    
    // Smooth scroll to targeted section
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Stats Card count up numbers
  const renderStatNumber = (targetNum, isTriggered) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      if (!isTriggered) return;
      if (targetNum === '∞') {
        setCount('∞');
        return;
      }
      const parsed = parseInt(targetNum, 10);
      let start = 0;
      const duration = 2000;
      const steps = duration / 16;
      const stepIncrement = parsed / steps;

      const counter = setInterval(() => {
        start += stepIncrement;
        if (start >= parsed) {
          setCount(parsed);
          clearInterval(counter);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(counter);
    }, [targetNum, isTriggered]);

    return <span>{count}</span>;
  };

  // Progress Bar count up percentage
  const renderProgressBar = (targetPct, isTriggered) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
      if (isTriggered) {
        setTimeout(() => {
          setWidth(targetPct);
        }, 200);
      }
    }, [targetPct, isTriggered]);

    return (
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${width}%`, transition: 'width 1.5s cubic-bezier(0.25, 0.8, 0.25, 1)' }} />
      </div>
    );
  };

  // Skills array configuration
  const hexSkills = [
    { name: 'HTML5', icon: 'Code' },
    { name: 'CSS3', icon: 'Layers' },
    { name: 'JavaScript', icon: 'Cpu' },
    { name: 'React', icon: 'Box' },
    { name: 'Node.js', icon: 'Terminal' },
    { name: 'MongoDB', icon: 'Database' },
    { name: 'Mongoose', icon: 'Workflow' },
    { name: 'Git', icon: 'GitBranch' },
    { name: 'Figma', icon: 'PenTool' },
    { name: 'Tailwind', icon: 'Wind' },
    { name: 'Next.js', icon: 'Zap' }
  ];

  const skillBars = [
    { name: 'Frontend React/Next.js Dev', pct: 95 },
    { name: 'Backend Node/Express APIs', pct: 85 },
    { name: 'Database Mongoose Modeling', pct: 80 },
    { name: 'UI/UX Interactive 3D (Three.js)', pct: 75 }
  ];

  const renderHexIcon = (iconName) => {
    const LucideIcon = Icons[iconName] || Icons.Code;
    return <LucideIcon className="hex-icon" size={24} />;
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* 🎬 1. CINEMATIC LOADER OVERLAY */}
      {!loaderComplete && (
        <div className={`loader-container ${progress === 100 ? 'shatter' : ''}`}>
          <div className="loader-counter">{progress}%</div>
          <div className="loader-bar-bg">
            <div className="loader-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* 🎯 2. PERSISTENT DOT INDICATORS */}
      <div className="section-dot-indicator">
        {['hero', 'about', 'services', 'skills', 'contact'].map((section) => (
          <div
            key={section}
            className={`dot-indicator ${activeSection === section ? 'active' : ''}`}
            onClick={() => handleHeroCTA(section)}
            title={section.toUpperCase()}
          />
        ))}
      </div>

      {/* 🌍 3. HERO SECTION */}
      <section id="hero" className="section">
        <div className="hero-content">
          <div className="hero-tag">[ FREELANCE WEB DEVELOPER ]</div>
          <div className="portfolio-label">PORTFOLIO</div>
          <div className="hero-title-container">
            <h1 className="hero-title">
              {"SARANRAJ".split("").map((letter, index) => (
                <span
                  key={index}
                  style={{
                    animation: `hero-letter-drop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`,
                    animationDelay: `${index * 80}ms`
                  }}
                >
                  {letter}
                </span>
              ))}
            </h1>
          </div>
          <p className="hero-subtitle">Building Worlds on the Web</p>
          <p className="hero-subtext">BCA Student · SRM University Ramapuram. Coding immersive high-performance websites that breathe with every click.</p>
          <div className="hero-actions">
            <button className="btn btn-primary interactive" onClick={() => router.push('/projects')}>
              View My Work <Icons.ArrowRight size={16} />
            </button>
            <button className="btn btn-secondary interactive" onClick={() => handleHeroCTA('contact')}>
              Contact Me
            </button>
          </div>
        </div>
      </section>

      {/* 👨🚀 4. ABOUT SECTION */}
      <section id="about" className="section">
        <div className="about-grid">
          <div className="about-content">
            <h2 className="about-heading">// ABOUT_ME.exe</h2>
            <div className="about-text">
              <p>Hey, I'm Saranraj — a passionate freelance web developer and BCA General student at SRM University Ramapuram. I craft high-performance, visually immersive websites that feel alive.</p>
              <p>I turn client visions into digital realities — from school portals to art e-commerce platforms. My design approach centers on cinematic transitions, interactive 3D engines, and solid database architectures.</p>
            </div>
            
            <div className="stats-grid">
              {[
                { number: '2', suffix: '+', label: 'Years Coding' },
                { number: '5', suffix: '+', label: 'Projects Shipped' },
                { number: '100', suffix: '%', label: 'Client Satisfaction' },
                { number: '∞', suffix: '', label: 'Coffee Consumed' }
              ].map((stat, i) => (
                <div 
                  key={i} 
                  id={`stat-card-${i}`}
                  className="stat-card glass"
                  onMouseMove={(e) => handleCardMouseMove(e, `stat-card-${i}`)}
                  onMouseLeave={() => handleCardMouseLeave(`stat-card-${i}`)}
                >
                  <div className="stat-number">
                    {renderStatNumber(stat.number, animateStats)}
                    {stat.suffix}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="holo-shimmer" />
                </div>
              ))}
            </div>
          </div>
          <div className="about-scene-placeholder" style={{ pointerEvents: 'none' }} />
        </div>
      </section>

      {/* ⚙️ 5. SERVICES SECTION */}
      <section id="services" className="section">
        <div className="services-container">
          <h2 className="services-heading">// SERVICE_PROTOCOLS.dll</h2>
          <p className="services-subtext">
            Unlocking immersive capabilities on the modern web. Deploying digital dimensions that bridge standard interface structures with responsive WebGL engines.
          </p>
          <div className="services-grid">
            {[
              {
                id: 'service-3d',
                title: '3D Cinematic Webapps',
                desc: 'Formulating high-performance interactive space terrains, custom shader materials, and dynamic camera flight paths via Three.js and GSAP.',
                icon: 'Boxes',
                color: '#00f5ff'
              },
              {
                id: 'service-dev',
                title: 'Full-Stack Development',
                desc: 'Deploying optimized modular web platforms with Next.js App Router, React 19, and fast asynchronous RESTful routing architectures.',
                icon: 'Cpu',
                color: '#bf00ff'
              },
              {
                id: 'service-db',
                title: 'Database Architecture',
                desc: 'Modeling secure, optimized database layers with MongoDB Atlas and Mongoose schemas, handling client analytics tracking and form streams.',
                icon: 'Database',
                color: '#ff6b35'
              }
            ].map((service) => {
              const IconComponent = Icons[service.icon] || Icons.Cpu;
              return (
                <div
                  key={service.id}
                  id={service.id}
                  className="service-card glass"
                  onMouseMove={(e) => handleCardMouseMove(e, service.id)}
                  onMouseLeave={() => handleCardMouseLeave(service.id)}
                >
                  <div className="service-icon-wrap" style={{ color: service.color, borderColor: service.color }}>
                    <IconComponent size={28} />
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-desc">{service.desc}</p>
                  <div className="holo-shimmer" />
                </div>
              );
            })}
          </div>
          
          <div className="services-cta">
            <Link href="/projects" className="btn btn-primary interactive">
              Launch Projects Sector <Icons.ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ⚡ 6. SKILLS SECTION */}
      <section id="skills" className="section">
        <div className="skills-container">
          <h2 className="skills-heading">Stellar Skills</h2>
          <div className="skills-split">
            <div className="hex-grid-container">
              <div className="hex-grid-layout">
                {hexSkills.map((skill, index) => (
                  <div 
                    key={index} 
                    className="hex-item-wrap"
                    title={skill.name}
                  >
                    <div className="hex-shape">
                      {renderHexIcon(skill.icon)}
                      <div className="hex-name">{skill.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="skills-bars">
              {skillBars.map((bar, index) => (
                <div key={index} className="bar-item">
                  <div className="bar-info">
                    <span className="bar-name">{bar.name}</span>
                    <span className="bar-pct">{bar.pct}%</span>
                  </div>
                  {renderProgressBar(bar.pct, activeSection === 'skills')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 📡 7. CONTACT SECTION */}
      <section id="contact" className="section">
        <div className="contact-container">
          <div className="contact-info">
            <h2 className="contact-heading">// Comms_Vector.net</h2>
            <p className="contact-text">
              Establish a secure connection vector to initiate collaboration. Message via form streams or reach out directly across the social void.
            </p>
            <div className="contact-methods">
              
              {/* Email Address */}
              <div className="contact-method">
                <div className="method-icon"><Icons.Mail size={20} /></div>
                <div>
                  <div className="method-label">Direct Link</div>
                  <a href="mailto:trikysaran5721@gmail.com" className="method-value interactive">
                    trikysaran5721@gmail.com
                  </a>
                </div>
              </div>

              {/* WhatsApp Hotline */}
              <div className="contact-method">
                <div className="method-icon"><Icons.MessageSquare size={20} /></div>
                <div>
                  <div className="method-label">Direct Hotline</div>
                  <div className="method-value">+91 88382 25583</div>
                  <a 
                    href="https://wa.me/918838225583" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-social btn-whatsapp interactive"
                  >
                    <Icons.Phone size={14} /> WhatsApp Link
                  </a>
                </div>
              </div>

              {/* YouTube Channel */}
              <div className="contact-method">
                <div className="method-icon"><YoutubeIcon size={20} /></div>
                <div>
                  <div className="method-label">Developer Log</div>
                  <div className="method-value">YouTube Channel</div>
                  <a 
                    href="https://www.youtube.com/@SARANRAJ848" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-social btn-youtube interactive"
                  >
                    <YoutubeIcon size={14} /> Visit My Channel
                  </a>
                </div>
              </div>

              {/* Instagram Handle */}
              <div className="contact-method">
                <div className="method-icon"><InstagramIcon size={20} /></div>
                <div>
                  <div className="method-label">Social Coordinates</div>
                  <div className="method-value">Instagram Handle</div>
                  <a 
                    href="https://www.instagram.com/triky__saran_raj/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-social btn-instagram interactive"
                  >
                    <InstagramIcon size={14} /> Visit My Page
                  </a>
                </div>
              </div>

            </div>
          </div>

          <form className="contact-form glass" onSubmit={handleContactSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="name"
                placeholder=" "
                className="form-input"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
              <label htmlFor="name" className="form-label">Identifier (Name)</label>
            </div>

            <div className="form-group">
              <input
                type="email"
                id="email"
                placeholder=" "
                className="form-input"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                required
              />
              <label htmlFor="email" className="form-label">Comms Address (Email)</label>
            </div>

            <div className="form-group">
              <input
                type="text"
                id="subject"
                placeholder=" "
                className="form-input"
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
              />
              <label htmlFor="subject" className="form-label">Subject Vector</label>
            </div>

            <div className="form-group">
              <textarea
                id="message"
                placeholder=" "
                className="form-input"
                rows={5}
                style={{ resize: 'none' }}
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                required
              />
              <label htmlFor="message" className="form-label">Transmission Data</label>
            </div>

            <button
              type="submit"
              className={`btn btn-primary btn-transmit interactive ${formStatus === 'success' ? 'success' : formStatus === 'error' ? 'error' : ''}`}
              disabled={formStatus === 'loading'}
            >
              {formStatus === 'loading' ? (
                <div className="spinner" />
              ) : formStatus === 'success' ? (
                <>TRANSMITTED <Icons.Check size={16} /></>
              ) : formStatus === 'error' ? (
                <>SIGNAL LOST <Icons.AlertTriangle size={16} /></>
              ) : (
                <>TRANSMIT SIGNAL <Icons.Send size={16} /></>
              )}
            </button>
            {formResultMsg && (
              <div className="success-msg" style={{ color: formStatus === 'error' ? 'var(--error-color)' : 'var(--success-color)' }}>
                {formResultMsg}
              </div>
            )}
          </form>
        </div>
      </section>

    </div>
  );
}
