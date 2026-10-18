import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Trophy, 
  Bell, 
  Image as ImageIcon, 
  Sliders, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  ShieldCheck,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function AdminLayout({ activeTab, setActiveTab, siteConfig, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'content', label: 'Website Content', icon: <FileText size={18} /> },
    { id: 'competitions', label: 'Competitions', icon: <Trophy size={18} /> },
    { id: 'announcements', label: 'Announcements', icon: <Bell size={18} /> },
    { id: 'media', label: 'Media & Posters', icon: <ImageIcon size={18} /> },
    { id: 'settings', label: 'Publishing Controls', icon: <Sliders size={18} /> }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const isPublished = siteConfig?.published !== false;

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <div className="admin-brand-icon">
              <ShieldCheck size={20} />
            </div>
            <div className="admin-brand-text">
              <h2>Udhbhavana</h2>
              <span>Admin CMS</span>
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={() => setSidebarOpen(false)}
            style={{ display: sidebarOpen ? 'block' : 'none', color: '#FFFFFF' }}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="admin-user-details">
              <span className="admin-user-email">{user?.email || 'admin@sbce.ac.in'}</span>
              <span className="admin-user-role">Authorized Admin</span>
            </div>
          </div>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={logout}
            style={{ width: '100%', justifyContent: 'flex-start', color: '#EF4444' }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button 
              type="button" 
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation drawer"
            >
              <Menu size={22} />
            </button>
            <span className="admin-topbar-title">
              {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
            </span>
          </div>

          <div className="admin-topbar-actions">
            <span className={`badge ${isPublished ? 'badge-green' : 'badge-yellow'}`}>
              {isPublished ? (
                <>
                  <CheckCircle size={12} />
                  <span>Website Live</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={12} />
                  <span>Maintenance Mode</span>
                </>
              )}
            </span>

            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-outline btn-sm"
              title="Open public website in a new tab"
            >
              <span>Public Preview</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </header>

        {/* Panel Body */}
        <div className="admin-content-container">
          {children}
        </div>
      </div>
    </div>
  );
}
