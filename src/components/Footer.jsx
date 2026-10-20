import React from 'react';

export function Footer({ siteConfig }) {
  const currentYear = new Date().getFullYear();

  return (
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
  );
}
