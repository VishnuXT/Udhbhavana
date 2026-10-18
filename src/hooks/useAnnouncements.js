import { useState, useEffect, useCallback } from 'react';
import { announcementService } from '../services/announcementService';

export function useAnnouncements(onlyActivePublished = false) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    const { data, error } = await announcementService.getAnnouncements(onlyActivePublished);
    if (data) {
      setAnnouncements(data);
    }
    if (error) {
      setError(error);
    }
    setLoading(false);
  }, [onlyActivePublished]);

  useEffect(() => {
    fetchAnnouncements();
    const handler = () => fetchAnnouncements();
    window.addEventListener('udhbhavana_announcements_change', handler);
    return () => window.removeEventListener('udhbhavana_announcements_change', handler);
  }, [fetchAnnouncements]);

  const addAnnouncement = async (data) => {
    const result = await announcementService.addAnnouncement(data);
    if (result.data) {
      await fetchAnnouncements();
    }
    return result;
  };

  const updateAnnouncement = async (id, updates) => {
    const result = await announcementService.updateAnnouncement(id, updates);
    if (result.success) {
      await fetchAnnouncements();
    }
    return result;
  };

  const deleteAnnouncement = async (id) => {
    const result = await announcementService.deleteAnnouncement(id);
    if (result.success) {
      await fetchAnnouncements();
    }
    return result;
  };

  return {
    announcements,
    loading,
    error,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    reload: fetchAnnouncements
  };
}
