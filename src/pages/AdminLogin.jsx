import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isFirebaseConfigured } from '../services/firebase';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Info } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    const { user, error } = await login(email.trim(), password);
    setSubmitting(false);

    if (error) {
      setErrorMessage(error);
    } else if (user) {
      navigate(from, { replace: true });
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@udhbhavana.edu');
    setPassword('Admin@2027');
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <img 
            src="/logo.png" 
            alt="Udhbhavana 2026 Logo" 
            className="admin-login-logo" 
          />
          <h2>Administrator Portal</h2>
          <p>Sign in to manage event schedules, content & competitions</p>
        </div>

        {errorMessage && (
          <div className="alert-banner alert-error" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                id="admin-email"
                type="email" 
                className="form-input" 
                placeholder="admin@udhbhavana.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '0.85rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#94A3B8'
                }} 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="admin-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                id="admin-password"
                type="password" 
                className="form-input" 
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '0.85rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#94A3B8'
                }} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={submitting}
          >
            {submitting ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
            <ArrowRight size={18} />
          </button>
        </form>

        {!isFirebaseConfigured && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#F8FAFC',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            fontSize: '0.825rem',
            color: '#475569'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#142A55', marginBottom: '0.35rem' }}>
              <Info size={16} color="#2878D0" />
              <span>Development / Offline Mode</span>
            </div>
            <p style={{ marginBottom: '0.5rem' }}>
              Firebase credentials are not configured yet. You can sign in with the built-in local admin account:
            </p>
            <button 
              type="button" 
              onClick={handleFillDemo}
              style={{
                background: '#EBF3FC',
                color: '#2878D0',
                padding: '0.35rem 0.65rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-block',
                cursor: 'pointer'
              }}
            >
              Fill Demo Credentials (admin@udhbhavana.edu / Admin@2027)
            </button>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <a href="/" style={{ fontSize: '0.85rem', color: '#64748B' }}>
            ← Return to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
