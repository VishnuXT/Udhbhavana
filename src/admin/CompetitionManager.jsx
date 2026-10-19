import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle, 
  X, 
  AlertTriangle 
} from 'lucide-react';

export function CompetitionManager({ 
  competitions = [], 
  onAdd, 
  onUpdate, 
  onDelete, 
  onReorder,
  onRemoveDuplicates 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingComp, setEditingComp] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const emptyForm = {
    title: '',
    slug: '',
    category: 'Engineering & Tech',
    description: '',
    imageUrl: '',
    registrationUrl: 'https://forms.google.com',
    rules: '',
    eventDate: '09 Nov 2026',
    eventTime: '10:00 AM',
    venue: 'Campus Labs',
    prizeDetails: 'Cash awards and certificates',
    registrationStatus: 'Open Soon',
    published: true,
    displayOrder: competitions.length + 1
  };

  const [formData, setFormData] = useState(emptyForm);

  // Check if duplicates exist
  const titleCounts = {};
  competitions.forEach(c => {
    const t = (c.title || '').trim().toLowerCase();
    titleCounts[t] = (titleCounts[t] || 0) + 1;
  });
  const hasDuplicates = Object.values(titleCounts).some(count => count > 1);

  const filteredCompetitions = competitions.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.category && c.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setFormData({
      ...emptyForm,
      displayOrder: competitions.length + 1
    });
    setEditingComp(null);
    setIsNewModalOpen(true);
  };

  const handleOpenEdit = (comp) => {
    setEditingComp(comp);
    setFormData(comp);
    setIsNewModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    let res;
    if (editingComp) {
      res = await onUpdate(editingComp.id, formData);
    } else {
      res = await onAdd({
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-')
      });
    }

    setSaving(false);
    if (res?.error) {
      setStatusMessage({ type: 'error', text: res.error });
    } else {
      setStatusMessage({ type: 'success', text: editingComp ? 'Competition updated successfully!' : 'New competition added!' });
      setIsNewModalOpen(false);
      setEditingComp(null);
    }
  };

  const handleTogglePublish = async (comp) => {
    const res = await onUpdate(comp.id, { published: !comp.published });
    if (res?.error) {
      setStatusMessage({ type: 'error', text: res.error });
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= competitions.length) return;

    const reordered = [...competitions];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    await onReorder(reordered);
  };

  const handleDelete = async (id) => {
    setSaving(true);
    setStatusMessage(null);
    const res = await onDelete(id);
    setSaving(false);
    setDeleteConfirmId(null);

    if (res?.error) {
      setStatusMessage({ type: 'error', text: `Failed to delete competition: ${res.error}` });
    } else {
      setStatusMessage({ type: 'success', text: 'Competition deleted successfully!' });
    }
  };

  const handleCleanDuplicates = async () => {
    setSaving(true);
    setStatusMessage(null);
    if (onRemoveDuplicates) {
      const res = await onRemoveDuplicates();
      if (res?.error) {
        setStatusMessage({ type: 'error', text: `Error removing duplicates: ${res.error}` });
      } else {
        setStatusMessage({ type: 'success', text: `Cleaned up ${res.removedCount} duplicate entries successfully!` });
      }
    }
    setSaving(false);
  };

  return (
    <div>
      {/* Header & Controls */}
      <div className="admin-page-header">
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#142A55' }}>Competitions Management</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
            Add, reorder, and configure individual competition tracks and registration links.
          </p>
        </div>

        <div className="admin-page-header-actions">
          {hasDuplicates && (
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={handleCleanDuplicates}
              disabled={saving}
              style={{ color: '#B45309', borderColor: '#FCD34D', backgroundColor: '#FEF8E7' }}
            >
              <AlertTriangle size={15} />
              {saving ? 'Cleaning...' : 'Remove Duplicates'}
            </button>
          )}
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={handleOpenAdd}
          >
            <Plus size={16} />
            Add Competition Track
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className={`alert-banner ${statusMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {hasDuplicates && !statusMessage && (
        <div className="alert-banner alert-info" style={{ backgroundColor: '#FEF8E7', borderColor: '#FCD34D', color: '#92400E' }}>
          <AlertTriangle size={18} />
          <span>
            Duplicate tracks detected (caused by initial double-seed). Click <strong>"Remove Duplicates"</strong> above to instantly keep only one of each track.
          </span>
        </div>
      )}

      {/* Search Bar */}
      <div className="admin-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search competitions by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search 
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

      {/* Competitions Table */}
      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Order</th>
                <th>Track Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Schedule & Venue</th>
                <th>Visibility</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompetitions.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                    No competitions match your search query.
                  </td>
                </tr>
              ) : (
                filteredCompetitions.map((comp, idx) => (
                  <tr key={comp.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <button 
                          type="button" 
                          onClick={() => handleMove(idx, 'up')}
                          disabled={idx === 0}
                          style={{ opacity: idx === 0 ? 0.3 : 1, cursor: idx === 0 ? 'default' : 'pointer' }}
                          title="Move Up"
                        >
                          <ArrowUp size={14} color="#2878D0" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleMove(idx, 'down')}
                          disabled={idx === filteredCompetitions.length - 1}
                          style={{ opacity: idx === filteredCompetitions.length - 1 ? 0.3 : 1, cursor: idx === filteredCompetitions.length - 1 ? 'default' : 'pointer' }}
                          title="Move Down"
                        >
                          <ArrowDown size={14} color="#2878D0" />
                        </button>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#142A55' }}>{comp.title}</div>
                    </td>
                    <td>
                      <span className="badge badge-navy">{comp.category || 'Contest'}</span>
                    </td>
                    <td>
                      <span className={`badge ${comp.registrationStatus?.toLowerCase().includes('open') ? 'badge-green' : 'badge-gray'}`}>
                        {comp.registrationStatus || 'Announced'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.825rem' }}>{comp.eventDate} {comp.eventTime ? `• ${comp.eventTime}` : ''}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{comp.venue}</div>
                    </td>
                    <td>
                      <button 
                        type="button" 
                        onClick={() => handleTogglePublish(comp)}
                        className={`badge ${comp.published ? 'badge-green' : 'badge-yellow'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                      >
                        {comp.published ? 'Published' : 'Hidden'}
                      </button>
                    </td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          type="button" 
                          className="table-action-btn"
                          onClick={() => handleOpenEdit(comp)}
                          title="Edit Competition"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          type="button" 
                          className="table-action-btn btn-delete"
                          onClick={() => setDeleteConfirmId(comp.id)}
                          title="Delete Competition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Touch-Friendly Card Feed (<= 768px) */}
        <div className="admin-mobile-cards" style={{ padding: '0.75rem' }}>
          {filteredCompetitions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
              No competitions match your search query.
            </div>
          ) : (
            filteredCompetitions.map((comp, idx) => (
              <div key={comp.id} className="admin-mobile-card-item">
                <div className="admin-mobile-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className="badge badge-navy" style={{ fontWeight: 700 }}>#{idx + 1}</span>
                    <span className="badge badge-navy">{comp.category || 'Contest'}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleTogglePublish(comp)}
                    className={`badge ${comp.published ? 'badge-green' : 'badge-yellow'}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    {comp.published ? 'Published' : 'Hidden'}
                  </button>
                </div>

                <h4 className="admin-mobile-card-title">{comp.title}</h4>
                
                {comp.description && (
                  <p className="admin-mobile-card-desc">{comp.description}</p>
                )}

                <div className="admin-mobile-card-meta">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748B' }}>
                    <span>📅</span>
                    <span>{comp.eventDate || 'TBA'} {comp.eventTime ? `• ${comp.eventTime}` : ''}</span>
                  </div>
                  {comp.venue && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748B' }}>
                      <span>📍</span>
                      <span>{comp.venue}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                    <span className={`badge ${comp.registrationStatus?.toLowerCase().includes('open') ? 'badge-green' : 'badge-gray'}`}>
                      {comp.registrationStatus || 'Announced'}
                    </span>
                    {comp.registrationUrl && (
                      <span style={{ fontSize: '0.75rem', color: '#2878D0', fontWeight: 600 }}>🔗 Custom Form</span>
                    )}
                  </div>
                </div>

                <div className="admin-mobile-card-actions">
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      style={{ opacity: idx === 0 ? 0.3 : 1, padding: '0.4rem 0.6rem' }}
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === filteredCompetitions.length - 1}
                      style={{ opacity: idx === filteredCompetitions.length - 1 ? 0.3 : 1, padding: '0.4rem 0.6rem' }}
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flex: 1, justifyContent: 'flex-end' }}>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenEdit(comp)}
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setDeleteConfirmId(comp.id)}
                      style={{ color: '#EF4444', borderColor: '#FECDD3', padding: '0.4rem 0.75rem' }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isNewModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewModalOpen(false)} role="dialog" aria-modal="true">
          <div className="modal-card" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingComp ? 'Edit Competition Track' : 'Add New Competition Track'}</h3>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setIsNewModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Competition Title</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.title} 
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                      required 
                      placeholder="e.g. Ideathon"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.category} 
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                      placeholder="e.g. Engineering & Tech"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Short Description</label>
                  <textarea 
                    className="form-textarea" 
                    rows={3} 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    placeholder="Brief summary of the competition..."
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Event Date</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.eventDate} 
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} 
                      placeholder="09 Nov 2026"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Event Time</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.eventTime} 
                      onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })} 
                      placeholder="10:00 AM"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Venue</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.venue} 
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })} 
                      placeholder="Auditorium / Lab 3"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Registration Status Label</label>
                    <select 
                      className="form-select"
                      value={formData.registrationStatus}
                      onChange={(e) => setFormData({ ...formData, registrationStatus: e.target.value })}
                    >
                      <option value="Open Soon">Open Soon</option>
                      <option value="Registrations Open">Registrations Open</option>
                      <option value="Filling Fast">Filling Fast</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Prize Details</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.prizeDetails} 
                    onChange={(e) => setFormData({ ...formData, prizeDetails: e.target.value })} 
                    placeholder="e.g. Cash prizes for 1st and 2nd positions"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rules & Guidelines</label>
                  <textarea 
                    className="form-textarea" 
                    rows={4} 
                    value={formData.rules} 
                    onChange={(e) => setFormData({ ...formData, rules: e.target.value })} 
                    placeholder="1. Team size: 2 to 4 members&#10;2. Duration: 2 hours..."
                  />
                </div>

                <div className="toggle-switch-row">
                  <div className="toggle-switch-label">
                    <span className="toggle-switch-title">Publish Immediately</span>
                    <span className="toggle-switch-desc">Make visible on the public landing page</span>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={formData.published} 
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })} 
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setIsNewModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : editingComp ? 'Save Changes' : 'Create Track'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)} role="dialog" aria-modal="true">
          <div className="modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#E11D48', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={20} />
                Confirm Deletion
              </h3>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setDeleteConfirmId(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#475569', fontSize: '0.95rem' }}>
                Are you sure you want to delete this competition track? This will remove it from the database and public website.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Yes, Delete Track
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
