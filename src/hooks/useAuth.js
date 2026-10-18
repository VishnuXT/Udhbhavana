import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const result = await authService.login(email, password);
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    await authService.logout();
    setUser(null);
    setLoading(false);
  };

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout
  };
}
