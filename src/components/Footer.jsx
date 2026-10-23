import React from 'react';

const DEFAULT_COORDINATORS = [
  { name: 'Dr. Vinod V P', phone: '88481 18152', cleanPhone: '918848118152' },
  { name: 'Mr. R Pradeep Kumar', phone: '94464 72562', cleanPhone: '919446472562' },
  { name: 'Ms. Pavitha P P', phone: '80753 76012', cleanPhone: '918075376012' },
  { name: 'Dr. Unnikrishnan S', phone: '99476 00545', cleanPhone: '919947600545' },
  { name: 'Ms. Cinaya Tony', phone: '98468 36065', cleanPhone: '919846836065' },
];

function getCoordinators(siteConfig) {
  const raw = siteConfig?.eventCoordinators;
  if (!raw) return DEFAULT_COORDINATORS;

  if (Array.isArray(raw) && raw.length > 0) {
    return raw
      .map(c => {
        const name = typeof c === 'string' ? c : (c.name || '');
        const phone = typeof c === 'object' ? (c.phone || '') : '';
        const clean = phone.replace(/\D/g, '');
        return {
          name,
          phone,
          cleanPhone: clean.length === 10 ? `91${clean}` : clean
        };
      })
      .filter(c => c.name);
  }

  if (typeof raw === 'string' && raw.trim()) {
    const items = raw.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
    const parsed = [];
    for (const item of items) {
      if (item.includes('#')) {
        const [n, p] = item.split('#').map(s => s.trim());
        if (n && p) {
          const clean = p.replace(/\D/g, '');
          parsed.push({
            name: n,
            phone: p,
            cleanPhone: clean.length === 10 ? `91${clean}` : clean
          });
        }
      } else {
        const match = item.match(/([\d\s\-+]{8,15})/);
        if (match) {
          const p = match[1].trim();
          const n = item.replace(p, '').replace(/[()\-–—:#]/g, '').trim();
          if (n && p) {
            const clean = p.replace(/\D/g, '');
            parsed.push({
              name: n,
              phone: p,
              cleanPhone: clean.length === 10 ? `91${clean}` : clean
            });
          }
        }
      }
    }
    if (parsed.length > 0) return parsed;
  }

  return DEFAULT_COORDINATORS;
}

function MarqueeItemsGroup({ coordinators, ariaHidden = false }) {
  return (
    <div className="marquee-group" aria-hidden={ariaHidden ? "true" : undefined}>
      <span className="marquee-label">Event Coordinators:</span>

      {coordinators.map((c, idx) => (
        <span key={idx} className="marquee-entry">
          <span className="marquee-name">{c.name}</span>
          <span className="marquee-dot">•</span>
        </span>
      ))}

      <span className="marquee-dev">
        Developed by <span className="marquee-dev-name">Vishnu V</span> (S7 Computer Science)
      </span>

      <span className="marquee-dot">•</span>
    </div>
  );
}

export function Footer({ siteConfig }) {
  const currentYear = new Date().getFullYear();
  const coordinators = getCoordinators(siteConfig);

  return (
    <>
      {/* Minimal Marquee Section directly Above the Footer */}
      <div className="marquee-minimal-bar" title="Event Coordinators & Developer Credits (Hover to pause)">
        <div className="marquee-minimal-track">
          <MarqueeItemsGroup coordinators={coordinators} />
          <MarqueeItemsGroup coordinators={coordinators} ariaHidden={true} />
        </div>
      </div>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <h3>{siteConfig?.eventName || 'Udhbhavana 2026'}</h3>
              <p>
                Presented by {siteConfig?.institutionName || 'Sree Buddha College of Engineering (Autonomous)'}, in association with {siteConfig?.associationName || 'Operation Toofan'}.
              </p>
              <p style={{ marginTop: '0.75rem', color: '#38BDF8', fontWeight: 600 }}>
                {siteConfig?.tagline || 'Aim IT.. Win IT'} • {siteConfig?.awarenessMessage || 'No to drugs, Yes to life'}
              </p>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#hero">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#competitions">Competitions</a></li>
                <li><a href="#prizes">Prize Pool</a></li>
                <li><a href="#venue">Venue & Map</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Institution Campus</h4>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#94A3B8' }}>
                {siteConfig?.address || 'Pattoor P.O., Nooranad, Alappuzha (Dist.), Kerala – 690507'}
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              {siteConfig?.footerText || `© ${currentYear} Udhbhavana. Sree Buddha College of Engineering. All rights reserved.`}
            </p>
            <div className="footer-admin-link">
              <span>Powered by React + Firebase CMS</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
