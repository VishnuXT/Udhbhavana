import React, { useState } from 'react';
import { Calendar, MapPin, ArrowRight, ArrowUpRight, Sparkles, ZoomIn, Clock, Trophy, FileText } from 'lucide-react';
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
  const isRegistrationOpen = siteConfig?.registrationOpen !== false;
  const showRegisterBtn = siteConfig?.showRegisterButton !== false;
  const hasRegisterUrl = Boolean(siteConfig?.registrationUrl && siteConfig.registrationUrl.trim() !== '');
  const canShowRegister = hasRegisterUrl && showRegisterBtn && isRegistrationOpen;

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
                alt={`${siteConfig?.eventName || 'Udhbhavana 2026'} Official Logo`}
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

            {/* Registration Deadline Notice on Home Screen */}
            {canShowRegister && (
              <div className="hero-registration-deadline-badge">
                <span className="hero-deadline-pulse-dot" aria-hidden="true" />
                <Clock size={14} className="hero-deadline-icon" aria-hidden="true" />
                <span>Registration closes by <strong>12 PM</strong></span>
              </div>
            )}

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
              {/* Catchy Quiz Preliminary Result Button */}
              <a 
                href="/quiz-preliminary-result.pdf" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-catchy-quiz"
                aria-label="View Udhbhavana 2026 Quiz Preliminary Examination Result (PDF)"
                title="View Quiz Preliminary Examination Results (Scorecard PDF)"
              >
                <span className="quiz-btn-shimmer" aria-hidden="true" />
                <span className="quiz-btn-pulse-tag">
                  <span className="quiz-btn-pulse-dot" />
                  <span>OUT NOW</span>
                </span>
                <Trophy size={19} className="quiz-btn-trophy" aria-hidden="true" />
                <span className="quiz-btn-title">Quiz Preliminary Result</span>
                <span className="quiz-btn-pdf-chip">
                  <FileText size={13} />
                  <span>PDF</span>
                </span>
                <ArrowUpRight size={17} className="quiz-btn-arrow" aria-hidden="true" />
              </a>

              <button 
                type="button" 
                className="btn btn-primary btn-lg"
                onClick={scrollToCompetitions}
              >
                {siteConfig?.heroExploreBtnText || 'Explore Competitions'}
                <ArrowRight size={18} />
              </button>
              {canShowRegister && (
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
        title={`${siteConfig?.eventName || 'Udhbhavana 2026'} Official Poster`}
      />
    </section>
  );
}
