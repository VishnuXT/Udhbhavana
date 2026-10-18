import React from 'react';
import { Trophy } from 'lucide-react';
import { CompetitionCard } from './CompetitionCard';

export function CompetitionSection({ competitions = [], siteConfig }) {
  if (siteConfig?.sectionVisibility?.competitions === false) return null;

  const publishedCompetitions = competitions.filter((c) => c.published !== false);

  if (publishedCompetitions.length === 0) return null;

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

        <div className="competitions-grid">
          {publishedCompetitions.map((comp) => (
            <CompetitionCard 
              key={comp.id} 
              competition={comp} 
              siteConfig={siteConfig} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
