import React, { useState } from 'react';
import { Calendar, MapPin, ArrowRight, ArrowUpRight, Sparkles, ZoomIn } from 'lucide-react';
import { PosterModal } from './PosterModal';

export function HeroSection({ siteConfig }) {
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  const scrollToCompetitions = () => {
    const el = document.getElementById('competitions');
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const posterImg = siteConfig?.posterUrl || '/poster.jpg';
  const logoImg = siteConfig?.logoUrl || '/logo.png';
  const hasRegisterUrl = Boolean(siteConfig?.registrationUrl && siteConfig.registrationUrl.trim() !== '');

  return (
    <section id="hero" className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Main Info */}
          <div className="hero-content">
            <div className="hero-badge-group">
              <span className="hero-label">
                <Sparkles size={14} color="#2878D0" />
                {siteConfig?.institutionName ? 'Sree Buddha College of Engineering' : 'SBCE'} × {siteConfig?.associationName || 'Operation Toofan'}
              </span>
            </div>

            <div className="hero-logo-wrapper">
              <img 
                src={logoImg} 
                alt={`${siteConfig?.eventName || 'Udhbhavana 2027'} Official Logo`}
                className="hero-logo-img"
                fetchPriority="high"
                loading="eager"
              />
            </div>

            <div className="hero-tagline-box">
              <span className="hero-tagline">
                {siteConfig?.tagline || 'Aim IT.. Win IT'}
              </span>
            </div>

            <div className="hero-awareness-pill">
              <span>🌿</span>
              <span>{siteConfig?.awarenessMessage || 'No to drugs, Yes to life'}</span>
            </div>

            {/* Event Date & Venue meta */}
            <div className="hero-date-venue-meta">
              {siteConfig?.eventDate && (
                <div className="hero-meta-item">
                  <Calendar size={18} className="hero-meta-icon" />
                  <span>{siteConfig.eventDate}</span>
                </div>
              )}
              {siteConfig?.venue && (
                <div className="hero-meta-item">
                  <MapPin size={18} className="hero-meta-icon" />
                  <span>{siteConfig.venue}</span>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="hero-cta-group">
              <button 
                type="button" 
                className="btn btn-primary btn-lg"
                onClick={scrollToCompetitions}
              >
                {siteConfig?.heroExploreBtnText || 'Explore Competitions'}
                <ArrowRight size={18} />
              </button>
              {hasRegisterUrl && (
                <a 
                  href={siteConfig.registrationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary btn-lg"
                >
                  {siteConfig?.heroRegisterBtnText || 'Register Now'}
                  <ArrowUpRight size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Poster Visual with interactive modal preview */}
          <div className="hero-visual">
            <div 
              className="poster-preview-card"
              onClick={() => setIsPosterModalOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsPosterModalOpen(true); }}
              aria-label="View official event poster full size"
            >
              <div className="poster-thumb-wrapper">
                <img 
                  src={posterImg} 
                  alt="Official Event Poster Preview" 
                  className="poster-thumb-img" 
                />
                <div className="poster-overlay-badge">
                  <ZoomIn size={13} />
                  <span>Tap to expand</span>
                </div>
              </div>
              <p className="poster-caption">Official Event Poster • Sree Buddha College</p>
            </div>
          </div>
        </div>
      </div>

      <PosterModal 
        isOpen={isPosterModalOpen} 
        onClose={() => setIsPosterModalOpen(false)} 
        posterUrl={posterImg}
        title="Udhbhavana 2027 Official Poster"
      />
    </section>
  );
}
