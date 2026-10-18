import { useState, useEffect, useCallback } from 'react';
import { competitionService } from '../services/competitionService';

export function useCompetitions(onlyPublished = false) {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompetitions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await competitionService.getCompetitions(onlyPublished);
    if (data) {
      setCompetitions(data);
    }
    if (error) {
      setError(error);
    }
    setLoading(false);
  }, [onlyPublished]);

  useEffect(() => {
    fetchCompetitions();
    const handler = () => fetchCompetitions();
    window.addEventListener('udhbhavana_competitions_change', handler);
    return () => window.removeEventListener('udhbhavana_competitions_change', handler);
  }, [fetchCompetitions]);

  const addCompetition = async (data) => {
    const result = await competitionService.addCompetition(data);
    await fetchCompetitions();
    return result;
  };

  const updateCompetition = async (id, updates) => {
    const result = await competitionService.updateCompetition(id, updates);
    await fetchCompetitions();
    return result;
  };

  const deleteCompetition = async (id) => {
    // Optimistically remove from state for instant UI responsiveness
    setCompetitions((prev) => prev.filter((c) => c.id !== id));
    const result = await competitionService.deleteCompetition(id);
    await fetchCompetitions();
    return result;
  };

  const reorderCompetitions = async (newOrder) => {
    setCompetitions(newOrder);
    return await competitionService.reorderCompetitions(newOrder);
  };

  const removeDuplicates = async () => {
    setLoading(true);
    const result = await competitionService.removeDuplicateCompetitions();
    await fetchCompetitions();
    setLoading(false);
    return result;
  };

  return {
    competitions,
    loading,
    error,
    addCompetition,
    updateCompetition,
    deleteCompetition,
    reorderCompetitions,
    removeDuplicates,
    reload: fetchCompetitions
  };
}
