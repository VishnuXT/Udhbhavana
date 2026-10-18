import React, { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

export function PosterModal({ isOpen, onClose, posterUrl, title = "Official Event Poster" }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div 
        className="modal-card" 
        style={{ maxWidth: '640px', padding: 0, overflow: 'hidden' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ padding: '0.85rem 1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ZoomIn size={18} color="#2878D0" />
            {title}
          </h3>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose} 
            aria-label="Close poster view"
          >
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '0.75rem', backgroundColor: '#0D1C3A', display: 'flex', justifyContent: 'center' }}>
          <img 
            src={posterUrl} 
            alt="Official Udhbhavana 2027 Event Poster" 
            style={{ maxHeight: '78vh', width: 'auto', borderRadius: '4px', objectFit: 'contain' }} 
          />
        </div>
      </div>
    </div>
  );
}
