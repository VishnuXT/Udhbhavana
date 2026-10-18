import React from 'react';
import { UserCheck, Star } from 'lucide-react';

export function InaugurationSection({ siteConfig }) {
  if (siteConfig?.sectionVisibility?.inauguration === false) return null;
  if (!siteConfig?.guestName && !siteConfig?.guestDesignation) return null;

  return (
    <section id="inauguration" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <Star size={14} />
            {siteConfig?.inaugurationTag || 'Dignitary & Inaugural Address'}
          </span>
          <h2 className="section-title">
            {siteConfig?.inaugurationHeading || 'Inauguration'}
          </h2>
          <p className="section-subtitle">
            {siteConfig?.inaugurationSubtitle || 'Honoring our esteemed chief guest for the official opening ceremony'}
          </p>
        </div>

        <div className="inauguration-card">
          <div className="guest-avatar">
            {siteConfig?.guestImage ? (
              <img src={siteConfig.guestImage} alt={siteConfig.guestName} />
            ) : (
              <UserCheck size={54} />
            )}
          </div>

          <div className="guest-info">
            <span className="guest-label">{siteConfig?.guestLabel || 'Inauguration by'}</span>
            <h3 className="guest-name">{siteConfig?.guestName || 'Sri. Ramesh Chennithala'}</h3>
            <p className="guest-designation">
              {siteConfig?.guestDesignation || "Hon'ble Home Minister of Kerala"}
            </p>
            {siteConfig?.guestConfirmed === false && (
              <span className="guest-status-note">
                {siteConfig?.guestUnconfirmedNote || '(Designation as printed on official event poster; itinerary subject to official confirmation)'}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
