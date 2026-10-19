import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export function AnnouncementManager({ 
  announcements = [], 
  onAdd, 
  onUpdate, 
  onDelete 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    title: '',
    message: '',
    imageUrl: '',
    published: true,
    publishedAt: new Date().toISOString().split('T')[0],
    expiresAt: '',
    displayOrder: announcements.length + 1
  };

  const [formData, setFormData] = useState(emptyForm);

  const handleOpenAdd = () => {
    setFormData({
      ...emptyForm,
      displayOrder: announcements.length + 1
    });
    setEditingAnn(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann) => {
    setEditingAnn(ann);
    setFormData(ann);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (editingAnn) {
      await onUpdate(editingAnn.id, formData);
    } else {
      await onAdd(formData);
    }

    setSaving(false);
    setIsModalOpen(false);
    setEditingAnn(null);
  };

  const handleTogglePublish = async (ann) => {
    await onUpdate(ann.id, { published: !ann.published });
  };

  const handleDelete = async (id) => {
    await onDelete(id);
    setDeleteConfirmId(null);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#142A55' }}>Announcements & Alerts</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
            Broadcast real-time announcements, schedule notices, and registration updates.
          </p>
        </div>

        <div className="admin-page-header-actions">
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={handleOpenAdd}
          >
            <Plus size={16} />
            Create Announcement
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title & Message</th>
                <th>Published Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                    No announcements created yet.
                  </td>
                </tr>
              ) : (
                announcements.map((ann) => {
                  const isExpired = ann.expiresAt && ann.expiresAt < today;

                  return (
                    <tr key={ann.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#142A55' }}>{ann.title}</div>
                        <div style={{ fontSize: '0.825rem', color: '#64748B', maxWidth: '400px' }}>
                          {ann.message}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{ann.publishedAt || '—'}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: isExpired ? '#E11D48' : '#64748B' }}>
                          {ann.expiresAt ? `${ann.expiresAt} ${isExpired ? '(Expired)' : ''}` : 'No Expiry'}
                        </span>
                      </td>
                      <td>
                        <button 
                          type="button" 
                          onClick={() => handleTogglePublish(ann)}
                          className={`badge ${ann.published && !isExpired ? 'badge-green' : isExpired ? 'badge-gray' : 'badge-yellow'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                        >
                          {isExpired ? 'Expired' : ann.published ? 'Live' : 'Draft'}
                        </button>
                      </td>
                      <td>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button 
                            type="button" 
                            className="table-action-btn"
                            onClick={() => handleOpenEdit(ann)}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            type="button" 
                            className="table-action-btn btn-delete"
                            onClick={() => setDeleteConfirmId(ann.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Touch-Friendly Card Feed (<= 768px) */}
        <div className="admin-mobile-cards" style={{ padding: '0.75rem' }}>
          {announcements.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
              No announcements created yet.
            </div>
          ) : (
            announcements.map((ann) => {
              const isExpired = ann.expiresAt && ann.expiresAt < today;

              return (
                <div key={ann.id} className="admin-mobile-card-item">
                  <div className="admin-mobile-card-header">
                    <button 
                      type="button" 
                      onClick={() => handleTogglePublish(ann)}
                      className={`badge ${ann.published && !isExpired ? 'badge-green' : isExpired ? 'badge-gray' : 'badge-yellow'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                    >
                      {isExpired ? 'Expired' : ann.published ? 'Live' : 'Draft'}
                    </button>
                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                      {ann.publishedAt || 'Today'}
                    </span>
                  </div>

                  <h4 className="admin-mobile-card-title">{ann.title}</h4>
                  
                  <p className="admin-mobile-card-desc">{ann.message}</p>

                  <div className="admin-mobile-card-meta">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: isExpired ? '#E11D48' : '#64748B' }}>
                      <span>⏳</span>
                      <span>{ann.expiresAt ? `Expires: ${ann.expiresAt}` : 'No Expiry Set'}</span>
                    </div>
                  </div>

                  <div className="admin-mobile-card-actions">
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenEdit(ann)}
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setDeleteConfirmId(ann.id)}
                      style={{ color: '#EF4444', borderColor: '#FECDD3', padding: '0.4rem 0.75rem' }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)} role="dialog" aria-modal="true">
          <div className="modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingAnn ? 'Edit Announcement' : 'Post New Announcement'}</h3>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Announcement Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                    required 
                    placeholder="e.g. Ideathon Abstract Submissions Open"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message Content</label>
                  <textarea 
                    className="form-textarea" 
                    rows={4} 
                    value={formData.message} 
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                    required
                    placeholder="Enter announcement details..."
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Publication Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={formData.publishedAt} 
                      onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })} 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Auto-Expiry Date
                      <span className="form-hint">(Optional)</span>
                    </label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={formData.expiresAt} 
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="toggle-switch-row">
                  <div className="toggle-switch-label">
                    <span className="toggle-switch-title">Publish Announcement Immediately</span>
                    <span className="toggle-switch-desc">Show on public website</span>
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
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : editingAnn ? 'Save Changes' : 'Post Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)} role="dialog" aria-modal="true">
          <div className="modal-card" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#E11D48' }}>Confirm Deletion</h3>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setDeleteConfirmId(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#475569' }}>
                Are you sure you want to delete this announcement?
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
