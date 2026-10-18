import React from 'react';
import { HeartHandshake } from 'lucide-react';

export function AboutSection({ siteConfig }) {
  if (siteConfig?.sectionVisibility?.about === false) return null;

  return (
    <section id="about" className="section section-alt">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <HeartHandshake size={14} />
            {siteConfig?.aboutTag || 'Background & Purpose'}
          </span>
          <h2 className="section-title">
            {siteConfig?.aboutHeading || 'About Udhbhavana'}
          </h2>
          <p className="section-subtitle">
            {siteConfig?.aboutSubtitle || 'Uniting technical excellence with social empowerment'}
          </p>
        </div>

        <div className="about-card">
          <div className="about-text">
            <p>
              {siteConfig?.aboutDescription || 
                `${siteConfig?.eventName || 'Udhbhavana'} is the flagship annual technical and innovation symposium presented by Sree Buddha College of Engineering (Autonomous), Pattoor, in association with Operation Toofan. Blending technological brilliance, artistic creativity, and competitive innovation with a strong social awareness message — 'No to drugs, Yes to life' — the event inspires students to aim high and innovate for a safer, brighter tomorrow.`
              }
            </p>
            <p>
              {siteConfig?.aboutSubDescription || 
                "Organized with precision and passion, this symposium offers young minds an open platform to present working prototypes, pitch breakthrough startup ideas, demonstrate creative visual storytelling, and engage in high-octane academic quizzing."
              }
            </p>
          </div>

          <div className="about-highlights">
            <div className="about-highlight-box">
              <div className="about-highlight-title">
                {siteConfig?.aboutHighlight1Title || 'Autonomous Excellence'}
              </div>
              <div className="about-highlight-desc">
                {siteConfig?.aboutHighlight1Desc || `Organized under the academic rigor of ${siteConfig?.institutionName || 'Sree Buddha College of Engineering (Autonomous)'}.`}
              </div>
            </div>

            <div className="about-highlight-box highlight-yellow">
              <div className="about-highlight-title">
                {siteConfig?.aboutHighlight2Title || 'Operation Toofan Alliance'}
              </div>
              <div className="about-highlight-desc">
                {siteConfig?.aboutHighlight2Desc || `In partnership with ${siteConfig?.associationName || 'Operation Toofan'}, driving meaningful youth engagement.`}
              </div>
            </div>

            <div className="about-highlight-box highlight-green">
              <div className="about-highlight-title">
                {siteConfig?.aboutHighlight3Title || 'Social Commitment'}
              </div>
              <div className="about-highlight-desc">
                {siteConfig?.aboutHighlight3Desc || 'Promoting clean living, mental well-being, and active youth leadership across campus communities.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
