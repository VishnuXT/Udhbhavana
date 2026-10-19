import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export function Navbar({ siteConfig }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['hero', 'about', 'competitions', 'prizes', 'venue', 'contact'];
      const scrollPos = window.scrollY + 100;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const hasRegisterUrl = Boolean(siteConfig?.registrationUrl && siteConfig.registrationUrl.trim() !== '');

  return (
    <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Brand */}
        <a 
          href="#hero" 
          className="navbar-brand"
          onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}
          aria-label={`${siteConfig?.eventName || 'Udhbhavana 2026'} Home`}
        >
          <img 
            src={siteConfig?.logoUrl || '/logo.png'} 
            alt="Udhbhavana Logo" 
            className="navbar-logo" 
            fetchPriority="high"
            loading="eager"
          />
          <div className="navbar-brand-text">
            <span className="navbar-brand-title">{siteConfig?.eventName || 'Udhbhavana 2026'}</span>
            <span className="navbar-brand-sub">SBCE × Toofan</span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="navbar-links" aria-label="Main Navigation">
          <button 
            type="button" 
            className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`}
            onClick={() => scrollTo('hero')}
          >
            Home
          </button>
          {siteConfig?.sectionVisibility?.about !== false && (
            <button 
              type="button" 
              className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
              onClick={() => scrollTo('about')}
            >
              About
            </button>
          )}
          {siteConfig?.sectionVisibility?.competitions !== false && (
            <button 
              type="button" 
              className={`nav-link ${activeSection === 'competitions' ? 'active' : ''}`}
              onClick={() => scrollTo('competitions')}
            >
              Competitions
            </button>
          )}
          {siteConfig?.sectionVisibility?.prizes !== false && (
            <button 
              type="button" 
              className={`nav-link ${activeSection === 'prizes' ? 'active' : ''}`}
              onClick={() => scrollTo('prizes')}
            >
              Prizes
            </button>
          )}
          {siteConfig?.sectionVisibility?.eventInfo !== false && (
            <button 
              type="button" 
              className={`nav-link ${activeSection === 'venue' ? 'active' : ''}`}
              onClick={() => scrollTo('venue')}
            >
              Venue
            </button>
          )}
          {siteConfig?.sectionVisibility?.contact !== false && (
            <button 
              type="button" 
              className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => scrollTo('contact')}
            >
              Contact
            </button>
          )}
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          {hasRegisterUrl && (
            <a 
              href={siteConfig.registrationUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary btn-sm"
            >
              Register Now
              <ArrowUpRight size={15} />
            </a>
          )}
          <button 
            type="button" 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div 
        className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
          <button 
            type="button" 
            className="mobile-nav-link" 
            onClick={() => scrollTo('hero')}
          >
            Home
          </button>
          {siteConfig?.sectionVisibility?.about !== false && (
            <button 
              type="button" 
              className="mobile-nav-link" 
              onClick={() => scrollTo('about')}
            >
              About
            </button>
          )}
          {siteConfig?.sectionVisibility?.competitions !== false && (
            <button 
              type="button" 
              className="mobile-nav-link" 
              onClick={() => scrollTo('competitions')}
            >
              Competitions
            </button>
          )}
          {siteConfig?.sectionVisibility?.prizes !== false && (
            <button 
              type="button" 
              className="mobile-nav-link" 
              onClick={() => scrollTo('prizes')}
            >
              Prizes
            </button>
          )}
          {siteConfig?.sectionVisibility?.eventInfo !== false && (
            <button 
              type="button" 
              className="mobile-nav-link" 
              onClick={() => scrollTo('venue')}
            >
              Venue & Schedule
            </button>
          )}
          {siteConfig?.sectionVisibility?.contact !== false && (
            <button 
              type="button" 
              className="mobile-nav-link" 
              onClick={() => scrollTo('contact')}
            >
              Contact
            </button>
          )}

          <div className="mobile-menu-actions">
            {hasRegisterUrl && (
              <a 
                href={siteConfig.registrationUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register Now
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
