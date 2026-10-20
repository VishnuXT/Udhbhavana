import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Cpu, 
  Video, 
  Lightbulb, 
  HelpCircle, 
  Trophy, 
  Calendar, 
  MapPin, 
  FileText,
  X,
  Phone,
  MessageCircle,
  Users,
  Sparkles,
  BookOpen
} from 'lucide-react';

function getCompetitionIcon(title = '') {
  const lower = title.toLowerCase();
  if (lower.includes('paint') || lower.includes('art') || lower.includes('poster') || lower.includes('draw')) return <Palette size={20} />;
  if (lower.includes('model') || lower.includes('working') || lower.includes('robot') || lower.includes('tech') || lower.includes('code')) return <Cpu size={20} />;
  if (lower.includes('reel') || lower.includes('video') || lower.includes('film') || lower.includes('short')) return <Video size={20} />;
  if (lower.includes('idea') || lower.includes('pitch') || lower.includes('innovat')) return <Lightbulb size={20} />;
  if (lower.includes('quiz') || lower.includes('trivia') || lower.includes('quest')) return <HelpCircle size={20} />;
  return <Trophy size={20} />;
}

// Extract phone numbers and coordinator contacts non-destructively for interactive call/WhatsApp buttons
function extractCoordinators(text = '') {
  const coordinators = [];
  const coordRegex = /(?:Coordinators?[\s\-:]*)?([A-Za-z\s.\-–—]+?)\s*#\s*([\d\s\-+]{8,15})/gi;
  let cm;
  while ((cm = coordRegex.exec(text)) !== null) {
    let name = cm[1].replace(/Coordinators?[\s\-:]*/gi, '').trim();
    if (name.includes('\n')) name = name.split('\n').pop().trim();
    const sentenceSplit = name.split(/(?<=[.?!])\s+(?=[A-Z])/);
    if (sentenceSplit.length > 1) name = sentenceSplit[sentenceSplit.length - 1].trim();
    name = name.replace(/^[-–—,•*]\s*/, '').replace(/[-–—,•*]\s*$/, '').trim();
    const phone = cm[2].trim();
    const cleanPhone = phone.replace(/\D/g, '');
    if (name && cleanPhone.length >= 8 && !name.toLowerCase().startsWith('prize')) {
      coordinators.push({
        name,
        phone,
        cleanPhone: cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone
      });
    }
  }
  return coordinators;
}

export function CompetitionCard({ competition, index = 0 }) {
  const [showModal, setShowModal] = useState(false);

  // Close modal when pressing ESC key
  useEffect(() => {
    if (!showModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  const rawDescription = (competition.description || '').trim();
  const rawRules = (competition.rules || '').trim();
  const coordinators = extractCoordinators(`${rawDescription}\n${rawRules}`);
  const isOpen = competition.registrationStatus?.toLowerCase().includes('open');

  return (
    <>
      <article className="competition-clipboard" aria-label={`Competition: ${competition.title}`}>
        {/* Wooden Board Top Hanging Hole */}
        <div className="clipboard-hang-hole" aria-hidden="true" />

        {/* Metallic Spring Clamp */}
        <div className="clipboard-clip" aria-hidden="true">
          <div className="clipboard-clip-handle" />
          <div className="clipboard-clip-bar">
            <span className="clipboard-clip-rivet" />
            <span className="clipboard-clip-grip" />
            <span className="clipboard-clip-rivet" />
          </div>
        </div>

        {/* Examination Paper Sheet */}
        <div className="clipboard-paper">
          <div className="clipboard-paper-header">
            <div className="clipboard-sheet-tag">
              <span className="sheet-num">EVENT #{String(index + 1).padStart(2, '0')}</span>
              <span className="sheet-sep">•</span>
              <span>ENTRY SHEET</span>
            </div>
            {competition.registrationStatus && (
              <span className={`clipboard-status-stamp ${isOpen ? 'stamp-open' : 'stamp-closed'}`}>
                {competition.registrationStatus}
              </span>
            )}
          </div>

          <div className="clipboard-title-row">
            <div className="clipboard-track-icon">
              {getCompetitionIcon(competition.title)}
            </div>
            <h3 className="clipboard-title">{competition.title}</h3>
          </div>

          <div className="clipboard-desc-wrapper">
            <p className="clipboard-desc">
              {competition.description || 'Event guidelines and instructions will be updated shortly.'}
            </p>
          </div>

          <div className="clipboard-specs-box">
            {(competition.eventDate || competition.eventTime) && (
              <div className="clipboard-spec-row">
                <span className="clipboard-spec-label">
                  <Calendar size={13} color="#2878D0" />
                  <span>Schedule</span>
                </span>
                <span className="clipboard-spec-val" title={`${competition.eventDate || ''} ${competition.eventTime || ''}`}>
                  {competition.eventDate} {competition.eventTime ? `• ${competition.eventTime}` : ''}
                </span>
              </div>
            )}
            {competition.venue && (
              <div className="clipboard-spec-row">
                <span className="clipboard-spec-label">
                  <MapPin size={13} color="#2878D0" />
                  <span>Venue</span>
                </span>
                <span className="clipboard-spec-val" title={competition.venue}>
                  {competition.venue}
                </span>
              </div>
            )}
            {competition.prizeDetails && (
              <div className="clipboard-spec-row prize-row">
                <span className="clipboard-spec-label">
                  <Trophy size={13} color="#B45309" />
                  <span>Prizes</span>
                </span>
                <span className="clipboard-spec-val" title={competition.prizeDetails}>
                  {competition.prizeDetails}
                </span>
              </div>
            )}
          </div>

          <div className="clipboard-footer">
            <button 
              type="button" 
              className="clipboard-btn"
              onClick={() => setShowModal(true)}
              aria-label={`View details for ${competition.title}`}
            >
              <FileText size={15} />
              <span>View Details & Guidelines</span>
            </button>
          </div>
        </div>
      </article>

      {/* MINIMAL & SIMPLE DETAILS MODAL WITH SECTION BACKGROUND CARDS */}
      {showModal && (
        <div className="event-details-overlay" onClick={() => setShowModal(false)} role="dialog" aria-modal="true">
          <div className="event-details-card" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="event-details-header">
              <div className="event-details-header-main">
                <div className="event-details-pills">
                  {competition.category && (
                    <span className="event-pill event-pill-category">
                      {competition.category}
                    </span>
                  )}
                  {competition.registrationStatus && (
                    <span className={`event-pill ${isOpen ? 'event-pill-open' : 'event-pill-muted'}`}>
                      {competition.registrationStatus}
                    </span>
                  )}
                  <span className="event-pill-num">Event #{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="event-details-title">{competition.title}</h3>
              </div>

              <button 
                type="button" 
                className="event-details-close-btn" 
                onClick={() => setShowModal(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body with Distinct Section Cards */}
            <div className="event-details-body">
              {competition.imageUrl && (
                <div className="event-details-image-wrap">
                  <img 
                    src={competition.imageUrl} 
                    alt={competition.title} 
                    className="event-details-img"
                  />
                </div>
              )}

              {/* SECTION CARD 1: Quick Specs (Schedule, Venue, Prizes) */}
              {((competition.eventDate || competition.eventTime) || competition.venue || competition.prizeDetails) && (
                <div className="event-section-card event-meta-strip-card">
                  <div className="event-meta-strip">
                    {(competition.eventDate || competition.eventTime) && (
                      <div className="event-meta-cell">
                        <div className="event-meta-icon">
                          <Calendar size={15} />
                        </div>
                        <div className="event-meta-content">
                          <span className="event-meta-label">Schedule</span>
                          <span className="event-meta-val">
                            {competition.eventDate} {competition.eventTime ? `• ${competition.eventTime}` : ''}
                          </span>
                        </div>
                      </div>
                    )}

                    {competition.venue && (
                      <div className="event-meta-cell">
                        <div className="event-meta-icon">
                          <MapPin size={15} />
                        </div>
                        <div className="event-meta-content">
                          <span className="event-meta-label">Venue</span>
                          <span className="event-meta-val">{competition.venue}</span>
                        </div>
                      </div>
                    )}

                    {competition.prizeDetails && (
                      <div className="event-meta-cell">
                        <div className="event-meta-icon prize-icon">
                          <Trophy size={15} />
                        </div>
                        <div className="event-meta-content">
                          <span className="event-meta-label">Prizes</span>
                          <span className="event-meta-val">{competition.prizeDetails}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION CARD 2: Complete Description & Details */}
              {rawDescription && (
                <div className="event-section-card">
                  <div className="event-section-card-header">
                    <BookOpen size={14} className="event-card-header-icon" />
                    <span>Event Details & Overview</span>
                  </div>
                  <div className="event-section-card-text">
                    {rawDescription}
                  </div>
                </div>
              )}

              {/* SECTION CARD 3: Complete Rules & Guidelines */}
              {rawRules && (
                <div className="event-section-card event-rules-card">
                  <div className="event-section-card-header">
                    <FileText size={14} className="event-card-header-icon" />
                    <span>Rules & Guidelines</span>
                  </div>
                  <div className="event-section-card-text event-rules-text">
                    {rawRules}
                  </div>
                </div>
              )}

              {/* SECTION CARD 4: Event Coordinators & Contact Info (If phone numbers are detected) */}
              {coordinators.length > 0 && (
                <div className="event-section-card event-coordinator-card">
                  <div className="event-section-card-header">
                    <Users size={14} className="event-card-header-icon" />
                    <span>Quick Contact / Event Coordinators</span>
                  </div>
                  <div className="event-coords-container">
                    {coordinators.map((coord, idx) => (
                      <div key={idx} className="event-coord-item">
                        <div className="event-coord-meta">
                          <span className="event-coord-name">{coord.name}</span>
                          <span className="event-coord-phone">{coord.phone}</span>
                        </div>
                        <div className="event-coord-actions">
                          <a 
                            href={`tel:${coord.phone}`} 
                            className="event-coord-btn coord-call"
                            title={`Call ${coord.name}`}
                          >
                            <Phone size={13} />
                            <span>Call</span>
                          </a>
                          <a 
                            href={`https://wa.me/${coord.cleanPhone}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="event-coord-btn coord-wa"
                            title={`WhatsApp ${coord.name}`}
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

            </div>

            {/* Modal Footer */}
            <div className="event-details-footer">
              <button 
                type="button" 
                className="event-details-close-btn-footer" 
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
