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
  FileText,
  X,
  Phone,
  MessageCircle,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Users,
  Award,
  Layers
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

// Helper to intelligently parse unstructured description text into organized sections
function parseCompetitionDetails(description = '', rulesText = '') {
  const text = (description || '').trim();

  // 1. Coordinators extraction (handles -Dr.Name # Phone, Coordinators - Name # Phone, etc.)
  const coordinators = [];
  const coordRegex = /(?:Coordinators?[\s\-:]*)?([A-Za-z\s.\-–—]+?)\s*#\s*([\d\s\-+]{8,15})/gi;
  let m;
  while ((m = coordRegex.exec(text)) !== null) {
    let rawName = m[1].replace(/Coordinators?[\s\-:]*/gi, '').trim();
    rawName = rawName.replace(/^[-–—,]\s*/, '').replace(/[-–—,]\s*$/, '').trim();
    const rawPhone = m[2].trim();
    const cleanPhone = rawPhone.replace(/\D/g, '');
    if (rawName && cleanPhone.length >= 8) {
      coordinators.push({
        name: rawName,
        phone: rawPhone,
        cleanPhone: cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone
      });
    }
  }

  // 2. Theme extraction
  let theme = null;
  const themeMatch = text.match(/Theme:?\s*([^\n\r•🔹"“”]+)(?:["“]([^"”]+)["”])?/i);
  if (themeMatch) {
    theme = {
      title: themeMatch[1]?.trim() || '',
      quote: themeMatch[2]?.trim() || ''
    };
  } else {
    const quoteMatch = text.match(/["“](Say NO to Drugs[^"”]+)["”]/i);
    if (quoteMatch) {
      theme = { title: 'ANTI-DRUG AWARENESS', quote: quoteMatch[1] };
    }
  }

  // 3. Categories / Eligibility extraction
  const categories = [];
  const classMatch = text.match(/\(CLASSES\s*([0-9–\-\s]+)\)/i);
  if (classMatch) categories.push(`Classes ${classMatch[1].trim()}`);

  const catMatches = text.matchAll(/Category\s*\d+:?\s*([^\n\r•🔹📍1-9]+)/gi);
  for (const cm of catMatches) {
    const val = cm[1]?.trim();
    if (val && !categories.includes(val)) {
      categories.push(val.startsWith('Classes') ? val : `Classes ${val}`);
    }
  }

  const openMatch = text.match(/The competition is open to ([^.\n]+)/i);
  if (openMatch && categories.length === 0) {
    categories.push(openMatch[1].trim());
  }

  // 4. Guidelines extraction
  const guidelines = [];
  if (rulesText && rulesText.trim()) {
    rulesText.split('\n').map(r => r.trim()).filter(Boolean).forEach(r => {
      const clean = r.replace(/^\d+[\.\)]\s*/, '').replace(/^[-•*]\s*/, '').trim();
      if (clean) guidelines.push(clean);
    });
  }

  const bulletMatches = text.matchAll(/[🔹•*🎯]\s*([^\n🔹•*🎯]+)/g);
  for (const bm of bulletMatches) {
    const clean = bm[1]?.trim();
    if (
      clean && 
      !clean.toLowerCase().startsWith('category') && 
      !clean.toLowerCase().startsWith('coordinator') && 
      !guidelines.includes(clean)
    ) {
      guidelines.push(clean);
    }
  }

  // 5. Clean Intro (strip coordinator lines, theme, bullets, classes, etc.)
  let intro = text
    .replace(/Coordinators?[\s\S]*?(?=\n\n|$)/gi, '')
    .replace(/(?:[A-Za-z\s.\-–—]+)\s*#\s*[\d\s\-+]{8,15}/gi, '')
    .replace(/Theme:?[^\n\r•🔹"“”]+(?:["“][^"”]+)["”]/gi, '')
    .replace(/["“]Say NO to Drugs[^"”]+["”]/gi, '')
    .replace(/POSTER DESIGNING COMPETITION \(CLASSES [0-9–\-\s]+\)/gi, '')
    .replace(/Categories:[\s\S]*?(?=1st|2nd|Coordinator|$)/gi, '')
    .replace(/[🔹•*🎯]\s*[^\n🔹•*🎯]+/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim();

  // If intro has no real description left (or only had coordinator text), clear it out
  if (
    intro.toLowerCase().startsWith('coordinator') || 
    intro.includes('#') || 
    intro.length < 15
  ) {
    intro = '';
  }

  return { coordinators, theme, categories, guidelines, intro };
}

export function CompetitionCard({ competition, index = 0, siteConfig }) {
  const [showModal, setShowModal] = useState(false);

  const registrationUrl = (siteConfig?.registrationUrl && siteConfig.registrationUrl.trim() !== '')
    ? siteConfig.registrationUrl.trim()
    : (competition.registrationUrl || 'https://forms.google.com');

  const { coordinators, theme, categories, guidelines, intro } = parseCompetitionDetails(
    competition.description, 
    competition.rules
  );

  return (
    <>
      <article className="competition-clipboard" aria-label={`Competition: ${competition.title}`}>
        {/* Wooden Board Top Hanging Hole */}
        <div className="clipboard-hang-hole" aria-hidden="true" />

        {/* Realistic Metallic Spring Clamp Assembly */}
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
          {/* Header Row: Exam sheet index & Status Stamp */}
          <div className="clipboard-paper-header">
            <div className="clipboard-sheet-tag">
              <span className="sheet-num">EVENT #{String(index + 1).padStart(2, '0')}</span>
              <span className="sheet-sep">•</span>
              <span>ENTRY SHEET</span>
            </div>
            {competition.registrationStatus && (
              <span className={`clipboard-status-stamp ${competition.registrationStatus.toLowerCase().includes('open') ? 'stamp-open' : 'stamp-closed'}`}>
                {competition.registrationStatus}
              </span>
            )}
          </div>

          {/* Title & Track Icon */}
          <div className="clipboard-title-row">
            <div className="clipboard-track-icon">
              {getCompetitionIcon(competition.title)}
            </div>
            <h3 className="clipboard-title">{competition.title}</h3>
          </div>

          {/* Clean Description Excerpt */}
          <div className="clipboard-desc-wrapper">
            <p className="clipboard-desc">
              {competition.description || 'Event guidelines and instructions will be updated shortly.'}
            </p>
          </div>

          {/* Examination Specs Mini-Table */}
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

          {/* Footer Action */}
          <div className="clipboard-footer">
            <button 
              type="button" 
              className="clipboard-btn"
              onClick={() => setShowModal(true)}
              aria-label={`View guidelines for ${competition.title}`}
            >
              <FileText size={15} />
              <span>View Full Guidelines</span>
            </button>
          </div>
        </div>
      </article>

      {/* OPTION 1: OFFICIAL EVENT CIRCULAR & FACT SHEET MODAL */}
      {showModal && (
        <div className="circular-modal-overlay" onClick={() => setShowModal(false)} role="dialog" aria-modal="true">
          <div className="circular-modal-card" onClick={(e) => e.stopPropagation()}>
            
            {/* Circular Header */}
            <div className="circular-modal-header">
              <div className="circular-header-content">
                <div className="circular-header-badge-row">
                  <span className="circular-badge-event">EVENT #{String(index + 1).padStart(2, '0')}</span>
                  <span className="circular-badge-dot">•</span>
                  <span className="circular-badge-text">OFFICIAL CIRCULAR</span>
                  {competition.registrationStatus && (
                    <span className={`clipboard-status-stamp ${competition.registrationStatus.toLowerCase().includes('open') ? 'stamp-open' : 'stamp-closed'}`}>
                      {competition.registrationStatus}
                    </span>
                  )}
                </div>

                <div className="circular-title-wrapper">
                  <div className="clipboard-track-icon circular-title-icon">
                    {getCompetitionIcon(competition.title)}
                  </div>
                  <h3 className="circular-modal-title">{competition.title}</h3>
                </div>
              </div>

              <button 
                type="button" 
                className="circular-modal-close-btn" 
                onClick={() => setShowModal(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Circular 2-Column Body */}
            <div className="circular-modal-body">
              
              {/* LEFT COLUMN: Main Overview, Theme & Guidelines */}
              <div className="circular-main-col">
                {competition.imageUrl && (
                  <div className="circular-cover-img-wrapper">
                    <img 
                      src={competition.imageUrl} 
                      alt={competition.title} 
                      className="circular-cover-img"
                    />
                  </div>
                )}

                {/* Theme Highlight Banner (if extracted or present) */}
                {theme && (
                  <div className="circular-theme-banner">
                    <div className="circular-theme-tag">
                      <Sparkles size={14} />
                      <span>Official Event Theme</span>
                    </div>
                    {theme.title && (
                      <h4 className="circular-theme-title">{theme.title}</h4>
                    )}
                    {theme.quote && (
                      <p className="circular-theme-quote">"{theme.quote}"</p>
                    )}
                  </div>
                )}

                {/* Event Overview Section (only if actual intro exists) */}
                {intro && intro.trim().length > 0 && (
                  <div>
                    <h4 className="circular-section-title">
                      <FileText size={16} color="#2878D0" />
                      <span>Contest Brief</span>
                    </h4>
                    <p className="circular-desc-content">
                      {intro}
                    </p>
                  </div>
                )}

                {/* Eligibility / Categories Badges */}
                {categories.length > 0 && (
                  <div>
                    <h4 className="circular-section-title">
                      <Layers size={16} color="#2878D0" />
                      <span>Eligibility & Tracks</span>
                    </h4>
                    <div className="circular-categories-wrap">
                      {categories.map((cat, idx) => (
                        <span key={idx} className="circular-cat-pill">
                          <Users size={13} />
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Guidelines Checklist */}
                {guidelines.length > 0 ? (
                  <div className="circular-guidelines-box">
                    <h4 className="circular-section-title" style={{ marginBottom: '0.85rem' }}>
                      <CheckCircle2 size={16} color="#15803D" />
                      <span>Official Guidelines & Regulations</span>
                    </h4>
                    <ul className="circular-guidelines-list">
                      {guidelines.map((rule, idx) => (
                        <li key={idx} className="circular-guideline-item">
                          <CheckCircle2 size={15} className="circular-guideline-icon" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : competition.rules ? (
                  <div className="circular-guidelines-box">
                    <h4 className="circular-section-title" style={{ marginBottom: '0.85rem' }}>
                      <CheckCircle2 size={16} color="#15803D" />
                      <span>Official Guidelines & Regulations</span>
                    </h4>
                    <div className="circular-desc-content" style={{ fontSize: '0.875rem' }}>
                      {competition.rules}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* RIGHT COLUMN: Fact Sheet Sidebar & Quick Action */}
              <div className="circular-sidebar-col">
                
                {/* Fact Sheet 1: Schedule & Venue */}
                <div className="circular-fact-card">
                  <div className="circular-fact-card-header">
                    <Calendar size={13} color="#2878D0" />
                    <span>Schedule & Venue</span>
                  </div>
                  {competition.eventDate && (
                    <div className="circular-fact-row">
                      <Calendar size={15} color="#2878D0" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <strong>Date:</strong> {competition.eventDate}
                      </div>
                    </div>
                  )}
                  {competition.eventTime && (
                    <div className="circular-fact-row">
                      <Clock size={15} color="#2878D0" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <strong>Time:</strong> {competition.eventTime}
                      </div>
                    </div>
                  )}
                  {competition.venue && (
                    <div className="circular-fact-row">
                      <MapPin size={15} color="#2878D0" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <strong>Venue:</strong> {competition.venue}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fact Sheet 2: Prize Pool */}
                {competition.prizeDetails && (
                  <div className="circular-fact-card circular-prize-card">
                    <div className="circular-fact-card-header">
                      <Award size={14} color="#B45309" />
                      <span>Prize Pool</span>
                    </div>
                    <div className="circular-prize-val">
                      {competition.prizeDetails}
                    </div>
                  </div>
                )}

                {/* Fact Sheet 3: Coordinators with Direct Call & WhatsApp */}
                {coordinators.length > 0 && (
                  <div className="circular-fact-card">
                    <div className="circular-fact-card-header">
                      <Users size={13} color="#2878D0" />
                      <span>Event Coordinators</span>
                    </div>
                    <div>
                      {coordinators.map((coord, idx) => (
                        <div key={idx} className="circular-coord-item">
                          <span className="circular-coord-name">{coord.name}</span>
                          <div className="circular-coord-actions">
                            <a 
                              href={`tel:${coord.phone}`} 
                              className="circular-call-btn"
                              title={`Call ${coord.name}`}
                            >
                              <Phone size={11} />
                              <span>Call</span>
                            </a>
                            <a 
                              href={`https://wa.me/${coord.cleanPhone}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="circular-wa-btn"
                              title={`WhatsApp ${coord.name}`}
                            >
                              <MessageCircle size={11} />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fact Sheet 4: Register Action */}
                <a 
                  href={registrationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="circular-register-cta"
                  id={`circular-register-${competition.id || index}`}
                >
                  <span>Register for Event</span>
                  <ArrowUpRight size={18} />
                </a>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="circular-modal-footer">
              <a 
                href={registrationUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="circular-footer-register-btn"
              >
                <span>Register for Event</span>
                <ArrowUpRight size={15} />
              </a>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={() => setShowModal(false)}
              >
                Close Circular
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
