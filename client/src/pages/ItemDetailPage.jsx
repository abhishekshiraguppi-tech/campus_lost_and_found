import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getItemById, markAsReunited, deleteItem } from '../services/api';
import NotificationBanner from '../components/NotificationBanner';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [notification, setNotification] = useState(null);

  const loadItem = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getItemById(id);
      if (res.success) {
        setItem(res.data);
      } else {
        setError(res.message || 'Item not found');
      }
    } catch (err) {
      setError(err.message || 'Server error loading item details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItem();
  }, [id]);

  const handleReunited = async () => {
    try {
      const res = await markAsReunited(id);
      if (res.success) {
        setNotification({ type: 'success', message: 'Item successfully marked as Reunited! 🎉' });
        loadItem();
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to update status' });
    }
  };

  const handleRemoveListing = async () => {
    if (!window.confirm('Remove this reunited listing? This cannot be undone.')) return;

    try {
      await deleteItem(id);
      navigate('/browse');
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to remove listing' });
    }
  };

  const copyContact = () => {
    if (!item) return;
    navigator.clipboard.writeText(`${item.contactName} (${item.contactInfo})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
        ⏳ Loading item details...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center', background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h2>Item Not Found</h2>
        <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>{error || 'The requested listing could not be found or has been removed.'}</p>
        <Link to="/browse" className="btn btn-primary">
          Back to Browse Listings
        </Link>
      </div>
    );
  }

  const isLost = item.status?.toLowerCase() === 'lost';
  const isFound = item.status?.toLowerCase() === 'found';
  const isReunited = item.status?.toLowerCase() === 'reunited';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <button className="btn btn-sm btn-outline" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <NotificationBanner
        message={notification?.message}
        type={notification?.type}
        onClose={() => setNotification(null)}
      />

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {isLost && <span className="badge badge-lost">🔴 Lost Item</span>}
          {isFound && <span className="badge badge-found">🟢 Found Item</span>}
          {isReunited && <span className="badge badge-reunited">💜 Reunited</span>}
          <span className="badge-category">{item.category}</span>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '1.25rem' }}>{item.name}</h1>

        {item.imageUrl ? (
          <div style={{ width: '100%', maxHeight: '420px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', backgroundColor: '#f1f5f9' }}>
            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '420px' }} />
          </div>
        ) : (
          <div style={{ padding: '3rem', backgroundColor: '#f8fafc', borderRadius: '12px', textAlign: 'center', color: '#64748b', marginBottom: '1.5rem', border: '1px dashed #cbd5e1' }}>
            📷 No image uploaded for this listing.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Location</span>
            <p style={{ fontWeight: 600, fontSize: '1.05rem' }}>📍 {item.location}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Date {isLost ? 'Lost' : 'Found'}</span>
            <p style={{ fontWeight: 600, fontSize: '1.05rem' }}>📅 {item.date}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Listing Status</span>
            <p style={{ fontWeight: 700, color: isLost ? 'var(--color-lost)' : isFound ? 'var(--color-found)' : 'var(--color-reunited)' }}>
              {item.status}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#334155' }}>Full Description</h3>
          <p style={{ color: '#475569', whiteSpace: 'pre-line', lineHeight: '1.7', fontSize: '1rem' }}>{item.description}</p>
        </div>

        {item.additionalDetails && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#334155' }}>Additional Notes</h3>
            <p style={{ color: '#475569', fontStyle: 'italic' }}>{item.additionalDetails}</p>
          </div>
        )}

        {/* Contact Info Box */}
        <div style={{ border: '2px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#f8fafc', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--primary-blue)' }}>
            📞 Reporter Contact Info
          </h3>
          <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.contactName}</p>
          <p style={{ color: '#475569', fontSize: '1rem', marginBottom: '1rem' }}>{item.contactInfo}</p>
          <button className="btn btn-sm btn-outline" onClick={copyContact}>
            {copied ? '✓ Contact Info Copied!' : '📋 Copy Contact Details'}
          </button>
        </div>

        {/* Status Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
          <Link to="/browse" className="btn btn-outline">
            Browse Other Listings
          </Link>

          {!isReunited ? (
            <button className="btn btn-success" onClick={handleReunited}>
              ✓ Mark as Reunited
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1rem', color: 'var(--color-reunited)', fontWeight: 700 }}>
                ✓ Item Reunited & Resolved
              </span>
              <button className="btn btn-sm btn-outline" onClick={handleRemoveListing}>
                Remove Listing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
