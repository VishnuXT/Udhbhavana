import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Globe } from 'lucide-react';

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function LinkedinIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function YoutubeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
      <polygon points="10 15 15 12 10 9 10 15"/>
    </svg>
  );
}

export function ContactSection({ siteConfig }) {
  if (siteConfig?.sectionVisibility?.contact === false) return null;

  const email = siteConfig?.contactEmail;
  const phone = siteConfig?.contactPhone;
  const social = siteConfig?.socialLinks || {};

  const hasSocials = Boolean(social.instagram || social.linkedin || social.youtube || social.facebook);

  return (
    <section id="contact" className="section section-alt">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <MessageSquare size={14} />
            {siteConfig?.contactTag || 'Get in Touch'}
          </span>
          <h2 className="section-title">
            {siteConfig?.contactHeading || 'Contact & Inquiries'}
          </h2>
          <p className="section-subtitle">
            {siteConfig?.contactSubtitle || 'Have questions regarding competition guidelines, registration, or travel accommodation?'}
          </p>
        </div>

        <div className="contact-grid">
          {/* Direct channels */}
          <div className="contact-info-col">
            <h3 style={{ fontSize: '1.25rem', color: '#142A55', marginBottom: '0.5rem' }}>
              {siteConfig?.contactDeskTitle || 'Official Event Desk'}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              {siteConfig?.contactDeskDesc || 'Reach out to the organizing student coordinators and faculty convener committee.'}
            </p>

            {email && (
              <div className="contact-item">
                <div className="contact-icon">
                  <Mail size={20} />
                </div>
                <div className="contact-details">
                  <h4>Email Address</h4>
                  <p>
                    <a href={`mailto:${email}`} style={{ color: '#2878D0', fontWeight: 500 }}>
                      {email}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {phone && (
              <div className="contact-item">
                <div className="contact-icon">
                  <Phone size={20} />
                </div>
                <div className="contact-details">
                  <h4>Phone / Helpdesk</h4>
                  <p>
                    <a href={`tel:${phone}`} style={{ color: '#2878D0', fontWeight: 500 }}>
                      {phone}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {hasSocials && (
              <div className="contact-item">
                <div className="contact-icon">
                  <Globe size={20} />
                </div>
                <div className="contact-details">
                  <h4>Follow Our Updates</h4>
                  <div className="contact-social-links">
                    {social.instagram && (
                      <a 
                        href={social.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="social-icon-btn" 
                        aria-label="Instagram"
                      >
                        <InstagramIcon size={18} />
                      </a>
                    )}
                    {social.linkedin && (
                      <a 
                        href={social.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="social-icon-btn" 
                        aria-label="LinkedIn"
                      >
                        <LinkedinIcon size={18} />
                      </a>
                    )}
                    {social.youtube && (
                      <a 
                        href={social.youtube} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="social-icon-btn" 
                        aria-label="YouTube"
                      >
                        <YoutubeIcon size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* College Address card */}
          <div className="contact-info-col">
            <h3 style={{ fontSize: '1.25rem', color: '#142A55', marginBottom: '0.5rem' }}>
              {siteConfig?.contactCampusTitle || 'Institution Campus'}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              {siteConfig?.institutionName || 'Sree Buddha College of Engineering (Autonomous)'}
            </p>

            <div className="contact-item">
              <div className="contact-icon">
                <MapPin size={20} />
              </div>
              <div className="contact-details">
                <h4>Postal Address</h4>
                <p style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                  {siteConfig?.address || 'Pattoor P.O., Nooranad\nAlappuzha District, Kerala – 690507'}
                </p>
              </div>
            </div>

            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              padding: '1rem',
              border: '1px solid #E5EAF2',
              marginTop: 'auto'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#142A55', display: 'block', marginBottom: '4px' }}>
                Accreditations & Honors:
              </span>
              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                {siteConfig?.contactAccreditations || "NAAC 'A' Grade Accredited • NBA Accredited Programmes • Autonomous Institution"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
