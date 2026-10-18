import React, { useState } from 'react';
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle, Trash2, RefreshCw } from 'lucide-react';
import { storageService } from '../services/storageService';

export function MediaManager({ siteConfig, onUpdateConfig }) {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingGuest, setUploadingGuest] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleFileUpload = async (file, assetType) => {
    if (!file) return;

    setStatusMessage(null);
    if (assetType === 'logo') setUploadingLogo(true);
    if (assetType === 'poster') setUploadingPoster(true);
    if (assetType === 'guest') setUploadingGuest(true);

    const { url, error } = await storageService.uploadImage(file, assetType);

    if (assetType === 'logo') setUploadingLogo(false);
    if (assetType === 'poster') setUploadingPoster(false);
    if (assetType === 'guest') setUploadingGuest(false);

    if (error) {
      setStatusMessage({ type: 'error', text: error });
      return;
    }

    if (url) {
      let updates = {};
      if (assetType === 'logo') updates = { logoUrl: url };
      if (assetType === 'poster') updates = { posterUrl: url };
      if (assetType === 'guest') updates = { guestImage: url };

      await onUpdateConfig(updates);
      setStatusMessage({ type: 'success', text: `${assetType.toUpperCase()} asset updated successfully!` });
    }
  };

  const handleResetToDefault = async (assetType) => {
    let updates = {};
    if (assetType === 'logo') updates = { logoUrl: '/src/assets/logo.png' };
    if (assetType === 'poster') updates = { posterUrl: '/src/assets/poster.jpg' };
    if (assetType === 'guest') updates = { guestImage: '' };

    await onUpdateConfig(updates);
    setStatusMessage({ type: 'success', text: `${assetType.toUpperCase()} restored to official default asset.` });
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#142A55' }}>Media & Poster Asset Manager</h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          Upload and manage official imagery, banners, and chief guest portraits with automatic size and format verification.
        </p>
      </div>

      {statusMessage && (
        <div className={`alert-banner ${statusMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* 1. Official Event Logo */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Official Event Logo</h3>
              <p>Displayed on Navbar, Hero, and Footer</p>
            </div>
          </div>
          <div className="admin-card-body" style={{ textAlign: 'center' }}>
            <div style={{
              background: '#0D1C3A',
              padding: '1.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <img 
                src={siteConfig?.logoUrl || '/src/assets/logo.png'} 
                alt="Current Logo Preview" 
                style={{ maxHeight: '110px', width: 'auto', objectFit: 'contain' }} 
              />
            </div>

            <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', margin: '0 auto 0.5rem', display: 'inline-flex' }}>
              <Upload size={15} />
              <span>{uploadingLogo ? 'Uploading...' : 'Replace Logo'}</span>
              <input 
                type="file" 
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                style={{ display: 'none' }}
                disabled={uploadingLogo}
                onChange={(e) => handleFileUpload(e.target.files[0], 'logo')}
              />
            </label>

            <div>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => handleResetToDefault('logo')}
                style={{ fontSize: '0.75rem' }}
              >
                <RefreshCw size={12} />
                Restore Default Logo
              </button>
            </div>
          </div>
        </div>

        {/* 2. Official Event Poster */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Official Event Poster</h3>
              <p>High-resolution vertical poster with expand modal</p>
            </div>
          </div>
          <div className="admin-card-body" style={{ textAlign: 'center' }}>
            <div style={{
              background: '#F4F7FC',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #E5EAF2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <img 
                src={siteConfig?.posterUrl || '/src/assets/poster.jpg'} 
                alt="Current Poster Preview" 
                style={{ maxHeight: '200px', width: 'auto', borderRadius: '4px', objectFit: 'contain' }} 
              />
            </div>

            <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', margin: '0 auto 0.5rem', display: 'inline-flex' }}>
              <Upload size={15} />
              <span>{uploadingPoster ? 'Uploading...' : 'Replace Event Poster'}</span>
              <input 
                type="file" 
                accept="image/png,image/jpeg,image/webp"
                style={{ display: 'none' }}
                disabled={uploadingPoster}
                onChange={(e) => handleFileUpload(e.target.files[0], 'poster')}
              />
            </label>

            <div>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => handleResetToDefault('poster')}
                style={{ fontSize: '0.75rem' }}
              >
                <RefreshCw size={12} />
                Restore Default Poster
              </button>
            </div>
          </div>
        </div>

        {/* 3. Chief Guest Photograph */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Chief Guest Photograph</h3>
              <p>Inauguration dignitary portrait</p>
            </div>
          </div>
          <div className="admin-card-body" style={{ textAlign: 'center' }}>
            <div style={{
              background: '#F8FAFC',
              padding: '1rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              {siteConfig?.guestImage ? (
                <img 
                  src={siteConfig.guestImage} 
                  alt="Guest Portrait" 
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #2878D0' }} 
                />
              ) : (
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: '#EBF3FC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2878D0'
                }}>
                  <ImageIcon size={48} />
                </div>
              )}
            </div>

            <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', margin: '0 auto 0.5rem', display: 'inline-flex' }}>
              <Upload size={15} />
              <span>{uploadingGuest ? 'Uploading...' : 'Upload Guest Photo'}</span>
              <input 
                type="file" 
                accept="image/png,image/jpeg,image/webp"
                style={{ display: 'none' }}
                disabled={uploadingGuest}
                onChange={(e) => handleFileUpload(e.target.files[0], 'guest')}
              />
            </label>

            {siteConfig?.guestImage && (
              <div>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleResetToDefault('guest')}
                  style={{ fontSize: '0.75rem', color: '#E11D48' }}
                >
                  <Trash2 size={12} />
                  Remove Photo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
