import React from 'react';
import { Award } from 'lucide-react';

export function PrizeSection({ siteConfig }) {
  if (siteConfig?.sectionVisibility?.prizes === false) return null;

  const prizeText = siteConfig?.prizePoolText || 'Prizes over ₹1 lakh';

  return (
    <section id="prizes" className="section section-alt" style={{ paddingTop: '2rem' }}>
      <div className="container">
        <div className="prize-banner">
          <div className="prize-trophy-icon">
            <Award size={48} />
          </div>
          <div className="prize-headline">
            {siteConfig?.prizeTag || 'Rewarding Innovation & Brilliance'}
          </div>
          <div className="prize-amount">
            {prizeText.toUpperCase()}
          </div>
          <p className="prize-desc">
            {siteConfig?.prizeDesc || 'Grand cash prizes, trophies of recognition, and merit certificates await top-performing innovators, artists, and problem solvers across all competitive categories.'}
          </p>
        </div>
      </div>
    </section>
  );
}
