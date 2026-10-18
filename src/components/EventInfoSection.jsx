import React from 'react';
import { Calendar, Clock, MapPin, Building2, ExternalLink } from 'lucide-react';

export function EventInfoSection({ siteConfig }) {
  if (siteConfig?.sectionVisibility?.eventInfo === false) return null;

  const hasMapUrl = Boolean(siteConfig?.mapsUrl && siteConfig.mapsUrl.trim() !== '');

  return (
    <section id="venue" className="section section-alt">
      <div className="container">
        <div className="section-header">
          <span className="section-tag tag-green">
            <Building2 size={14} />
            {siteConfig?.eventInfoTag || 'Location & Schedule'}
          </span>
          <h2 className="section-title">
            {siteConfig?.eventInfoHeading || 'Event Information & Venue'}
          </h2>
          <p className="section-subtitle">
            {siteConfig?.eventInfoSubtitle || 'Everything you need to know about reaching the venue and timing.'}
          </p>
        </div>

        <div className="event-info-grid">
          {/* Date */}
          <div className="info-card">
            <div className="info-card-icon">
              <Calendar size={20} />
            </div>
            <div className="info-card-label">Event Date</div>
            <div className="info-card-value">{siteConfig?.eventDate || '09 November 2026'}</div>
            <div className="info-card-sub">{siteConfig?.eventDateSub || 'Mark your calendar'}</div>
          </div>

          {/* Time */}
          <div className="info-card">
            <div className="info-card-icon">
              <Clock size={20} />
            </div>
            <div className="info-card-label">Reporting Time</div>
            <div className="info-card-value">{siteConfig?.eventTime || '09:30 AM IST'}</div>
            <div className="info-card-sub">{siteConfig?.eventTimeSub || 'Inauguration begins promptly'}</div>
          </div>

          {/* Venue */}
          <div className="info-card">
            <div className="info-card-icon">
              <Building2 size={20} />
            </div>
            <div className="info-card-label">Campus Venue</div>
            <div className="info-card-value">{siteConfig?.venue || 'College Auditorium'}</div>
            <div className="info-card-sub">{siteConfig?.eventVenueSub || siteConfig?.institutionName || 'Sree Buddha College of Engineering (Autonomous)'}</div>
          </div>

          {/* Location & Directions */}
          <div className="info-card">
            <div className="info-card-icon">
              <MapPin size={20} />
            </div>
            <div className="info-card-label">Full Address</div>
            <div className="info-card-value" style={{ fontSize: '0.95rem' }}>
              {siteConfig?.address || 'Pattoor P.O., Nooranad, Alappuzha (Dist.), Kerala – 690507'}
            </div>
            {hasMapUrl && (
              <a 
                href={siteConfig.mapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline btn-sm"
                style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
              >
                <span>{siteConfig?.mapsLinkText || 'Get Directions'}</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
