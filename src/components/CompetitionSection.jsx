import React from 'react';
import { Trophy, ArrowUpRight, ClipboardCheck, Lock, Clock } from 'lucide-react';
import { CompetitionCard } from './CompetitionCard';
import { CompetitionRules } from './CompetitionRules';

export function CompetitionSection({ competitions = [], siteConfig }) {
  if (siteConfig?.sectionVisibility?.competitions === false) return null;

  const publishedCompetitions = competitions.filter((c) => c.published !== false);

  if (publishedCompetitions.length === 0) return null;

  const isRegistrationOpen = siteConfig?.registrationOpen !== false;
  const showRegisterBtn = siteConfig?.showRegisterButton !== false;

  const registrationUrl = (siteConfig?.registrationUrl && siteConfig.registrationUrl.trim() !== '')
    ? siteConfig.registrationUrl.trim()
    : 'https://forms.google.com';

  return (
    <section id="competitions" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag tag-yellow">
            <Trophy size={14} />
            {siteConfig?.competitionsTag || 'Events & Contests'}
          </span>
          <h2 className="section-title">
            {siteConfig?.competitionsHeading || 'Explore Competitions'}
          </h2>
          <p className="section-subtitle">
            {siteConfig?.competitionsSubtitle || 'Compete across five signature tracks designed to test your technical ingenuity, artistic expression, and leadership.'}
          </p>
        </div>

        {/* Competition Rules & Instructions */}
        <CompetitionRules siteConfig={siteConfig} />

        <div className="competitions-grid">
          {publishedCompetitions.map((comp, idx) => (
            <CompetitionCard 
              key={comp.id} 
              competition={comp} 
              index={idx}
              siteConfig={siteConfig} 
            />
          ))}
        </div>

        {/* Unified / Single Registration Callout below the cards */}
        <div className={`competitions-register-banner ${!isRegistrationOpen ? 'banner-closed' : ''}`}>
          <div className="competitions-register-content">
            <div className="competitions-register-icon">
              {!isRegistrationOpen ? <Lock size={28} /> : <ClipboardCheck size={28} />}
            </div>
            <div className="competitions-register-text">
              <div className="competitions-register-title-row">
                <h3 className="competitions-register-title">
                  {!isRegistrationOpen ? 'Registrations Closed' : 'Single Registration for All Competitions'}
                </h3>
                {isRegistrationOpen && showRegisterBtn && (
                  <span className="competitions-deadline-pill">
                    <Clock size={13} />
                    <span>Registration closes by <strong>12 PM</strong></span>
                  </span>
                )}
              </div>
              <p className="competitions-register-desc">
                {!isRegistrationOpen
                  ? (siteConfig?.registrationClosedMessage || 'Registrations for Udhbhavana 2026 are now closed. Thank you for the overwhelming response!')
                  : 'We use a single common registration form for all events. Choose your desired competitions and complete your registration easily in one place.'}
              </p>
            </div>
          </div>
          {showRegisterBtn && (
            <div className="competitions-register-action">
              {!isRegistrationOpen ? (
                <span className="btn btn-secondary btn-lg" style={{ opacity: 0.8, cursor: 'not-allowed', backgroundColor: '#E2E8F0', borderColor: '#CBD5E1', color: '#64748B' }}>
                  Registrations Closed
                </span>
              ) : (
                <a 
                  href={registrationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary btn-lg"
                  id="competition-section-register-btn"
                >
                  {siteConfig?.heroRegisterBtnText || 'Register for Competitions'}
                  <ArrowUpRight size={18} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
