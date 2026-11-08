import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import '../styles/splash.css';

export function SplashScreen({ 
  siteConfig, 
  isLoading = false, 
  onFinish,
  minDuration = 1800 
}) {
  const [progress, setProgress] = useState(15);
  const [isExiting, setIsExiting] = useState(false);
  const [statusText, setStatusText] = useState('Initializing Symposium...');

  // Use the canonical 2026 logo and text consistently so there is zero mid-animation swap
  const logoUrl = '/logo.png';
  const tagline = siteConfig?.tagline || 'Aim IT.. Win IT';
  const awareness = siteConfig?.awarenessMessage || 'Say No to Drugs.. Say Yes to Life..!';
  const institution = siteConfig?.institutionName ? 'SBCE Autonomous' : 'Sree Buddha College of Engineering';
  const association = siteConfig?.associationName || 'Operation Toofan';

  useEffect(() => {
    const startTime = Date.now();

    // Progress interval
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 45) {
          setStatusText('Initializing Symposium...');
          return prev + 12;
        }
        if (prev < 80) {
          setStatusText('Connecting Event Tracks...');
          return prev + 9;
        }
        if (prev < 95) {
          setStatusText('Preparing Experience...');
          return prev + 4;
        }
        return prev;
      });
    }, 120);

    // Watch for when both minimum time and data loading have elapsed
    const checkCompletion = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= minDuration && !isLoading) {
        clearInterval(interval);
        clearInterval(checkCompletion);
        setProgress(100);
        setStatusText('Welcome to Udhbhavana 2026');

        // Allow 250ms at 100% before triggering exit transition
        setTimeout(() => {
          setIsExiting(true);
          // Wait for exit CSS transition (550ms) to complete before unmounting
          setTimeout(() => {
            if (typeof onFinish === 'function') {
              onFinish();
            }
          }, 550);
        }, 250);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(checkCompletion);
    };
  }, [isLoading, minDuration, onFinish]);

  // Handle immediate skip on click/tap
  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (typeof onFinish === 'function') {
        onFinish();
      }
    }, 400);
  };

  return (
    <div 
      className={`splash-overlay ${isExiting ? 'splash-exit' : ''}`}
      onClick={handleSkip}
      title="Click anywhere to enter"
      role="region"
      aria-label="Loading Screen"
    >
      {/* Dynamic ambient glow orbs */}
      <div className="splash-bg-glow splash-glow-1" />
      <div className="splash-bg-glow splash-glow-2" />
      <div className="splash-bg-glow splash-glow-center" />
      <div className="splash-grid-mesh" />

      {/* Main Content Area */}
      <div className="splash-content">
        {/* Top Institution & Partner badge */}
        <div className="splash-institution-badge">
          <span>{institution}</span>
          <span className="splash-institution-dot" />
          <span>{association}</span>
        </div>

        {/* Central Logo with aura */}
        <div className="splash-logo-wrap">
          <div className="splash-logo-halo" />
          <img 
            src={logoUrl} 
            alt="Udhbhavana 2026" 
            className="splash-logo-img"
            fetchPriority="high"
          />
        </div>

        {/* Tagline */}
        <h2 className="splash-tagline">{tagline}</h2>

        {/* Social Awareness Message */}
        <div className="splash-awareness-pill">
          <span>🌿</span>
          <span>{awareness}</span>
        </div>

        {/* Striking Registration Deadline / Status Notice */}
        {siteConfig?.showRegisterButton !== false && (
          <div 
            className={`splash-registration-notice ${siteConfig?.registrationOpen === false ? 'is-closed' : 'is-closing-soon'}`} 
            role="status"
          >
            {/* Ambient light sweep */}
            <div className="splash-notice-shimmer" aria-hidden="true" />

            {/* Leading urgent tag with live radar beacon */}
            <div className="splash-notice-tag">
              <span className="splash-radar-beacon" aria-hidden="true">
                <span className="splash-beacon-wave" />
                <span className="splash-beacon-core" />
              </span>
              <span className="splash-tag-text">
                {siteConfig?.registrationOpen === false ? 'CLOSED' : 'CLOSING TODAY'}
              </span>
            </div>

            {/* Message Body with Highlighted Time */}
            <div className="splash-notice-text">
              {siteConfig?.registrationOpen === false ? (
                <span>Registrations are now <strong>CLOSED</strong></span>
              ) : (
                <>
                  <span>Registration closes by</span>
                  <span className="splash-time-badge">
                    <Clock size={12} className="splash-time-icon" aria-hidden="true" />
                    <strong>12.00 PM Today</strong>
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Progress & Status */}
        <div className="splash-loader-wrap">
          <div className="splash-progress-track">
            <div 
              className="splash-progress-bar" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <span className="splash-status-text">{statusText}</span>
        </div>
      </div>
    </div>
  );
}
