import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bus, 
  Search, 
  Printer, 
  Navigation, 
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { busRoutes } from '../data/busData';
import '../styles/bus-routes.css';

export function BusRoutes() {
  const { siteConfig } = useSiteConfig();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedBusNo, setSelectedBusNo] = useState('ALL');
  // Default: all cards expanded so user immediately sees the complete schedule report!
  const [openBuses, setOpenBuses] = useState(() => {
    const all = {};
    busRoutes.forEach(b => { all[b.busNo] = true; });
    return all;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `Bus Routes & Timings | Sree Buddha College of Engineering`;
  }, []);

  // Filter routes based on search, district, and specific bus selection
  const filteredRoutes = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    
    return busRoutes.filter(bus => {
      // Specific Bus filter
      if (selectedBusNo !== 'ALL' && bus.busNo.toString() !== selectedBusNo) {
        return false;
      }

      // District filter
      if (selectedDistrict !== 'ALL') {
        if (bus.district.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
      }

      // Query filter
      if (!q) return true;

      const matchBusNo = bus.busNo.toString() === q || `bus ${bus.busNo}`.includes(q);
      const matchRoute = bus.routeName.toLowerCase().includes(q);
      const matchStart = bus.startPoint.toLowerCase().includes(q);
      const matchStop = bus.stops.some(st => st.name.toLowerCase().includes(q));

      return matchBusNo || matchRoute || matchStart || matchStop;
    });
  }, [searchTerm, selectedDistrict, selectedBusNo]);

  // Determine if a card is open:
  // If user searched or filtered by specific bus, always keep it open!
  const isCardOpen = (busNo) => {
    if (searchTerm.trim().length > 0) return true;
    if (selectedBusNo !== 'ALL') return true;
    return Boolean(openBuses[busNo]);
  };

  const toggleCard = (busNo) => {
    setOpenBuses(prev => ({
      ...prev,
      [busNo]: !prev[busNo]
    }));
  };

  const expandAll = () => {
    const all = {};
    busRoutes.forEach(b => { all[b.busNo] = true; });
    setOpenBuses(all);
  };

  const collapseAll = () => {
    setOpenBuses({});
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('ALL');
    setSelectedBusNo('ALL');
  };

  return (
    <div className="bus-page-wrapper">
      <Navbar siteConfig={siteConfig} />

      {/* Clean Minimal Header */}
      <header className="bus-simple-header">
        <div className="container">
          <div className="bus-page-title-row">
            <div>
              <h1 className="bus-page-title">College Bus Routes & Timings</h1>
              <p className="bus-page-subtitle">
                Official morning pickup schedule for all 23 buses to Sree Buddha College of Engineering, Pattoor.
              </p>
            </div>

            <div className="bus-header-actions">
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={() => window.print()}
                title="Print bus schedule"
              >
                <Printer size={15} />
                <span>Print Schedule</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container" style={{ paddingBottom: '3rem' }}>
        {/* Simple Search & Filter Bar */}
        <section className="bus-filter-bar" aria-label="Search and filter bus routes">
          {/* Search Input */}
          <div className="bus-search-box">
            <Search size={18} className="bus-search-icon" />
            <input 
              type="text"
              className="bus-search-input"
              placeholder="Search stop, town, or bus number (e.g. Kayamkulam, Adoor)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search bus stops and routes"
            />
            {searchTerm && (
              <button 
                type="button" 
                className="bus-search-clear"
                onClick={() => setSearchTerm('')}
                title="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* District & Bus Selectors */}
          <div className="bus-selector-row">
            <div className="bus-quick-districts-wrap">
              <button 
                type="button"
                className={`bus-pill-btn ${selectedDistrict === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedDistrict('ALL')}
              >
                All (23)
              </button>
              <button 
                type="button"
                className={`bus-pill-btn ${selectedDistrict === 'Alappuzha' ? 'active' : ''}`}
                onClick={() => setSelectedDistrict('Alappuzha')}
              >
                Alappuzha (8)
              </button>
              <button 
                type="button"
                className={`bus-pill-btn ${selectedDistrict === 'Kollam' ? 'active' : ''}`}
                onClick={() => setSelectedDistrict('Kollam')}
              >
                Kollam (8)
              </button>
              <button 
                type="button"
                className={`bus-pill-btn ${selectedDistrict === 'Pathanamthitta' ? 'active' : ''}`}
                onClick={() => setSelectedDistrict('Pathanamthitta')}
              >
                Pathanamthitta (7)
              </button>
            </div>

            {/* Quick jump to bus dropdown */}
            <select 
              value={selectedBusNo}
              onChange={(e) => setSelectedBusNo(e.target.value)}
              className="bus-select-dropdown"
              aria-label="Filter by bus number"
            >
              <option value="ALL">Select Bus: All 23 Buses</option>
              {busRoutes.map(b => (
                <option key={b.busNo} value={b.busNo.toString()}>
                  Bus {b.busNo < 10 ? `0${b.busNo}` : b.busNo} – {b.startPoint}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Toolbar Sub-row: count and toggle all */}
        <div className="bus-toolbar-status">
          <div>
            Showing <strong>{filteredRoutes.length}</strong> of 23 buses
            {searchTerm && ` for "${searchTerm}"`}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {!searchTerm && selectedBusNo === 'ALL' && (
              <button 
                type="button" 
                className="bus-toggle-all-btn"
                onClick={Object.values(openBuses).some(Boolean) ? collapseAll : expandAll}
              >
                {Object.values(openBuses).some(Boolean) ? 'Collapse all' : 'Expand all'}
              </button>
            )}

            {(searchTerm || selectedDistrict !== 'ALL' || selectedBusNo !== 'ALL') && (
              <button 
                type="button" 
                onClick={clearAllFilters}
                style={{ fontSize: '0.8rem', color: '#2878D0', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Bus Cards List */}
        {filteredRoutes.length === 0 ? (
          <div className="bus-empty-state">
            <div className="bus-empty-icon">
              <Bus size={22} />
            </div>
            <h3 style={{ fontSize: '1rem', color: '#142A55', margin: 0 }}>No matching stop or bus found</h3>
            <p style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              We couldn't find any stop matching "{searchTerm}".
            </p>
            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              style={{ marginTop: '0.75rem' }}
              onClick={clearAllFilters}
            >
              View All Buses
            </button>
          </div>
        ) : (
          <div className="bus-list-container">
            {filteredRoutes.map(bus => {
              const q = searchTerm.trim().toLowerCase();
              const open = isCardOpen(bus.busNo);

              return (
                <article key={bus.busNo} className="bus-card">
                  {/* Card Header (Accordion toggle with structured rows) */}
                  <div 
                    className="bus-card-header"
                    onClick={() => toggleCard(bus.busNo)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={open}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleCard(bus.busNo);
                      }
                    }}
                  >
                    {/* Top Row: Left meta badge + District, Right Departs pill + Chevron */}
                    <div className="bus-header-top-row">
                      <div className="bus-badge-group">
                        <span className="bus-badge">
                          <Bus size={13} />
                          Bus {bus.busNo < 10 ? `0${bus.busNo}` : bus.busNo}
                        </span>
                        <span className="bus-card-district">{bus.district}</span>
                      </div>

                      <div className="bus-header-action-group">
                        <span className="bus-departs-pill">
                          Departs: <strong>{bus.departureTime}</strong>
                        </span>
                        <span className="bus-chevron-pill" aria-hidden="true">
                          {open ? (
                            <ChevronUp size={16} className="bus-chevron-icon" />
                          ) : (
                            <ChevronDown size={16} className="bus-chevron-icon" />
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Route Title: Full Width, No Truncation, Natural Wrapping */}
                    <h2 className="bus-route-title">{bus.routeName}</h2>

                    {/* Subline Row */}
                    <div className="bus-card-subline">
                      <span><strong>{bus.stops.length}</strong> boarding stops</span>
                      <span className="bus-dot-sep">•</span>
                      <span>Starts from <strong>{bus.startPoint}</strong></span>
                      <span className="bus-dot-sep">•</span>
                      <span>Arrives SBCE Pattoor <strong>~8:25 AM</strong></span>
                    </div>
                  </div>

                  {/* Stops Sequence (Schedule Report Body) */}
                  {open && (
                    <div className="bus-stops-wrapper">
                      {/* Schedule Table Head */}
                      <div className="bus-schedule-table-head">
                        <div className="bus-schedule-th-left">
                          <span className="bus-th-col-num">#</span>
                          <span>Boarding Point</span>
                        </div>
                        <div className="bus-schedule-th-right">
                          <span>Morning Pickup Time</span>
                        </div>
                      </div>

                      {/* Stops List */}
                      <div className="bus-stops-list">
                        {bus.stops.map((stop) => {
                          const isMatch = q.length > 0 && stop.name.toLowerCase().includes(q);

                          return (
                            <div 
                              key={stop.stopNo} 
                              className={`bus-stop-row ${isMatch ? 'highlight-match' : ''}`}
                            >
                              <div className="bus-stop-row-left">
                                <span className="bus-stop-num-badge">{stop.stopNo}</span>
                                <span className="bus-stop-name-text">{stop.name}</span>
                              </div>
                              {stop.time && (
                                <span className="bus-stop-time-pill">{stop.time}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Card Destination Footer */}
                  {open && (
                    <div className="bus-card-footer">
                      <span className="bus-dest-note">
                        <Navigation size={13} style={{ color: '#059669', flexShrink: 0 }} />
                        <span>Final Destination: <strong>SBCE Pattoor Campus (~8:25 AM)</strong></span>
                      </span>
                      <span className="bus-footer-stops-count">Total {bus.stops.length} boarding points</span>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Minimal Schedule Banner */}
        <div className="bus-simple-banner">
          <div>
            <strong>Campus Timing Note:</strong> All buses arrive at campus between <strong>8:20 AM and 8:35 AM</strong> in the morning and depart from the campus bus terminal at <strong>4:30 PM</strong> in the evening.
          </div>
          <div style={{ color: '#475569', fontSize: '0.8rem' }}>
            SBCE Pattoor, Nooranad
          </div>
        </div>
      </main>

      <Footer siteConfig={siteConfig} />
    </div>
  );
}
