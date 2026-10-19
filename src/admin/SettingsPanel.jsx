import React, { useState } from 'react';
import { 
  Database, 
  Lock, 
  AlertCircle,
  CheckCircle 
} from 'lucide-react';
import { isFirebaseConfigured } from '../services/firebase';

export function SettingsPanel({ siteConfig, onUpdateConfig }) {
  const [published, setPublished] = useState(siteConfig?.published !== false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

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

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#142A55' }}>Publishing & System Controls</h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          Global website availability toggles, security diagnostics, and database sync status.
        </p>
      </div>

      {statusMessage && (
        <div className={`alert-banner ${statusMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

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
