import React, { useState } from 'react';
import { 
  Palette, 
  Cpu, 
  Video, 
  Lightbulb, 
  HelpCircle, 
  Trophy, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowUpRight, 
  Info,
  X 
} from 'lucide-react';

function getCompetitionIcon(title = '') {
  const lower = title.toLowerCase();
  if (lower.includes('paint') || lower.includes('art')) return <Palette size={22} />;
  if (lower.includes('model') || lower.includes('working') || lower.includes('robot')) return <Cpu size={22} />;
  if (lower.includes('reel') || lower.includes('video') || lower.includes('film')) return <Video size={22} />;
  if (lower.includes('idea') || lower.includes('pitch')) return <Lightbulb size={22} />;
  if (lower.includes('quiz')) return <HelpCircle size={22} />;
  return <Trophy size={22} />;
}

export function CompetitionCard({ competition, siteConfig }) {
  const [showModal, setShowModal] = useState(false);

  const targetRegUrl = (competition.registrationUrl && competition.registrationUrl.trim() !== '')
    ? competition.registrationUrl.trim()
    : (siteConfig?.registrationUrl && siteConfig.registrationUrl.trim() !== '')
      ? siteConfig.registrationUrl.trim()
      : 'https://forms.google.com';

  return (
    <>
      <article className="competition-card">
        <div className="competition-card-header">
          <div className="competition-icon-circle">
            {getCompetitionIcon(competition.title)}
          </div>
          {competition.registrationStatus && (
            <span className={`badge ${competition.registrationStatus.toLowerCase().includes('open') ? 'badge-green' : 'badge-navy'}`}>
              {competition.registrationStatus}
            </span>
          )}
        </div>

        <div className="competition-card-body">
          <h3 className="competition-title">{competition.title}</h3>
          <p className="competition-desc">
            {competition.description || 'Details will be updated shortly.'}
          </p>

          <div className="competition-meta-list">
            {(competition.eventDate || competition.eventTime) && (
              <div className="competition-meta-row">
                <Calendar size={15} color="#2878D0" />
                <span>
                  <strong>Schedule:</strong> {competition.eventDate} {competition.eventTime ? `• ${competition.eventTime}` : ''}
                </span>
              </div>
            )}
            {competition.venue && (
              <div className="competition-meta-row">
                <MapPin size={15} color="#2878D0" />
                <span><strong>Venue:</strong> {competition.venue}</span>
              </div>
            )}
            {competition.prizeDetails && (
              <div className="competition-meta-row">
                <Trophy size={15} color="#F4B928" />
                <span><strong>Prizes:</strong> {competition.prizeDetails}</span>
              </div>
            )}
          </div>

          <div className="competition-card-footer">
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => setShowModal(true)}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Info size={14} />
              View Details
            </button>
            <a 
              href={targetRegUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary btn-sm"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Register
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </article>

      {/* Details Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)} role="dialog" aria-modal="true">
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="competition-icon-circle" style={{ width: 36, height: 36 }}>
                  {getCompetitionIcon(competition.title)}
                </div>
                <h3>{competition.title}</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {competition.imageUrl && (
                <div style={{ marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                  <img 
                    src={competition.imageUrl} 
                    alt={competition.title} 
                    style={{ width: '100%', maxHeight: '240px', objectFit: 'cover' }} 
                  />
                </div>
              )}

              <p style={{ fontSize: '1rem', color: '#1F2937', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                {competition.description}
              </p>

              {/* Meta details list */}
              <div style={{ 
                backgroundColor: '#F8FAFC', 
                padding: '1rem', 
                borderRadius: '8px', 
                border: '1px solid #E5EAF2',
                marginBottom: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}>
                {competition.eventDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <Calendar size={16} color="#2878D0" />
                    <span><strong>Date:</strong> {competition.eventDate}</span>
                  </div>
                )}
                {competition.eventTime && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <Clock size={16} color="#2878D0" />
                    <span><strong>Time:</strong> {competition.eventTime}</span>
                  </div>
                )}
                {competition.venue && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <MapPin size={16} color="#2878D0" />
                    <span><strong>Venue:</strong> {competition.venue}</span>
                  </div>
                )}
                {competition.prizeDetails && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <Trophy size={16} color="#B47805" />
                    <span><strong>Prize Details:</strong> {competition.prizeDetails}</span>
                  </div>
                )}
              </div>

              {/* Rules and Guidelines */}
              {competition.rules && (
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: '#142A55', marginBottom: '0.5rem' }}>
                    Rules & Guidelines
                  </h4>
                  <div style={{ 
                    whiteSpace: 'pre-line', 
                    fontSize: '0.875rem', 
                    color: '#4B5563', 
                    lineHeight: 1.6,
                    backgroundColor: '#FFFDF5',
                    padding: '0.85rem',
                    borderRadius: '6px',
                    borderLeft: '3px solid #F4B928'
                  }}>
                    {competition.rules}
                  </div>
                </div>
              )}

              {/* Direct Registration Form Callout */}
              <div style={{
                marginTop: '1.25rem',
                padding: '1rem',
                backgroundColor: '#EFF6FF',
                borderRadius: '8px',
                border: '1px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E40AF' }}>
                    Registration Link
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#3B82F6' }}>
                    Click to open official registration form for {competition.title}
                  </div>
                </div>
                <a 
                  href={targetRegUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary btn-sm"
                  style={{ textDecoration: 'none' }}
                >
                  Open Registration Form
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <a 
                href={targetRegUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary btn-sm"
              >
                Register for this Event
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
