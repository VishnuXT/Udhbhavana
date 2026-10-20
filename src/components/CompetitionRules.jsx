import React from 'react';

const ACCENTS = ['rule-cyan', 'rule-yellow', 'rule-green', 'rule-pink', 'rule-orange', 'rule-purple'];

export function CompetitionRules({ siteConfig }) {
  if (siteConfig?.competitionRulesVisible === false || siteConfig?.sectionVisibility?.competitionRules === false) {
    return null;
  }

  const labelText = siteConfig?.competitionRulesTag || 'COMPETITION RULES & INSTRUCTIONS';
  const headingText = siteConfig?.competitionRulesHeading || 'Read Before You Participate';

  // Load dynamic rules array or fall back to legacy fields or defaults
  let rawRules = siteConfig?.competitionRulesList;
  if (!Array.isArray(rawRules) || rawRules.length === 0) {
    rawRules = [
      {
        id: 'rule-1',
        title: siteConfig?.competitionRule1Title || 'Register Properly',
        description: siteConfig?.competitionRule1Desc || 'Complete registration before participating.',
      },
      {
        id: 'rule-2',
        title: siteConfig?.competitionRule2Title || 'Follow Guidelines',
        description: siteConfig?.competitionRule2Desc || 'Read the rules for your chosen competition.',
      },
      {
        id: 'rule-3',
        title: siteConfig?.competitionRule3Title || 'Maintain Fairness',
        description: siteConfig?.competitionRule3Desc || 'Submit original work and follow ethical practices.',
      },
      {
        id: 'rule-4',
        title: siteConfig?.competitionRule4Title || 'Be Respectful',
        description: siteConfig?.competitionRule4Desc || 'Respect participants, coordinators, and judges.',
      },
    ];
  }

  const rules = rawRules.map((rule, index) => ({
    step: `Rule ${String(index + 1).padStart(2, '0')}`,
    id: rule.id || `rule-${index}`,
    title: rule.title || `Rule ${index + 1}`,
    description: rule.description || '',
    accent: ACCENTS[index % ACCENTS.length],
  }));

  return (
    <div className="chalkboard-section" aria-label="Competition Rules & Instructions">
      {/* Outer Wooden Frame */}
      <div className="chalkboard-frame">
        {/* Chalkboard Slate Surface */}
        <div className="chalkboard-slate">
          {/* Corner Brass Screws */}
          <div className="chalkboard-screw screw-tl" aria-hidden="true"></div>
          <div className="chalkboard-screw screw-tr" aria-hidden="true"></div>

          {/* Blackboard Header */}
          <div className="chalkboard-header">
            <div className="chalkboard-label">
              <span className="chalk-star">✦</span>
              <span>{labelText}</span>
              <span className="chalk-star">✦</span>
            </div>
            <h3 className="chalkboard-heading">{headingText}</h3>
            <div className="chalkboard-doodle-line" aria-hidden="true">
              <svg viewBox="0 0 260 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 8C55 3 140 4 256 7M18 11C80 9 175 10 238 12" stroke="rgba(254, 240, 138, 0.75)" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Blackboard Rules Grid (Logo-free, flexible for multiple rules) */}
          <div 
            className="chalkboard-grid"
            style={{ '--rules-count': rules.length }}
          >
            {rules.map(({ step, id, title, description, accent }) => (
              <div key={id} className={`chalkboard-item ${accent}`}>
                <div className="chalkboard-item-body">
                  <div className="chalkboard-title-row">
                    <span className="chalkboard-rule-tag">{step}</span>
                    <h4 className="chalkboard-rule-title">{title}</h4>
                  </div>
                  {description && (
                    <p className="chalkboard-rule-desc">{description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Realistic Wooden Chalk Ledge / Tray with Chalk & Duster */}
        <div className="chalkboard-tray" aria-hidden="true">
          <div className="chalkboard-tray-items">
            <span className="chalk-piece chalk-piece-white" title="White chalk"></span>
            <span className="chalk-piece chalk-piece-yellow" title="Yellow chalk"></span>
            <span className="chalk-piece chalk-piece-cyan" title="Blue chalk"></span>
            <div className="chalk-eraser" title="Felt chalk duster">
              <div className="eraser-wood"></div>
              <div className="eraser-felt"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
