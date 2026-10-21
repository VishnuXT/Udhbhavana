import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Layers, 
  Sparkles,
  HeartHandshake,
  Trophy,
  BookOpen,
  Award,
  UserCheck,
  Calendar,
  MessageSquare,
  Eye,
  Sliders,
  ArrowRight,
  Plus,
  Trash2,
  Users
} from 'lucide-react';

export function WebsiteContentEditor({ siteConfig, onSave, onNavigateTab }) {
  const [formData, setFormData] = useState(siteConfig);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeSection, setActiveSection] = useState('all');

  useEffect(() => {
    if (!isDirty) {
      setFormData(siteConfig);
    }
  }, [siteConfig, isDirty]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setNotification(null);
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
    setIsDirty(true);
    setNotification(null);
  };

  const handleToggleSection = (sectionKey) => {
    setFormData(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev?.sectionVisibility,
        [sectionKey]: !prev?.sectionVisibility?.[sectionKey]
      }
    }));
    setIsDirty(true);
    setNotification(null);
  };

  const getRulesList = () => {
    if (Array.isArray(formData?.competitionRulesList)) {
      return formData.competitionRulesList;
    }
    return [
      {
        id: 'rule-1',
        title: formData?.competitionRule1Title || 'Register Properly',
        description: formData?.competitionRule1Desc || 'Complete registration before participating.'
      },
      {
        id: 'rule-2',
        title: formData?.competitionRule2Title || 'Follow Guidelines',
        description: formData?.competitionRule2Desc || 'Read the rules for your chosen competition.'
      },
      {
        id: 'rule-3',
        title: formData?.competitionRule3Title || 'Maintain Fairness',
        description: formData?.competitionRule3Desc || 'Submit original work and follow ethical practices.'
      },
      {
        id: 'rule-4',
        title: formData?.competitionRule4Title || 'Be Respectful',
        description: formData?.competitionRule4Desc || 'Respect participants, coordinators, and judges.'
      }
    ];
  };

  const handleRuleChange = (index, field, value) => {
    const currentRules = [...getRulesList()];
    currentRules[index] = {
      ...currentRules[index],
      [field]: value
    };
    handleChange('competitionRulesList', currentRules);
  };

  const handleAddRule = () => {
    const currentRules = [...getRulesList()];
    const newRuleNumber = currentRules.length + 1;
    currentRules.push({
      id: `rule-${Date.now()}`,
      title: `Rule ${newRuleNumber}`,
      description: ''
    });
    handleChange('competitionRulesList', currentRules);
  };

  const handleRemoveRule = (index) => {
    const currentRules = getRulesList().filter((_, i) => i !== index);
    handleChange('competitionRulesList', currentRules);
  };

  const handleMoveRule = (index, direction) => {
    const currentRules = [...getRulesList()];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentRules.length) return;
    const temp = currentRules[index];
    currentRules[index] = currentRules[targetIndex];
    currentRules[targetIndex] = temp;
    handleChange('competitionRulesList', currentRules);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setNotification(null);

    const payload = {
      ...formData,
      competitionRulesList: getRulesList()
    };

    const result = await onSave(payload);
    setSaving(false);

    if (result?.success) {
      setIsDirty(false);
      setNotification({ type: 'success', text: 'Section content updated and published to live website!' });
    } else {
      setNotification({ type: 'error', text: result?.error || 'Failed to update content.' });
    }
  };

  const handleReset = () => {
    setFormData(siteConfig);
    setIsDirty(false);
    setNotification(null);
  };

  const sectionsList = [
    { id: 'all', label: 'All Sections', icon: <Layers size={15} /> },
    { id: 'hero', label: 'Hero & Branding', icon: <Sparkles size={15} />, key: 'hero' },
    { id: 'about', label: 'About Section', icon: <HeartHandshake size={15} />, key: 'about' },
    { id: 'competitions', label: 'Competitions Header', icon: <Trophy size={15} />, key: 'competitions' },
    { id: 'rules', label: 'Rules Blackboard', icon: <BookOpen size={15} />, key: 'competitionRules' },
    { id: 'prizes', label: 'Prize Pool', icon: <Award size={15} />, key: 'prizes' },
    { id: 'inauguration', label: 'Inauguration', icon: <UserCheck size={15} />, key: 'inauguration' },
    { id: 'venue', label: 'Venue & Schedule', icon: <Calendar size={15} />, key: 'eventInfo' },
    { id: 'contact', label: 'Contact & Socials', icon: <MessageSquare size={15} />, key: 'contact' },
    { id: 'footer', label: 'Footer & Copyright', icon: <Sliders size={15} /> },
    { id: 'visibility', label: 'Section Visibility', icon: <Eye size={15} /> }
  ];

  const shouldShowSection = (id) => {
    return activeSection === 'all' || activeSection === id;
  };

  const renderSectionSaveBar = (sectionLabel) => (
    <div className="section-card-action-bar">
      <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
        Editing: <strong>{sectionLabel}</strong>
      </span>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {isDirty && (
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={handleReset}
            disabled={saving}
          >
            <RotateCcw size={13} />
            Reset
          </button>
        )}
        <button 
          type="button" 
          className="btn btn-primary btn-sm"
          onClick={handleSubmit}
          disabled={saving || !isDirty}
        >
          <Save size={14} />
          {saving ? 'Saving...' : 'Save & Publish'}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Top Header & Sticky Action Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#142A55' }}>Section-by-Section Content Editor</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
            Customize all copy, headings, and options per section. Changes sync live to Firestore.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isDirty && (
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={handleReset}
              disabled={saving}
            >
              <RotateCcw size={15} />
              Reset Unsaved
            </button>
          )}
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={handleSubmit}
            disabled={saving || !isDirty}
          >
            <Save size={15} />
            {saving ? 'Publishing...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {notification && (
        <div className={`alert-banner ${notification.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{notification.text}</span>
        </div>
      )}

      {isDirty && !notification && (
        <div className="alert-banner alert-info" style={{ backgroundColor: '#FEF8E7', borderColor: '#FCD34D', color: '#B45309' }}>
          <AlertCircle size={18} />
          <span>You have unsaved edits in this section. Click "Save & Publish" to update the live website.</span>
        </div>
      )}

      {/* Section Filter Pills */}
      <div className="section-nav-pills" role="tablist" aria-label="Sections">
        {sectionsList.map((sec) => (
          <button
            key={sec.id}
            type="button"
            className={`section-pill-btn ${activeSection === sec.id ? 'active' : ''}`}
            onClick={() => setActiveSection(sec.id)}
            role="tab"
            aria-selected={activeSection === sec.id}
          >
            {sec.icon}
            <span>{sec.label}</span>
            {sec.key && formData?.sectionVisibility?.[sec.key] === false && (
              <span style={{ 
                fontSize: '0.7rem', 
                backgroundColor: '#EF4444', 
                color: '#FFF', 
                padding: '2px 6px', 
                borderRadius: '10px',
                marginLeft: '4px' 
              }}>
                Hidden
              </span>
            )}
          </button>
        ))}
      </div>

      {/* =========================================================================
          SECTION 1: HERO & CORE BRANDING
          ========================================================================= */}
      {shouldShowSection('hero') && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="stat-card-icon navy" style={{ width: 38, height: 38 }}>
                <Sparkles size={18} />
              </div>
              <div>
                <h3>1. Hero & Core Branding</h3>
                <p>Event edition name, slogan, tagline, and hero call-to-actions</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Show in Hero:</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={formData?.sectionVisibility?.hero !== false}
                  onChange={() => handleToggleSection('hero')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="eventName">Event Edition Title</label>
                <input 
                  id="eventName"
                  type="text" 
                  className="form-input" 
                  value={formData?.eventName || ''} 
                  onChange={(e) => handleChange('eventName', e.target.value)} 
                  placeholder="e.g. Udhbhavana 2026"
                  required 
                />
                <span className="form-hint">Displayed in page title, hero visual, and navbar.</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tagline">Event Tagline</label>
                <input 
                  id="tagline"
                  type="text" 
                  className="form-input" 
                  value={formData?.tagline || ''} 
                  onChange={(e) => handleChange('tagline', e.target.value)} 
                  placeholder="e.g. Aim IT.. Win IT"
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="awarenessMessage">Awareness Message / Theme</label>
                <input 
                  id="awarenessMessage"
                  type="text" 
                  className="form-input" 
                  value={formData?.awarenessMessage || ''} 
                  onChange={(e) => handleChange('awarenessMessage', e.target.value)} 
                  placeholder="e.g. No to drugs, Yes to life"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="registrationUrl">
                  Unified Registration Form Link
                  <span className="form-hint">(Used by Hero button, Navbar, and the Competitions section registration button)</span>
                </label>
                <input 
                  id="registrationUrl"
                  type="url" 
                  className="form-input" 
                  value={formData?.registrationUrl || ''} 
                  onChange={(e) => handleChange('registrationUrl', e.target.value)} 
                  placeholder="https://forms.google.com/..."
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="institutionName">Host Institution Name</label>
                <input 
                  id="institutionName"
                  type="text" 
                  className="form-input" 
                  value={formData?.institutionName || ''} 
                  onChange={(e) => handleChange('institutionName', e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="associationName">Associated Partner / Foundation</label>
                <input 
                  id="associationName"
                  type="text" 
                  className="form-input" 
                  value={formData?.associationName || ''} 
                  onChange={(e) => handleChange('associationName', e.target.value)} 
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="heroExploreBtnText">Primary Button Text</label>
                <input 
                  id="heroExploreBtnText"
                  type="text" 
                  className="form-input" 
                  value={formData?.heroExploreBtnText || ''} 
                  onChange={(e) => handleChange('heroExploreBtnText', e.target.value)} 
                  placeholder="Explore Competitions"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="heroRegisterBtnText">Secondary Button Text</label>
                <input 
                  id="heroRegisterBtnText"
                  type="text" 
                  className="form-input" 
                  value={formData?.heroRegisterBtnText || ''} 
                  onChange={(e) => handleChange('heroRegisterBtnText', e.target.value)} 
                  placeholder="Register Now"
                />
              </div>
            </div>
          </div>
          {renderSectionSaveBar('Hero & Core Branding')}
        </div>
      )}

      {/* =========================================================================
          SECTION 2: ABOUT SECTION
          ========================================================================= */}
      {shouldShowSection('about') && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="stat-card-icon blue" style={{ width: 38, height: 38 }}>
                <HeartHandshake size={18} />
              </div>
              <div>
                <h3>2. About Section & Highlights</h3>
                <p>Narrative background, mission, and the three key pillar highlight cards</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Section Active:</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={formData?.sectionVisibility?.about !== false}
                  onChange={() => handleToggleSection('about')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label" htmlFor="aboutTag">Section Tag / Pill</label>
                <input 
                  id="aboutTag"
                  type="text" 
                  className="form-input" 
                  value={formData?.aboutTag || ''} 
                  onChange={(e) => handleChange('aboutTag', e.target.value)} 
                  placeholder="Background & Purpose"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="aboutHeading">Section Heading</label>
                <input 
                  id="aboutHeading"
                  type="text" 
                  className="form-input" 
                  value={formData?.aboutHeading || ''} 
                  onChange={(e) => handleChange('aboutHeading', e.target.value)} 
                  placeholder="About Udhbhavana"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="aboutSubtitle">Section Subtitle</label>
                <input 
                  id="aboutSubtitle"
                  type="text" 
                  className="form-input" 
                  value={formData?.aboutSubtitle || ''} 
                  onChange={(e) => handleChange('aboutSubtitle', e.target.value)} 
                  placeholder="Uniting technical excellence with social empowerment"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="aboutDescription">Main Narrative Paragraph</label>
              <textarea 
                id="aboutDescription"
                className="form-textarea" 
                rows={4}
                value={formData?.aboutDescription || ''} 
                onChange={(e) => handleChange('aboutDescription', e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="aboutSubDescription">Secondary Description Paragraph</label>
              <textarea 
                id="aboutSubDescription"
                className="form-textarea" 
                rows={3}
                value={formData?.aboutSubDescription || ''} 
                onChange={(e) => handleChange('aboutSubDescription', e.target.value)} 
              />
            </div>

            <h4 style={{ fontSize: '1rem', color: '#142A55', marginTop: '1.25rem', marginBottom: '0.75rem' }}>
              Three Highlight Pillar Cards:
            </h4>

            {/* Highlight Box 1 */}
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E5EAF2', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, color: '#2878D0', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                Highlight 1 (Blue Accent)
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="aboutHighlight1Title">Card Title</label>
                  <input 
                    id="aboutHighlight1Title"
                    type="text" 
                    className="form-input" 
                    value={formData?.aboutHighlight1Title || ''} 
                    onChange={(e) => handleChange('aboutHighlight1Title', e.target.value)} 
                    placeholder="Autonomous Excellence"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="aboutHighlight1Desc">Card Description</label>
                  <input 
                    id="aboutHighlight1Desc"
                    type="text" 
                    className="form-input" 
                    value={formData?.aboutHighlight1Desc || ''} 
                    onChange={(e) => handleChange('aboutHighlight1Desc', e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Highlight Box 2 */}
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E5EAF2', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, color: '#B47805', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                Highlight 2 (Yellow Accent)
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="aboutHighlight2Title">Card Title</label>
                  <input 
                    id="aboutHighlight2Title"
                    type="text" 
                    className="form-input" 
                    value={formData?.aboutHighlight2Title || ''} 
                    onChange={(e) => handleChange('aboutHighlight2Title', e.target.value)} 
                    placeholder="Operation Toofan Alliance"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="aboutHighlight2Desc">Card Description</label>
                  <input 
                    id="aboutHighlight2Desc"
                    type="text" 
                    className="form-input" 
                    value={formData?.aboutHighlight2Desc || ''} 
                    onChange={(e) => handleChange('aboutHighlight2Desc', e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Highlight Box 3 */}
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E5EAF2' }}>
              <div style={{ fontWeight: 600, color: '#107C41', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                Highlight 3 (Green Accent)
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="aboutHighlight3Title">Card Title</label>
                  <input 
                    id="aboutHighlight3Title"
                    type="text" 
                    className="form-input" 
                    value={formData?.aboutHighlight3Title || ''} 
                    onChange={(e) => handleChange('aboutHighlight3Title', e.target.value)} 
                    placeholder="Social Commitment"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="aboutHighlight3Desc">Card Description</label>
                  <input 
                    id="aboutHighlight3Desc"
                    type="text" 
                    className="form-input" 
                    value={formData?.aboutHighlight3Desc || ''} 
                    onChange={(e) => handleChange('aboutHighlight3Desc', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </div>
          {renderSectionSaveBar('About Section & Highlights')}
        </div>
      )}

      {/* =========================================================================
          SECTION 3: COMPETITIONS HEADER
          ========================================================================= */}
      {shouldShowSection('competitions') && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="stat-card-icon yellow" style={{ width: 38, height: 38 }}>
                <Trophy size={18} />
              </div>
              <div>
                <h3>3. Competitions Section Header</h3>
                <p>Header titles and descriptions introducing the competition tracks</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Section Active:</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={formData?.sectionVisibility?.competitions !== false}
                  onChange={() => handleToggleSection('competitions')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label" htmlFor="competitionsTag">Section Tag / Pill</label>
                <input 
                  id="competitionsTag"
                  type="text" 
                  className="form-input" 
                  value={formData?.competitionsTag || ''} 
                  onChange={(e) => handleChange('competitionsTag', e.target.value)} 
                  placeholder="Events & Contests"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="competitionsHeading">Section Heading</label>
                <input 
                  id="competitionsHeading"
                  type="text" 
                  className="form-input" 
                  value={formData?.competitionsHeading || ''} 
                  onChange={(e) => handleChange('competitionsHeading', e.target.value)} 
                  placeholder="Explore Competitions"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="competitionsSubtitle">Section Subtitle</label>
                <input 
                  id="competitionsSubtitle"
                  type="text" 
                  className="form-input" 
                  value={formData?.competitionsSubtitle || ''} 
                  onChange={(e) => handleChange('competitionsSubtitle', e.target.value)} 
                  placeholder="Compete across five signature tracks..."
                />
              </div>
            </div>

            {/* Quick helper link to Competitions Manager */}
            {onNavigateTab && (
              <div style={{
                marginTop: '1rem',
                padding: '0.85rem 1rem',
                backgroundColor: '#EFF6FF',
                borderRadius: '8px',
                border: '1px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '0.85rem', color: '#1E40AF' }}>
                  Looking to edit, reorder, or add specific competition cards, dates, and form links?
                </span>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onNavigateTab('competitions')}
                >
                  Open Competitions Manager
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
          {renderSectionSaveBar('Competitions Section Header')}
        </div>
      )}

      {/* =========================================================================
          SECTION 4: COMPETITION RULES & INSTRUCTIONS (BLACKBOARD)
          ========================================================================= */}
      {shouldShowSection('rules') && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="stat-card-icon navy" style={{ width: 38, height: 38 }}>
                <BookOpen size={18} />
              </div>
              <div>
                <h3>Competition Rules & Instructions (Chalkboard)</h3>
                <p>Classroom chalkboard rules strip displayed right above the competition cards</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Show Rules Blackboard:</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={formData?.sectionVisibility?.competitionRules !== false && formData?.competitionRulesVisible !== false}
                  onChange={() => {
                    const currentVal = formData?.sectionVisibility?.competitionRules !== false && formData?.competitionRulesVisible !== false;
                    handleChange('competitionRulesVisible', !currentVal);
                    handleToggleSection('competitionRules');
                  }}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="admin-card-body">
            {/* Header Settings */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="competitionRulesTag">Chalk Badge Label</label>
                <input 
                  id="competitionRulesTag"
                  type="text" 
                  className="form-input" 
                  value={formData?.competitionRulesTag ?? 'COMPETITION RULES & INSTRUCTIONS'} 
                  onChange={(e) => handleChange('competitionRulesTag', e.target.value)} 
                  placeholder="COMPETITION RULES & INSTRUCTIONS"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="competitionRulesHeading">Chalkboard Title</label>
                <input 
                  id="competitionRulesHeading"
                  type="text" 
                  className="form-input" 
                  value={formData?.competitionRulesHeading ?? 'Read Before You Participate'} 
                  onChange={(e) => handleChange('competitionRulesHeading', e.target.value)} 
                  placeholder="Read Before You Participate"
                />
              </div>
            </div>

            {/* Dynamic Multiple Rules */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#142A55', margin: 0 }}>
                    Classroom Blackboard Rules ({getRulesList().length} Rules)
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '2px 0 0' }}>
                    Logos have been removed so you can add, reorder, or remove as many rules as you need.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddRule}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Plus size={14} />
                  Add Rule
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {getRulesList().map((rule, idx) => (
                  <div 
                    key={rule.id || idx} 
                    style={{ 
                      padding: '1rem', 
                      border: '1px solid #E2E8F0', 
                      borderRadius: '8px', 
                      backgroundColor: '#F8FAFC' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#142A55' }}>
                        Rule {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleMoveRule(idx, -1)}
                          disabled={idx === 0}
                          style={{ padding: '2px 8px', fontSize: '0.8rem', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleMoveRule(idx, 1)}
                          disabled={idx === getRulesList().length - 1}
                          style={{ padding: '2px 8px', fontSize: '0.8rem', cursor: idx === getRulesList().length - 1 ? 'not-allowed' : 'pointer' }}
                          title="Move Down"
                        >
                          ↓
                        </button>
                        {getRulesList().length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => handleRemoveRule(idx)}
                            style={{ 
                              padding: '2px 8px', 
                              fontSize: '0.8rem', 
                              color: '#DC2626', 
                              backgroundColor: '#FEE2E2',
                              borderRadius: '4px' 
                            }}
                            title="Remove Rule"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Rule Title</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={rule.title || ''} 
                          onChange={(e) => handleRuleChange(idx, 'title', e.target.value)} 
                          placeholder="e.g. Register Properly"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Rule Description</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={rule.description || ''} 
                          onChange={(e) => handleRuleChange(idx, 'description', e.target.value)} 
                          placeholder="Short rule explanation"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddRule}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Plus size={14} />
                  Add Another Rule
                </button>
              </div>
            </div>
          </div>
          {renderSectionSaveBar('Competition Rules & Instructions')}
        </div>
      )}

      {/* =========================================================================
          SECTION 5: PRIZE POOL SECTION
          ========================================================================= */}
      {shouldShowSection('prizes') && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="stat-card-icon yellow" style={{ width: 38, height: 38 }}>
                <Award size={18} />
              </div>
              <div>
                <h3>4. Prize Pool Section</h3>
                <p>High-impact navy & gold banner celebrating event prize rewards</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Section Active:</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={formData?.sectionVisibility?.prizes !== false}
                  onChange={() => handleToggleSection('prizes')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="prizeTag">Badge / Tagline Above Headline</label>
                <input 
                  id="prizeTag"
                  type="text" 
                  className="form-input" 
                  value={formData?.prizeTag || ''} 
                  onChange={(e) => handleChange('prizeTag', e.target.value)} 
                  placeholder="Rewarding Innovation & Brilliance"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prizePoolText">Prize Pool Big Headline</label>
                <input 
                  id="prizePoolText"
                  type="text" 
                  className="form-input" 
                  value={formData?.prizePoolText || ''} 
                  onChange={(e) => handleChange('prizePoolText', e.target.value)} 
                  placeholder="Prizes over ₹1 lakh"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prizeDesc">Prize Detailed Description</label>
              <textarea 
                id="prizeDesc"
                className="form-textarea" 
                rows={2}
                value={formData?.prizeDesc || ''} 
                onChange={(e) => handleChange('prizeDesc', e.target.value)} 
              />
            </div>
          </div>
          {renderSectionSaveBar('Prize Pool Section')}
        </div>
      )}

      {/* =========================================================================
          SECTION 5: INAUGURATION & CHIEF GUEST
          ========================================================================= */}
      {shouldShowSection('inauguration') && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="stat-card-icon navy" style={{ width: 38, height: 38 }}>
                <UserCheck size={18} />
              </div>
              <div>
                <h3>5. Inauguration & Dignitary Address</h3>
                <p>Chief Guest dignitary credentials and itinerary confirmation notice</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Section Active:</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={formData?.sectionVisibility?.inauguration !== false}
                  onChange={() => handleToggleSection('inauguration')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label" htmlFor="inaugurationTag">Section Tag / Pill</label>
                <input 
                  id="inaugurationTag"
                  type="text" 
                  className="form-input" 
                  value={formData?.inaugurationTag || ''} 
                  onChange={(e) => handleChange('inaugurationTag', e.target.value)} 
                  placeholder="Dignitary & Inaugural Address"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inaugurationHeading">Section Heading</label>
                <input 
                  id="inaugurationHeading"
                  type="text" 
                  className="form-input" 
                  value={formData?.inaugurationHeading || ''} 
                  onChange={(e) => handleChange('inaugurationHeading', e.target.value)} 
                  placeholder="Inauguration"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inaugurationSubtitle">Section Subtitle</label>
                <input 
                  id="inaugurationSubtitle"
                  type="text" 
                  className="form-input" 
                  value={formData?.inaugurationSubtitle || ''} 
                  onChange={(e) => handleChange('inaugurationSubtitle', e.target.value)} 
                  placeholder="Honoring our esteemed chief guest..."
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label" htmlFor="guestLabel">Role Label</label>
                <input 
                  id="guestLabel"
                  type="text" 
                  className="form-input" 
                  value={formData?.guestLabel || ''} 
                  onChange={(e) => handleChange('guestLabel', e.target.value)} 
                  placeholder="Inauguration by"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="guestName">Chief Guest Name</label>
                <input 
                  id="guestName"
                  type="text" 
                  className="form-input" 
                  value={formData?.guestName || ''} 
                  onChange={(e) => handleChange('guestName', e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="guestDesignation">Official Designation</label>
                <input 
                  id="guestDesignation"
                  type="text" 
                  className="form-input" 
                  value={formData?.guestDesignation || ''} 
                  onChange={(e) => handleChange('guestDesignation', e.target.value)} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="guestImage">
                Chief Guest Photo URL (Optional)
                <span className="form-hint">(Leave blank to display sleek default avatar)</span>
              </label>
              <input 
                id="guestImage"
                type="text" 
                className="form-input" 
                value={formData?.guestImage || ''} 
                onChange={(e) => handleChange('guestImage', e.target.value)} 
                placeholder="https://... or data:image/..."
              />
            </div>

            <div className="toggle-switch-row" style={{ marginTop: '0.75rem' }}>
              <div className="toggle-switch-label">
                <span className="toggle-switch-title">Guest Itinerary Formally Confirmed</span>
                <span className="toggle-switch-desc">
                  Toggle on when guest schedule is final. When off, a disclaimer note is displayed.
                </span>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={Boolean(formData?.guestConfirmed)}
                  onChange={(e) => handleChange('guestConfirmed', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            {!formData?.guestConfirmed && (
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label" htmlFor="guestUnconfirmedNote">Tentative Disclaimer Note</label>
                <input 
                  id="guestUnconfirmedNote"
                  type="text" 
                  className="form-input" 
                  value={formData?.guestUnconfirmedNote || ''} 
                  onChange={(e) => handleChange('guestUnconfirmedNote', e.target.value)} 
                />
              </div>
            )}
          </div>
          {renderSectionSaveBar('Inauguration & Chief Guest')}
        </div>
      )}

      {/* =========================================================================
          SECTION 6: VENUE, SCHEDULE & MAP
          ========================================================================= */}
      {shouldShowSection('venue') && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="stat-card-icon green" style={{ width: 38, height: 38 }}>
                <Calendar size={18} />
              </div>
              <div>
                <h3>6. Location, Schedule & Directions</h3>
                <p>Event date, reporting schedule, campus venue, and Google Maps routing</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Section Active:</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={formData?.sectionVisibility?.eventInfo !== false}
                  onChange={() => handleToggleSection('eventInfo')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label" htmlFor="eventInfoTag">Section Tag / Pill</label>
                <input 
                  id="eventInfoTag"
                  type="text" 
                  className="form-input" 
                  value={formData?.eventInfoTag || ''} 
                  onChange={(e) => handleChange('eventInfoTag', e.target.value)} 
                  placeholder="Location & Schedule"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="eventInfoHeading">Section Heading</label>
                <input 
                  id="eventInfoHeading"
                  type="text" 
                  className="form-input" 
                  value={formData?.eventInfoHeading || ''} 
                  onChange={(e) => handleChange('eventInfoHeading', e.target.value)} 
                  placeholder="Event Information & Venue"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="eventInfoSubtitle">Section Subtitle</label>
                <input 
                  id="eventInfoSubtitle"
                  type="text" 
                  className="form-input" 
                  value={formData?.eventInfoSubtitle || ''} 
                  onChange={(e) => handleChange('eventInfoSubtitle', e.target.value)} 
                  placeholder="Everything you need to know..."
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="eventDate">Event Official Date</label>
                <input 
                  id="eventDate"
                  type="text" 
                  className="form-input" 
                  value={formData?.eventDate || ''} 
                  onChange={(e) => handleChange('eventDate', e.target.value)} 
                  placeholder="09 November 2026"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="eventDateSub">Date Card Caption</label>
                <input 
                  id="eventDateSub"
                  type="text" 
                  className="form-input" 
                  value={formData?.eventDateSub || ''} 
                  onChange={(e) => handleChange('eventDateSub', e.target.value)} 
                  placeholder="Mark your calendar"
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="eventTime">Reporting Time</label>
                <input 
                  id="eventTime"
                  type="text" 
                  className="form-input" 
                  value={formData?.eventTime || ''} 
                  onChange={(e) => handleChange('eventTime', e.target.value)} 
                  placeholder="09:30 AM IST"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="eventTimeSub">Time Card Caption</label>
                <input 
                  id="eventTimeSub"
                  type="text" 
                  className="form-input" 
                  value={formData?.eventTimeSub || ''} 
                  onChange={(e) => handleChange('eventTimeSub', e.target.value)} 
                  placeholder="Inauguration begins promptly"
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="venue">Campus Venue</label>
                <input 
                  id="venue"
                  type="text" 
                  className="form-input" 
                  value={formData?.venue || ''} 
                  onChange={(e) => handleChange('venue', e.target.value)} 
                  placeholder="College Auditorium & Campus Labs"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="eventVenueSub">Venue Card Subtext</label>
                <input 
                  id="eventVenueSub"
                  type="text" 
                  className="form-input" 
                  value={formData?.eventVenueSub || ''} 
                  onChange={(e) => handleChange('eventVenueSub', e.target.value)} 
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="address">Full Campus Address</label>
                <textarea 
                  id="address"
                  className="form-textarea" 
                  rows={3}
                  value={formData?.address || ''} 
                  onChange={(e) => handleChange('address', e.target.value)} 
                />
              </div>

              <div>
                <div className="form-group">
                  <label className="form-label" htmlFor="mapsUrl">Google Maps URL</label>
                  <input 
                    id="mapsUrl"
                    type="url" 
                    className="form-input" 
                    value={formData?.mapsUrl || ''} 
                    onChange={(e) => handleChange('mapsUrl', e.target.value)} 
                    placeholder="https://maps.google.com/?q=..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="mapsLinkText">Button Text for Directions</label>
                  <input 
                    id="mapsLinkText"
                    type="text" 
                    className="form-input" 
                    value={formData?.mapsLinkText || ''} 
                    onChange={(e) => handleChange('mapsLinkText', e.target.value)} 
                    placeholder="Get Directions"
                  />
                </div>
              </div>
            </div>
          </div>
          {renderSectionSaveBar('Location, Schedule & Directions')}
        </div>
      )}

      {/* =========================================================================
          SECTION 7: CONTACT & SOCIAL MEDIA
          ========================================================================= */}
      {shouldShowSection('contact') && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="stat-card-icon blue" style={{ width: 38, height: 38 }}>
                <MessageSquare size={18} />
              </div>
              <div>
                <h3>7. Contact Desk & Official Channels</h3>
                <p>Support email, phone desk, institutional accreditations, and social media handles</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Section Active:</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={formData?.sectionVisibility?.contact !== false}
                  onChange={() => handleToggleSection('contact')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label" htmlFor="contactTag">Section Tag / Pill</label>
                <input 
                  id="contactTag"
                  type="text" 
                  className="form-input" 
                  value={formData?.contactTag || ''} 
                  onChange={(e) => handleChange('contactTag', e.target.value)} 
                  placeholder="Get in Touch"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contactHeading">Section Heading</label>
                <input 
                  id="contactHeading"
                  type="text" 
                  className="form-input" 
                  value={formData?.contactHeading || ''} 
                  onChange={(e) => handleChange('contactHeading', e.target.value)} 
                  placeholder="Contact & Inquiries"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contactSubtitle">Section Subtitle</label>
                <input 
                  id="contactSubtitle"
                  type="text" 
                  className="form-input" 
                  value={formData?.contactSubtitle || ''} 
                  onChange={(e) => handleChange('contactSubtitle', e.target.value)} 
                />
              </div>
            </div>

            {/* Smart Migration Assistant if coordinators were put into Section Tag/Pill */}
            {/#\s*\d{8,}|EVENT\s+COORDINATORS/i.test(formData?.contactTag || '') && !formData?.eventCoordinators && (
              <div style={{
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                margin: '1rem 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Sparkles size={18} style={{ flexShrink: 0, color: '#2563EB' }} />
                  <div>
                    <strong>Coordinators detected in Section Tag:</strong>
                    <div style={{ color: '#3B82F6', fontSize: '0.8rem', marginTop: '2px' }}>
                      Click below to move them into the dedicated coordinators field and restore the clean "Get in Touch" tag.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-sm"
                  style={{ backgroundColor: '#2563EB', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => {
                    const rawText = formData.contactTag || '';
                    const coords = rawText.replace(/^(?:EVENT\s+)?COORDINATORS?[\s\-–—:]*/i, '').trim();
                    handleChange('eventCoordinators', coords);
                    handleChange('contactTag', 'Get in Touch');
                  }}
                >
                  Move to Coordinators Field
                </button>
              </div>
            )}

            {/* Dedicated Event Coordinators Section in Admin */}
            <div style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '1.15rem',
              marginTop: '0.75rem',
              marginBottom: '1.25rem'
            }}>
              <div className="form-grid-2" style={{ marginBottom: '0.85rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="eventCoordinatorsTitle">Coordinators Block Title</label>
                  <input 
                    id="eventCoordinatorsTitle"
                    type="text" 
                    className="form-input" 
                    value={formData?.eventCoordinatorsTitle ?? 'Event Coordinators'} 
                    onChange={(e) => handleChange('eventCoordinatorsTitle', e.target.value)} 
                    placeholder="Event Coordinators"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="eventCoordinatorsSubtitle">Coordinators Block Subtitle</label>
                  <input 
                    id="eventCoordinatorsSubtitle"
                    type="text" 
                    className="form-input" 
                    value={formData?.eventCoordinatorsSubtitle ?? 'Direct contacts for event guidelines, inquiries & registration support'} 
                    onChange={(e) => handleChange('eventCoordinatorsSubtitle', e.target.value)} 
                    placeholder="Direct contacts for event guidelines, inquiries & registration support"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="eventCoordinators" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#142A55' }}>
                    <Users size={16} style={{ color: '#2878D0' }} />
                    Event Coordinators (Names & Phone Numbers)
                  </span>
                  <span className="form-hint" style={{ fontWeight: 400 }}>
                    Format: <code>Name # Phone</code> (comma or newline separated)
                  </span>
                </label>
                <textarea 
                  id="eventCoordinators"
                  rows="3"
                  className="form-input" 
                  style={{ resize: 'vertical', minHeight: '85px', fontFamily: 'inherit', lineHeight: 1.5, backgroundColor: '#FFFFFF' }}
                  value={formData?.eventCoordinators ?? (/#\s*\d{8,}|EVENT\s+COORDINATORS/i.test(formData?.contactTag || '') ? formData?.contactTag : '')} 
                  onChange={(e) => handleChange('eventCoordinators', e.target.value)} 
                  placeholder="Dr. Vinod VP # 8848118512, Mr. R Pradeep Kumar # 9446472562, Ms. Pavitha P P # 8075376012, Dr. Unnikrishnan S # 9947600545, Ms. Cinaya Tony # 9846836065"
                />
                <p className="form-hint" style={{ marginTop: '5px' }}>
                  Each coordinator is presented in a card with automatic name formatting and instant <strong>Call</strong> & <strong>WhatsApp</strong> buttons.
                </p>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="contactDeskTitle">Event Desk Title</label>
                <input 
                  id="contactDeskTitle"
                  type="text" 
                  className="form-input" 
                  value={formData?.contactDeskTitle || ''} 
                  onChange={(e) => handleChange('contactDeskTitle', e.target.value)} 
                  placeholder="Official Event Desk"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contactCampusTitle">Campus Column Title</label>
                <input 
                  id="contactCampusTitle"
                  type="text" 
                  className="form-input" 
                  value={formData?.contactCampusTitle || ''} 
                  onChange={(e) => handleChange('contactCampusTitle', e.target.value)} 
                  placeholder="Institution Campus"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contactDeskDesc">Desk Explanatory Text</label>
              <input 
                id="contactDeskDesc"
                type="text" 
                className="form-input" 
                value={formData?.contactDeskDesc || ''} 
                onChange={(e) => handleChange('contactDeskDesc', e.target.value)} 
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="contactEmail">Official Contact Email</label>
                <input 
                  id="contactEmail"
                  type="email" 
                  className="form-input" 
                  value={formData?.contactEmail || ''} 
                  onChange={(e) => handleChange('contactEmail', e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contactPhone">
                  Phone / WhatsApp Helpdesk
                  <span className="form-hint">(Optional — leave blank if unconfirmed)</span>
                </label>
                <input 
                  id="contactPhone"
                  type="tel" 
                  className="form-input" 
                  value={formData?.contactPhone || ''} 
                  onChange={(e) => handleChange('contactPhone', e.target.value)} 
                  placeholder="+91..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contactAccreditations">Campus Accreditations & Honors</label>
              <input 
                id="contactAccreditations"
                type="text" 
                className="form-input" 
                value={formData?.contactAccreditations || ''} 
                onChange={(e) => handleChange('contactAccreditations', e.target.value)} 
                placeholder="NAAC 'A' Grade Accredited • NBA Accredited Programmes • Autonomous Institution"
              />
            </div>

            <div className="form-grid-3" style={{ marginTop: '0.5rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="instagram">Instagram URL</label>
                <input 
                  id="instagram"
                  type="url" 
                  className="form-input" 
                  value={formData?.socialLinks?.instagram || ''} 
                  onChange={(e) => handleNestedChange('socialLinks', 'instagram', e.target.value)} 
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="linkedin">LinkedIn URL</label>
                <input 
                  id="linkedin"
                  type="url" 
                  className="form-input" 
                  value={formData?.socialLinks?.linkedin || ''} 
                  onChange={(e) => handleNestedChange('socialLinks', 'linkedin', e.target.value)} 
                  placeholder="https://linkedin.com/..."
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="youtube">YouTube Channel</label>
                <input 
                  id="youtube"
                  type="url" 
                  className="form-input" 
                  value={formData?.socialLinks?.youtube || ''} 
                  onChange={(e) => handleNestedChange('socialLinks', 'youtube', e.target.value)} 
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>
          {renderSectionSaveBar('Contact Desk & Official Channels')}
        </div>
      )}

      {/* =========================================================================
          SECTION 8: FOOTER & COPYRIGHT
          ========================================================================= */}
      {shouldShowSection('footer') && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="stat-card-icon navy" style={{ width: 38, height: 38 }}>
                <Sliders size={18} />
              </div>
              <div>
                <h3>8. Footer & Legal Copyright</h3>
                <p>Website footer copyright text and attribution</p>
              </div>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="form-group">
              <label className="form-label" htmlFor="footerText">Footer Copyright Notice</label>
              <input 
                id="footerText"
                type="text" 
                className="form-input" 
                value={formData?.footerText || ''} 
                onChange={(e) => handleChange('footerText', e.target.value)} 
              />
            </div>
          </div>
          {renderSectionSaveBar('Footer & Legal Copyright')}
        </div>
      )}

      {/* =========================================================================
          SECTION 9: SECTION VISIBILITY MASTER SWITCHES
          ========================================================================= */}
      {shouldShowSection('visibility') && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="stat-card-icon blue" style={{ width: 38, height: 38 }}>
                <Eye size={18} />
              </div>
              <div>
                <h3>9. Section Visibility Master Switches</h3>
                <p>Instantly show or hide any public section on the live landing page</p>
              </div>
            </div>
          </div>
          <div className="admin-card-body">
            {[
              { id: 'hero', label: 'Hero Section', desc: 'Main headline, tagline, and awareness message' },
              { id: 'about', label: 'About Section', desc: 'College background and Operation Toofan details' },
              { id: 'competitions', label: 'Competitions Section', desc: '5 track competition cards and rules modal' },
              { id: 'competitionRules', label: 'Competition Rules (Chalkboard)', desc: 'Classroom chalkboard rules strip placed above competition cards' },
              { id: 'prizes', label: 'Prize Pool Section', desc: 'Prizes over 1 Lakh banner' },
              { id: 'inauguration', label: 'Inauguration Section', desc: 'Chief Guest details and address' },
              { id: 'eventInfo', label: 'Venue & Schedule Section', desc: 'Campus location, directions, and time' },
              { id: 'announcements', label: 'Announcements Section', desc: 'Live alerts and notices' },
              { id: 'contact', label: 'Contact Section', desc: 'Email, helpdesk, and campus address' }
            ].map(sec => (
              <div key={sec.id} className="toggle-switch-row">
                <div className="toggle-switch-label">
                  <span className="toggle-switch-title">{sec.label}</span>
                  <span className="toggle-switch-desc">{sec.desc}</span>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={formData?.sectionVisibility?.[sec.id] !== false}
                    onChange={() => handleToggleSection(sec.id)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>
          {renderSectionSaveBar('Section Visibility Master Switches')}
        </div>
      )}

      {/* Global Bottom Save Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
        <button 
          type="button" 
          className="btn btn-primary btn-lg"
          onClick={handleSubmit}
          disabled={saving || !isDirty}
        >
          <Save size={18} />
          {saving ? 'Publishing Updates...' : 'Save & Publish All Sections'}
        </button>
      </div>
    </div>
  );
}
