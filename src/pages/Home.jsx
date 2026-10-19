import React, { useEffect, useState } from 'react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { useCompetitions } from '../hooks/useCompetitions';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { SplashScreen } from '../components/SplashScreen';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { CompetitionSection } from '../components/CompetitionSection';
import { PrizeSection } from '../components/PrizeSection';
import { InaugurationSection } from '../components/InaugurationSection';
import { EventInfoSection } from '../components/EventInfoSection';
import { AnnouncementSection } from '../components/AnnouncementSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const { siteConfig, loading: configLoading } = useSiteConfig();
  const { competitions } = useCompetitions(true);
  const { announcements } = useAnnouncements(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (siteConfig?.eventName) {
      document.title = `${siteConfig.eventName} | ${siteConfig.tagline || 'Aim IT.. Win IT'} | ${siteConfig.institutionName || 'Sree Buddha College of Engineering'}`;
    }
  }, [siteConfig]);

  // Site unpublishing / Maintenance mode check (only when not loading)
  if (!configLoading && siteConfig?.published === false) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#F4F7FC',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '520px',
          background: '#FFFFFF',
          padding: '2.5rem',
          borderRadius: '16px',
          border: '1px solid #E5EAF2',
          boxShadow: '0 4px 14px rgba(20, 42, 85, 0.08)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#FEF3C7',
            color: '#B45309',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <AlertTriangle size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#142A55', marginBottom: '0.75rem' }}>
            Portal Under Maintenance
          </h2>
          <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            The official web portal for {siteConfig?.eventName || 'Udhbhavana'} is temporarily offline for scheduled content updates. Please check back shortly!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/admin" className="btn btn-secondary btn-sm">
              <ShieldAlert size={16} />
              <span>Administrator Access</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showSplash && (
        <SplashScreen 
          siteConfig={siteConfig} 
          isLoading={configLoading} 
          onFinish={() => setShowSplash(false)} 
        />
      )}

      <div className="site-wrapper">
        <Navbar siteConfig={siteConfig} />
        <main id="main-content">
          <HeroSection siteConfig={siteConfig} />
          <AboutSection siteConfig={siteConfig} />
          <CompetitionSection competitions={competitions} siteConfig={siteConfig} />
          <PrizeSection siteConfig={siteConfig} />
          <InaugurationSection siteConfig={siteConfig} />
          <EventInfoSection siteConfig={siteConfig} />
          <AnnouncementSection announcements={announcements} siteConfig={siteConfig} />
          <ContactSection siteConfig={siteConfig} />
        </main>
        <Footer siteConfig={siteConfig} />
      </div>
    </>
  );
}
