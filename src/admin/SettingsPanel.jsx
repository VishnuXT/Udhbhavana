import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Lock, 
  AlertCircle,
  CheckCircle 
} from 'lucide-react';
import { isFirebaseConfigured } from '../services/firebase';

export function SettingsPanel({ siteConfig, onUpdateConfig }) {
  const [published, setPublished] = useState(siteConfig?.published !== false);
  const [registrationOpen, setRegistrationOpen] = useState(siteConfig?.registrationOpen !== false);
  const [showRegisterButton, setShowRegisterButton] = useState(siteConfig?.showRegisterButton !== false);
  const [closedMessage, setClosedMessage] = useState(
    siteConfig?.registrationClosedMessage || 'Registrations for Udhbhavana 2026 are now closed. Thank you for the overwhelming response!'
  );
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (siteConfig) {
      setPublished(siteConfig.published !== false);
      setRegistrationOpen(siteConfig.registrationOpen !== false);
      setShowRegisterButton(siteConfig.showRegisterButton !== false);
      if (siteConfig.registrationClosedMessage) {
        setClosedMessage(siteConfig.registrationClosedMessage);
      }
    }
  }, [siteConfig]);

  const handleTogglePublish = async (val) => {
    setPublished(val);
    setSaving(true);
    setStatusMessage(null);

    const result = await onUpdateConfig({ published: val });
    setSaving(false);

    if (result?.success) {
      setStatusMessage({
        type: 'success',
        text: val 
          ? 'Website is now LIVE and accessible to the public.' 
          : 'Website set to MAINTENANCE MODE. Public visitors will see the maintenance screen while admin access remains active.'
      });
    } else {
      setStatusMessage({ type: 'error', text: result?.error || 'Failed to update publishing state.' });
    }
  };

  const handleToggleRegistration = async (val) => {
    setRegistrationOpen(val);
    setSaving(true);
    setStatusMessage(null);

    const result = await onUpdateConfig({ registrationOpen: val });
    setSaving(false);

    if (result?.success) {
      setStatusMessage({
        type: 'success',
        text: val 
          ? 'Registrations are now OPEN and active across the website.' 
          : 'Registrations are now CLOSED. Forms are locked and closed notice is active.'
      });
    } else {
      setStatusMessage({ type: 'error', text: result?.error || 'Failed to update registration status.' });
    }
  };

  const handleToggleButtons = async (val) => {
    setShowRegisterButton(val);
    setSaving(true);
    setStatusMessage(null);

    const result = await onUpdateConfig({ showRegisterButton: val });
    setSaving(false);

    if (result?.success) {
      setStatusMessage({
        type: 'success',
        text: val 
          ? 'Registration buttons are now VISIBLE on Navbar, Hero, and Competitions banner.' 
          : 'Registration buttons have been REMOVED from Navbar, Hero, and Competitions banner.'
      });
    } else {
      setStatusMessage({ type: 'error', text: result?.error || 'Failed to update button visibility.' });
    }
  };

  const handleSaveClosedMessage = async () => {
    setSaving(true);
    setStatusMessage(null);

    const result = await onUpdateConfig({ registrationClosedMessage: closedMessage });
    setSaving(false);

    if (result?.success) {
      setStatusMessage({
        type: 'success',
        text: 'Registration closed message saved successfully.'
      });
    } else {
      setStatusMessage({ type: 'error', text: result?.error || 'Failed to save message.' });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#142A55' }}>Publishing & System Controls</h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          Global website availability toggles, registration status, button visibility, and security diagnostics.
        </p>
      </div>

      {statusMessage && (
        <div className={`alert-banner ${statusMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Registration & Button Controls */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Registration Status & Button Controls</h3>
            <p>Instantly close registrations or remove registration buttons across the website</p>
          </div>
        </div>
        <div className="admin-card-body">
          {/* Toggle 1: Registration Status */}
          <div className="toggle-switch-row" style={{ padding: '1.25rem', borderBottom: '1px solid #E2E8F0', marginBottom: 0 }}>
            <div className="toggle-switch-label">
              <span className="toggle-switch-title" style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  display: 'inline-block', 
                  width: '9px', 
                  height: '9px', 
                  borderRadius: '50%', 
                  backgroundColor: registrationOpen ? '#24A36B' : '#E11D48',
                  boxShadow: registrationOpen ? '0 0 8px #24A36B' : '0 0 8px #E11D48' 
                }} />
                {registrationOpen ? 'Registrations are OPEN (Active)' : 'Registrations are CLOSED'}
              </span>
              <span className="toggle-switch-desc" style={{ maxWidth: '640px' }}>
                {registrationOpen
                  ? 'Registration is currently open and accepting participants. Links are active across the website.'
                  : 'Registrations are closed. Forms are deactivated and public visitors are informed that registration has ended.'}
              </span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={registrationOpen} 
                onChange={(e) => handleToggleRegistration(e.target.checked)}
                disabled={saving}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Toggle 2: Button Visibility */}
          <div className="toggle-switch-row" style={{ padding: '1.25rem', borderBottom: '1px solid #E2E8F0', marginBottom: 0 }}>
            <div className="toggle-switch-label">
              <span className="toggle-switch-title" style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {showRegisterButton ? 'Registration Buttons are VISIBLE' : 'Registration Buttons are REMOVED / HIDDEN'}
              </span>
              <span className="toggle-switch-desc" style={{ maxWidth: '640px' }}>
                {showRegisterButton
                  ? 'The "Register Now" buttons are rendered on the sticky Navbar, Hero section, and Competitions banner.'
                  : 'All "Register Now" and "Register for Competitions" buttons are completely removed from the website interface.'}
              </span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={showRegisterButton} 
                onChange={(e) => handleToggleButtons(e.target.checked)}
                disabled={saving}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Registration Closed Notice Input */}
          <div style={{ padding: '1.25rem' }}>
            <label className="form-label" style={{ fontWeight: 600, color: '#142A55', marginBottom: '0.4rem', display: 'block' }}>
              Registration Closed Message
              <span className="form-hint" style={{ display: 'block', fontWeight: 400, color: '#64748B', fontSize: '0.82rem' }}>
                Message displayed on the Competitions section and splash screen when registrations are closed
              </span>
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <input 
                type="text" 
                className="form-input" 
                value={closedMessage}
                onChange={(e) => setClosedMessage(e.target.value)}
                placeholder="Registrations for Udhbhavana 2026 are now closed. Thank you for the overwhelming response!"
                style={{ flex: 1 }}
              />
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleSaveClosedMessage}
                disabled={saving}
                style={{ whiteSpace: 'nowrap' }}
              >
                Save Notice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Website Publishing Control */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Website Live Status</h3>
            <p>Control whether the event landing page is visible to the general public</p>
          </div>
        </div>
        <div className="admin-card-body">
          <div className="toggle-switch-row" style={{ padding: '1.25rem' }}>
            <div className="toggle-switch-label">
              <span className="toggle-switch-title" style={{ fontSize: '1.05rem' }}>
                {published ? 'Website is Publicly Published (Online)' : 'Maintenance / Offline Mode'}
              </span>
              <span className="toggle-switch-desc" style={{ maxWidth: '640px' }}>
                {published
                  ? 'The public can browse competitions, view schedules, and register. Switch off to temporarily lock the public portal during urgent updates.'
                  : 'Public visitors currently see a polite maintenance notice. You retain full access to manage content here in the admin module.'}
              </span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={published} 
                onChange={(e) => handleTogglePublish(e.target.checked)}
                disabled={saving}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Database & Cloud Connection Diagnostics */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Backend Infrastructure & Security</h3>
            <p>Connection parameters and authorization status</p>
          </div>
        </div>
        <div className="admin-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#142A55', marginBottom: '0.35rem' }}>
                <Database size={16} color="#2878D0" />
                <span>Firestore & Storage Status</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                {isFirebaseConfigured 
                  ? 'Connected to live Firebase Cloud project.' 
                  : 'Interactive local state active. Syncs instantly across tabs.'}
              </p>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#142A55', marginBottom: '0.35rem' }}>
                <Lock size={16} color="#24A36B" />
                <span>Security Rules Enforced</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Read-only public permissions for published content. Writes strictly restricted to authenticated administrators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
