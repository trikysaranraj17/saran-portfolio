"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';

export default function Projects() {
  // Fallback projects in case DB/API fails
  const fallbackProjects = [
    {
      _id: 'seed-thiruvi',
      title: 'Thiruvi School Website',
      url: 'https://thiruvikaschool.org',
      description: 'A complete institutional website for a school — admission portals, news updates, staff directory, and clean academic UI.',
      tags: ['HTML', 'CSS', 'JavaScript', 'Responsive'],
      viewCount: 147,
      accentColor: '#00f5ff'
    },
    {
      _id: 'seed-anushka',
      title: 'Anushka Resin Artistry',
      url: 'https://anushkaresinart.com',
      description: 'Elegant e-commerce portfolio for a resin art business — product showcases, custom resin collections, and seamless customer inquiries.',
      tags: ['React', 'Vercel', 'UI Design', 'E-commerce'],
      viewCount: 92,
      accentColor: '#bf00ff'
    },
    {
      _id: 'seed-artinova',
      title: 'Artinova Gift Business',
      url: 'https://artinova.vercel.app',
      description: 'A dynamic visual portal for a custom gifting business — showcase gallery, order personalization stream, and sleek catalog navigation.',
      tags: ['Next.js', 'React', 'Tailwind', 'Gifting'],
      viewCount: 78,
      accentColor: '#ff6b35'
    }
  ];

  const [projects, setProjects] = useState(fallbackProjects);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Track visitor count
    fetch('/api/analytics/track', { method: 'POST' }).catch(err => 
      console.warn('Analytics tracking failed:', err)
    );

    // Fetch projects from server in background to update if available
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setProjects(data);
          }
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    }

    fetchProjects();
  }, []);

  // Card Mouse Move Tilt effect
  const handleCardMouseMove = (e, cardId) => {
    const card = document.getElementById(cardId);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const tiltX = -(y - yc) / 10;
    const tiltY = (x - xc) / 10;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px) translateZ(15px)`;
    card.style.boxShadow = `0 20px 40px rgba(0, 245, 255, 0.25), 0 0 35px rgba(191, 0, 255, 0.15)`;
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  };

  const handleCardMouseLeave = (cardId) => {
    const card = document.getElementById(cardId);
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) translateZ(0px)';
    card.style.boxShadow = '';
  };

  const handleProjectClick = async (project) => {
    // Optimistic UI update for views
    setProjects(prev =>
      prev.map(p => p._id === project._id ? { ...p, viewCount: p.viewCount + 1 } : p)
    );

    // Call dynamic increment API in background
    try {
      await fetch(`/api/projects/${project._id}/view`, { method: 'PATCH' });
    } catch (err) {
      console.warn('Could not record view increment:', err);
    }

    // Redirect to project URL in new tab
    window.open(project.url, '_blank');
  };

  return (
    <div className="projects-page-wrapper">
      <section className="section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="projects-page-header">
          <h1 className="projects-page-title">// ACTIVE_MISSIONS.log</h1>
          <p className="projects-page-subtitle">
            A directory of deployed portals and production-ready applications launched into the web grid. Click any card to transmit to the website.
          </p>
        </div>

        {loading ? (
          <div className="projects-loading">
            <div className="spinner" style={{ margin: '0 auto 20px auto' }} />
            <p>Scanning sectors for active beacons...</p>
          </div>
        ) : (
          <div className="projects-grid-layout">
            {projects.map((project) => (
              <div
                key={project._id}
                id={`project-card-${project._id}`}
                className="project-card glass interactive"
                onMouseMove={(e) => handleCardMouseMove(e, `project-card-${project._id}`)}
                onMouseLeave={() => handleCardMouseLeave(`project-card-${project._id}`)}
                onClick={() => handleProjectClick(project)}
                style={{ cursor: 'pointer' }}
              >
                <div className="project-card-header">
                  <span className="project-tag" style={{ borderColor: project.accentColor, color: project.accentColor }}>
                    ACTIVE PORTAL
                  </span>
                  <div className="project-viewcount">
                    <Icons.Eye size={14} /> <span>{project.viewCount} clicks</span>
                  </div>
                </div>

                <div className="project-card-body">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  
                  <div className="project-tags">
                    {project.tags?.map((tag, i) => (
                      <span key={i} className="project-tag">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="project-footer">
                  <span className="project-link">
                    ENTER PORTAL <Icons.ArrowUpRight size={14} />
                  </span>
                </div>
                
                <div className="holo-shimmer" />
              </div>
            ))}
          </div>
        )}

        <div className="projects-back-btn">
          <Link href="/" className="btn btn-secondary interactive">
            <Icons.ArrowLeft size={16} /> Return to Coordinates
          </Link>
        </div>
      </section>
    </div>
  );
}
