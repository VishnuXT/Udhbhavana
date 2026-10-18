import React, { useState } from 'react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { useCompetitions } from '../hooks/useCompetitions';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { useAuth } from '../hooks/useAuth';
import { AdminLayout } from '../admin/AdminLayout';
import { OverviewPanel } from '../admin/OverviewPanel';
import { WebsiteContentEditor } from '../admin/WebsiteContentEditor';
import { CompetitionManager } from '../admin/CompetitionManager';
import { AnnouncementManager } from '../admin/AnnouncementManager';
import { MediaManager } from '../admin/MediaManager';
import { SettingsPanel } from '../admin/SettingsPanel';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { siteConfig, updateConfig } = useSiteConfig();
  const { 
    competitions, 
    addCompetition, 
    updateCompetition, 
    deleteCompetition, 
    reorderCompetitions,
    removeDuplicates 
  } = useCompetitions(false);

  const { 
    announcements, 
    addAnnouncement, 
    updateAnnouncement, 
    deleteAnnouncement 
  } = useAnnouncements(false);

  const handleSaveConfig = async (newConfig) => {
    return await updateConfig(newConfig, user?.email || 'admin');
  };

  const handleUpdatePartialConfig = async (partial) => {
    const merged = { ...siteConfig, ...partial };
    return await updateConfig(merged, user?.email || 'admin');
  };

  return (
    <AdminLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      siteConfig={siteConfig}
    >
      {activeTab === 'overview' && (
        <OverviewPanel 
          siteConfig={siteConfig} 
          competitions={competitions} 
          announcements={announcements} 
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === 'content' && (
        <WebsiteContentEditor 
          siteConfig={siteConfig} 
          onSave={handleSaveConfig} 
          onNavigateTab={setActiveTab}
        />
      )}

      {activeTab === 'competitions' && (
        <CompetitionManager 
          competitions={competitions}
          onAdd={addCompetition}
          onUpdate={updateCompetition}
          onDelete={deleteCompetition}
          onReorder={reorderCompetitions}
          onRemoveDuplicates={removeDuplicates}
        />
      )}

      {activeTab === 'announcements' && (
        <AnnouncementManager 
          announcements={announcements}
          onAdd={addAnnouncement}
          onUpdate={updateAnnouncement}
          onDelete={deleteAnnouncement}
        />
      )}

      {activeTab === 'media' && (
        <MediaManager 
          siteConfig={siteConfig}
          onUpdateConfig={handleUpdatePartialConfig}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsPanel 
          siteConfig={siteConfig}
          onUpdateConfig={handleUpdatePartialConfig}
        />
      )}
    </AdminLayout>
  );
}
