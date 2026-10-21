import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Globe, Users, MessageCircle } from 'lucide-react';

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

// Format coordinator names with proper title casing & clear designations
function formatCoordinatorName(rawName = '') {
  let name = rawName.trim();
  name = name.replace(/^(DR|MR|MS|MRS|PROF)\.([A-Za-z])/i, '$1. $2');
  
  if (name === name.toUpperCase()) {
    name = name
      .toLowerCase()
      .split(/\s+/)
      .map(part => {
        if (/^(dr|mr|ms|mrs|prof)\.?$/i.test(part)) {
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        }
        if (part.length <= 2) return part.toUpperCase();
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join(' ');
  }
  return name;
}

// Generate stylish 2-letter monogram for avatar
function getCoordinatorInitials(name = '') {
  const withoutSalutation = name.replace(/^(dr|mr|ms|mrs|prof)\.?\s+/i, '').trim();
  const parts = withoutSalutation.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    const secondLast = parts[parts.length - 2];
    
    // e.g. "Pavitha P P" -> "PP"
    if (parts.length >= 3 && secondLast.length === 1 && lastPart.length === 1) {
      return (secondLast + lastPart).toUpperCase();
    }
    // e.g. "Vinod VP" -> "VP"
    if (lastPart.length === 2 && lastPart === lastPart.toUpperCase()) {
      return lastPart;
    }
    // e.g. "R Pradeep Kumar" -> "PK"
    const significantParts = parts.filter(p => p.length > 1);
    if (significantParts.length >= 2) {
      return (significantParts[0][0] + significantParts[significantParts.length - 1][0]).toUpperCase();
    }
    return (parts[0][0] + lastPart[0]).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return 'CO';
}

// Phone display helper (+91 XXXXX XXXXX)
function formatDisplayPhone(phone = '') {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return phone.trim();
}

// Extract and normalize coordinators from siteConfig
function parseCoordinators(data) {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data
      .map(item => {
        if (typeof item === 'string') {
          return { name: item, phone: '', cleanPhone: '', formattedPhone: '', initials: 'CO' };
        }
        const phone = String(item.phone || '').trim();
        const clean = phone.replace(/\D/g, '');
        const name = formatCoordinatorName(String(item.name || ''));
        return {
          name,
          phone,
          cleanPhone: clean.length === 10 ? `91${clean}` : clean,
          formattedPhone: formatDisplayPhone(phone),
          initials: getCoordinatorInitials(name)
        };
      })
      .filter(c => c.name && c.phone);
  }

  if (typeof data !== 'string') return [];

  let text = data.replace(/^(?:EVENT\s+)?COORDINATORS?[\s\-–—:]*/i, '').trim();
  const coordinators = [];

  // Match "Name # Phone" pattern
  const hashRegex = /([^#,;\n]+?)\s*#\s*([\d\s\-+()]{8,15})/g;
  let match;
  while ((match = hashRegex.exec(text)) !== null) {
    let rawName = match[1].replace(/^[,\s\-–—•*]+/, '').replace(/[,\s\-–—•*]+$/, '').trim();
    rawName = rawName.replace(/^(?:EVENT\s+)?COORDINATORS?[\s\-–—:]*/i, '').trim();
    const phone = match[2].trim();
    const clean = phone.replace(/\D/g, '');
    if (rawName && clean.length >= 8) {
      const name = formatCoordinatorName(rawName);
      coordinators.push({
        name,
        phone,
        cleanPhone: clean.length === 10 ? `91${clean}` : clean,
        formattedPhone: formatDisplayPhone(phone),
        initials: getCoordinatorInitials(name)
      });
    }
  }

  if (coordinators.length > 0) return coordinators;

  // Fallback: line/comma-based parsing
  const items = text.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
  for (const item of items) {
    const phoneMatch = item.match(/([\d\s\-+()]{8,15})/);
    if (phoneMatch) {
      const phone = phoneMatch[1].trim();
      const clean = phone.replace(/\D/g, '');
      if (clean.length >= 8) {
        let rawName = item
          .replace(phoneMatch[0], '')
          .replace(/[()\-–—:#]/g, '')
          .replace(/^(?:EVENT\s+)?COORDINATORS?[\s\-–—:]*/i, '')
          .trim();
        if (rawName) {
          const name = formatCoordinatorName(rawName);
          coordinators.push({
            name,
            phone,
            cleanPhone: clean.length === 10 ? `91${clean}` : clean,
            formattedPhone: formatDisplayPhone(phone),
            initials: getCoordinatorInitials(name)
          });
        }
      }
    }
  }

  return coordinators;
}

export function ContactSection({ siteConfig }) {
  if (siteConfig?.sectionVisibility?.contact === false) return null;

  const email = siteConfig?.contactEmail;
  const phone = siteConfig?.contactPhone;
  const social = siteConfig?.socialLinks || {};

  // Check where coordinators data is coming from (eventCoordinators or legacy contactTag)
  const isTagHoldingCoordinators = /#\s*\d{8,}|EVENT\s+COORDINATORS/i.test(siteConfig?.contactTag || '');
  const coordinatorRawSource = siteConfig?.eventCoordinators || (isTagHoldingCoordinators ? siteConfig.contactTag : '');
  const coordinators = parseCoordinators(coordinatorRawSource);

  // If contactTag held coordinators, display a clean, elegant tag instead
  const displayTag = (siteConfig?.contactTag && !isTagHoldingCoordinators) 
    ? siteConfig.contactTag 
    : 'Get in Touch';

  const hasSocials = Boolean(social.instagram || social.linkedin || social.youtube || social.facebook);

  return (
    <section id="contact" className="section section-alt">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <MessageSquare size={14} />
            {displayTag}
          </span>
          <h2 className="section-title">
            {siteConfig?.contactHeading || 'Contact & Inquiries'}
          </h2>
          <p className="section-subtitle">
            {siteConfig?.contactSubtitle || 'Have questions regarding competition guidelines, registration, or travel accommodation?'}
          </p>
        </div>

        {/* ELEGANT & MINIMAL EVENT COORDINATORS SHOWCASE (LAPTOP & MOBILE) */}
        {coordinators.length > 0 && (
          <div className="coordinators-showcase">
            <div className="coordinators-showcase-header">
              <div className="coordinators-header-left">
                <div className="coordinators-header-icon" aria-hidden="true">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="coordinators-header-title">
                    {siteConfig?.eventCoordinatorsTitle || 'Event Coordinators'}
                  </h3>
                  <p className="coordinators-header-subtitle">
                    {siteConfig?.eventCoordinatorsSubtitle || 'Direct contacts for event guidelines, inquiries & registration support'}
                  </p>
                </div>
              </div>
              <div className="coordinators-header-badge">
                <span className="coord-badge-dot"></span>
                <span>{coordinators.length} Faculty & Event Leads</span>
              </div>
            </div>

            <div className="coordinators-grid">
              {coordinators.map((coord, idx) => (
                <div key={idx} className="coordinator-card">
                  <div className="coordinator-card-top">
                    <div className="coordinator-avatar" aria-hidden="true">
                      {coord.initials}
                    </div>
                    <div className="coordinator-meta">
                      <h4 className="coordinator-name" title={coord.name}>
                        {coord.name}
                      </h4>
                      <a 
                        href={`tel:${coord.phone}`} 
                        className="coordinator-phone-link"
                        title={`Call ${coord.name}`}
                      >
                        <Phone size={12} className="coordinator-phone-icon" />
                        <span>{coord.formattedPhone}</span>
                      </a>
                    </div>
                  </div>
                  <div className="coordinator-actions">
                    <a 
                      href={`tel:${coord.phone}`} 
                      className="coord-btn coord-btn-call" 
                      title={`Call ${coord.name}`}
                      aria-label={`Call ${coord.name} at ${coord.formattedPhone}`}
                    >
                      <Phone size={13} />
                      <span>Call</span>
                    </a>
                    <a 
                      href={`https://wa.me/${coord.cleanPhone}?text=${encodeURIComponent(`Hello ${coord.name}, I am reaching out regarding Udhbhavana 2026.`)}`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="coord-btn coord-btn-wa" 
                      title={`WhatsApp ${coord.name}`}
                      aria-label={`Chat with ${coord.name} on WhatsApp`}
                    >
                      <MessageCircle size={13} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
