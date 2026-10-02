import React, { useState } from 'react';

export default function ItemDetailModal({ item, onClose, onMarkReunited }) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const isLost = item.status?.toLowerCase() === 'lost';
  const isFound = item.status?.toLowerCase() === 'found';
  const isReunited = item.status?.toLowerCase() === 'reunited';

  const copyContact = () => {
    navigator.clipboard.writeText(`${item.contactName} (${item.contactInfo})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div style={{ padding: '1.75rem' }}>
          {/* Header Status & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {isLost && <span className="badge badge-lost">🔴 Lost Item</span>}
            {isFound && <span className="badge badge-found">🟢 Found Item</span>}
            {isReunited && <span className="badge badge-reunited">💜 Reunited</span>}
            <span className="badge-category">{item.category}</span>
          </div>

          <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{item.name}</h2>

          {/* Image display */}
          {item.imageUrl ? (
            <div style={{ width: '100%', maxHeight: '350px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.25rem', backgroundColor: '#f1f5f9' }}>
              <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '350px' }} />
            </div>
          ) : (
            <div style={{ padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '12px', textAlign: 'center', color: '#64748b', marginBottom: '1.25rem', border: '1px dashed #cbd5e1' }}>
              📷 No image was uploaded for this item.
            </div>
          )}

          {/* Key Meta Information */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Location</span>
              <p style={{ fontWeight: 600 }}>📍 {item.location}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Date {isLost ? 'Lost' : 'Found'}</span>
              <p style={{ fontWeight: 600 }}>📅 {item.date}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Reported Date</span>
              <p style={{ fontWeight: 600 }}>🕒 {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: '#334155' }}>Item Description</h4>
            <p style={{ color: '#475569', whiteSpace: 'pre-line', lineHeight: '1.6' }}>{item.description}</p>
          </div>

          {/* Additional details if present */}
          {item.additionalDetails && (
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: '#334155' }}>Additional Details</h4>
              <p style={{ color: '#475569', fontStyle: 'italic' }}>{item.additionalDetails}</p>
            </div>
          )}

          {/* Contact Person Box */}
          <div style={{ border: '2px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#ffffff', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.6rem', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📞 Contact Information
            </h4>
            <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>{item.contactName}</p>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '0.75rem' }}>{item.contactInfo}</p>
            <button className="btn btn-sm btn-outline" onClick={copyContact}>
              {copied ? '✓ Copied Contact Info!' : '📋 Copy Contact Info'}
            </button>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <button className="btn btn-outline" onClick={onClose}>
              Close
            </button>

            {!isReunited && (
              <button
                className="btn btn-success"
                onClick={() => {
                  onMarkReunited(item.id);
                  onClose();
                }}
              >
                ✓ Mark as Reunited
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
