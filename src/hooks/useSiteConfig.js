import { useState, useEffect, useCallback } from 'react';
import { siteConfigService } from '../services/siteConfigService';
import { initialSiteConfig } from '../services/initialData';

export function useSiteConfig() {
  const [siteConfig, setSiteConfig] = useState(initialSiteConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    const { data, error } = await siteConfigService.getSiteConfig();
    if (data) {
      setSiteConfig(data);
    }
    if (error) {
      setError(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchConfig();
    const unsubscribe = siteConfigService.subscribe((updated) => {
      if (updated) {
        setSiteConfig(updated);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [fetchConfig]);

  const updateConfig = async (newConfig, userEmail) => {
    const result = await siteConfigService.updateSiteConfig(newConfig, userEmail);
    if (result.success) {
      setSiteConfig(newConfig);
    }
    return result;
  };

  return {
    siteConfig,
    loading,
    error,
    updateConfig,
    reload: fetchConfig
  };
}
