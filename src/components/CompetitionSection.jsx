import React from 'react';
import { Trophy, ArrowUpRight, ClipboardCheck } from 'lucide-react';
import { CompetitionCard } from './CompetitionCard';
import { CompetitionRules } from './CompetitionRules';

export function CompetitionSection({ competitions = [], siteConfig }) {
  if (siteConfig?.sectionVisibility?.competitions === false) return null;

  const publishedCompetitions = competitions.filter((c) => c.published !== false);

  if (publishedCompetitions.length === 0) return null;

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
        <div className="competitions-register-banner">
          <div className="competitions-register-content">
            <div className="competitions-register-icon">
              <ClipboardCheck size={28} />
            </div>
            <div className="competitions-register-text">
              <h3 className="competitions-register-title">
                Single Registration for All Competitions
              </h3>
              <p className="competitions-register-desc">
                We use a single common registration form for all events. Choose your desired competitions and complete your registration easily in one place.
              </p>
            </div>
          </div>
          <div className="competitions-register-action">
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
          </div>
        </div>
      </div>
    </section>
  );
}
