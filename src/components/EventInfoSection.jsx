import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Building2, ExternalLink, Bus, ArrowRight } from 'lucide-react';

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

        {/* College Bus Transit Banner */}
        <div style={{
          marginTop: '2.5rem',
          background: 'linear-gradient(135deg, #142A55 0%, #1F3B73 100%)',
          borderRadius: '16px',
          padding: '1.75rem 2rem',
          color: '#FFFFFF',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          boxShadow: '0 4px 14px rgba(20, 42, 85, 0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '680px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F4B928',
              flexShrink: 0
            }}>
              <Bus size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                Official College Bus Transport (23 Active Routes)
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#CBD5E1', margin: 0, lineHeight: 1.5 }}>
                Direct morning pick-up across Alappuzha, Kollam, and Pathanamthitta districts arriving at Pattoor campus by 8:25 AM. Check boarding points and pickup timings.
              </p>
            </div>
          </div>

          <Link 
            to="/bus-routes" 
            className="btn btn-primary"
            style={{
              backgroundColor: '#F4B928',
              color: '#0D1C3A',
              fontWeight: 700,
              border: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <span>Explore Bus Routes & Timings</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
