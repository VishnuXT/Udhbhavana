import React from 'react';
import { Bell, Info, FileText, ArrowUpRight } from 'lucide-react';

export function AnnouncementSection({ announcements = [], siteConfig }) {
  if (siteConfig?.sectionVisibility?.announcements === false) return null;

  // Filter out unpublished or expired items
  const today = new Date().toISOString().split('T')[0];
  const activeList = announcements.filter((item) => {
    if (!item.published) return false;
    if (item.expiresAt && item.expiresAt < today) return false;
    return true;
  });

  return (
    <section id="announcements" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag tag-yellow">
            <Bell size={14} />
            Live Updates
          </span>
          <h2 className="section-title">Latest Announcements</h2>
          <p className="section-subtitle">
            Stay tuned for schedule revisions, registration opening notices, and organizer updates.
          </p>
        </div>

        {activeList.length === 0 ? (
          <div className="empty-state">
            <Info size={32} className="empty-state-icon" />
            <p className="empty-state-text">No active announcements at the moment. Please check back soon!</p>
          </div>
        ) : (
          <div className="announcements-list">
            {activeList.map((ann) => (
              <div key={ann.id} className="announcement-card">
                <Bell size={20} className="announcement-icon" />
                <div className="announcement-content">
                  <h3 className="announcement-title">{ann.title}</h3>
                  <p className="announcement-msg">{ann.message}</p>
                  {ann.pdfUrl && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <a 
                        href={ann.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                      >
                        <FileText size={14} />
                        <span>View Document (PDF)</span>
                        <ArrowUpRight size={13} />
                      </a>
                    </div>
                  )}
                  {ann.imageUrl && (
                    <div style={{ marginTop: '0.75rem', maxWidth: '300px' }}>
                      <img 
                        src={ann.imageUrl} 
                        alt={ann.title} 
                        style={{ borderRadius: '6px', border: '1px solid #E5EAF2' }} 
                      />
                    </div>
                  )}
                  {ann.publishedAt && (
                    <div className="announcement-meta">
                      <span>Posted on: {ann.publishedAt}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
