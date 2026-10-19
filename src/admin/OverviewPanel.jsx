import React from 'react';
import { 
  Trophy, 
  FileText, 
  Bell, 
  Globe, 
  Image as ImageIcon, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { isFirebaseConfigured } from '../services/firebase';

export function OverviewPanel({ siteConfig, competitions = [], announcements = [], setActiveTab }) {
  const publishedCompetitions = competitions.filter(c => c.published).length;
  const publishedAnnouncements = announcements.filter(a => a.published).length;
  const isPublished = siteConfig?.published !== false;

  return (
    <div>
      {/* Configuration Status Notice */}
      <div className={`alert-banner ${isFirebaseConfigured ? 'alert-success' : 'alert-info'}`}>
        {isFirebaseConfigured ? (
          <>
            <CheckCircle size={18} />
            <span>Connected to Cloud Firestore & Firebase Auth. Changes will synchronize in real-time.</span>
          </>
        ) : (
          <>
            <AlertCircle size={18} />
            <span>
              Running with <strong>Local Reactive Persistence</strong>. Changes are saved immediately in your browser. To link your live Firebase cloud instance, add your project credentials to the <code>.env</code> file.
            </span>
          </>
        )}
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <span>Published Competitions</span>
            <h3>{publishedCompetitions}</h3>
          </div>
          <div className="stat-icon icon-green">
            <Trophy size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span>Total Competitions</span>
            <h3>{competitions.length}</h3>
          </div>
          <div className="stat-icon">
            <Trophy size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span>Active Announcements</span>
            <h3>{publishedAnnouncements}</h3>
          </div>
          <div className="stat-icon icon-yellow">
            <Bell size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span>Website Status</span>
            <h3 style={{ fontSize: '1.25rem', color: isPublished ? '#24A36B' : '#E11D48' }}>
              {isPublished ? 'Live & Public' : 'Maintenance'}
            </h3>
          </div>
          <div className="stat-icon icon-green">
            <Globe size={24} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3>Quick Administrative Actions</h3>
        <div className="quick-actions-grid">
          <button 
            type="button" 
            className="quick-action-btn"
            onClick={() => setActiveTab('content')}
          >
            <FileText size={28} />
            <span>Edit Event Details</span>
          </button>

          <button 
            type="button" 
            className="quick-action-btn"
            onClick={() => setActiveTab('competitions')}
          >
            <Trophy size={28} />
            <span>Manage Competitions</span>
          </button>

          <button 
            type="button" 
            className="quick-action-btn"
            onClick={() => setActiveTab('announcements')}
          >
            <Bell size={28} />
            <span>Post Announcements</span>
          </button>

          <button 
            type="button" 
            className="quick-action-btn"
            onClick={() => setActiveTab('media')}
          >
            <ImageIcon size={28} />
            <span>Update Logo & Poster</span>
          </button>
        </div>
      </div>

      {/* Snapshot Information */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Current Event Identity</h3>
            <p>High-level event parameters currently deployed on the landing page</p>
          </div>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('content')}
          >
            Edit Values
          </button>
        </div>
        <div className="admin-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 600 }}>Event Title</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#142A55' }}>{siteConfig?.eventName}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 600 }}>Tagline & Awareness</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1F2937' }}>
                {siteConfig?.tagline} • {siteConfig?.awarenessMessage}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 600 }}>Date & Venue</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1F2937' }}>
                {siteConfig?.eventDate} • {siteConfig?.venue}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 600 }}>Prize Pool</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#B47805' }}>{siteConfig?.prizePoolText}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
