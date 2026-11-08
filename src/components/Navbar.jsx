import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Bus } from 'lucide-react';

export function Navbar({ siteConfig }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const isHome = location.pathname === '/';
  const isBusPage = location.pathname.startsWith('/bus-routes');

  useEffect(() => {
    if (!isHome) return;

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
  }, [isHome]);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);

    if (!isHome) {
      navigate(`/#${id}`);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const offsetPosition = elementRect - bodyRect - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 150);
      return;
    }

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

  const isRegistrationOpen = siteConfig?.registrationOpen !== false;
  const showRegisterBtn = siteConfig?.showRegisterButton !== false;
  const hasRegisterUrl = Boolean(siteConfig?.registrationUrl && siteConfig.registrationUrl.trim() !== '');
  const canShowRegister = hasRegisterUrl && showRegisterBtn && isRegistrationOpen;

  return (
    <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Brand */}
        <Link 
          to="/" 
          className="navbar-brand"
          onClick={(e) => { 
            if (isHome) {
              e.preventDefault(); 
              scrollTo('hero'); 
            }
          }}
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
        </Link>

        {/* Desktop Links */}
        <nav className="navbar-links" aria-label="Main Navigation">
          <button 
            type="button" 
            className={`nav-link ${isHome && activeSection === 'hero' ? 'active' : ''}`}
            onClick={() => scrollTo('hero')}
          >
            Home
          </button>
          {siteConfig?.sectionVisibility?.about !== false && (
            <button 
              type="button" 
              className={`nav-link ${isHome && activeSection === 'about' ? 'active' : ''}`}
              onClick={() => scrollTo('about')}
            >
              About
            </button>
          )}
          {siteConfig?.sectionVisibility?.competitions !== false && (
            <button 
              type="button" 
              className={`nav-link ${isHome && activeSection === 'competitions' ? 'active' : ''}`}
              onClick={() => scrollTo('competitions')}
            >
              Competitions
            </button>
          )}
          {siteConfig?.sectionVisibility?.prizes !== false && (
            <button 
              type="button" 
              className={`nav-link ${isHome && activeSection === 'prizes' ? 'active' : ''}`}
              onClick={() => scrollTo('prizes')}
            >
              Prizes
            </button>
          )}
          {siteConfig?.sectionVisibility?.eventInfo !== false && (
            <button 
              type="button" 
              className={`nav-link ${isHome && activeSection === 'venue' ? 'active' : ''}`}
              onClick={() => scrollTo('venue')}
            >
              Venue
            </button>
          )}

          {/* Dedicated Bus Routes Link */}
          <Link 
            to="/bus-routes" 
            className={`nav-link ${isBusPage ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Bus size={15} style={{ color: isBusPage ? 'var(--color-action-blue)' : 'inherit' }} />
            <span>Bus Routes</span>
          </Link>

          {siteConfig?.sectionVisibility?.contact !== false && (
            <button 
              type="button" 
              className={`nav-link ${isHome && activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => scrollTo('contact')}
            >
              Contact
            </button>
          )}
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Mobile Quick Bus Navigation Button */}
          <Link 
            to="/bus-routes" 
            className={`navbar-mobile-bus-btn ${isBusPage ? 'active' : ''}`}
            title="Bus Routes & Timings"
            aria-label="View Bus Routes"
          >
            <Bus size={18} />
          </Link>

          {canShowRegister && (
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

          {/* Dedicated Bus Routes Mobile Link */}
          <Link 
            to="/bus-routes" 
            className={`mobile-nav-link mobile-nav-bus-link ${isBusPage ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Bus size={18} className="mobile-nav-bus-icon" />
            <span>Bus Routes</span>
          </Link>

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
            {canShowRegister && (
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
