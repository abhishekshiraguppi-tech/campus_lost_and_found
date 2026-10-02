import React from 'react';

export default function ItemCard({ item, onViewDetails, onMarkReunited }) {
  const isLost = item.status?.toLowerCase() === 'lost';
  const isFound = item.status?.toLowerCase() === 'found';
  const isReunited = item.status?.toLowerCase() === 'reunited';

  // Format date nicely
  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Unknown date';

  return (
    <div className="item-card">
      <div className="item-card-image-wrapper">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="item-card-image" />
        ) : (
          <div className="item-card-placeholder">
            <span style={{ fontSize: '2.5rem' }}>
              {item.category === 'Electronics' ? '💻' :
               item.category === 'Keys & Cards' ? '🔑' :
               item.category === 'Bags & Wallets' ? '🎒' :
               item.category === 'Clothing & Accessories' ? '👕' :
               item.category === 'Books & Notes' ? '📚' : '📦'}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>No Image Attached</span>
          </div>
        )}

        <div className="item-card-badge">
          {isLost && <span className="badge badge-lost">🔴 Lost</span>}
          {isFound && <span className="badge badge-found">🟢 Found</span>}
          {isReunited && <span className="badge badge-reunited">💜 Reunited</span>}
        </div>
      </div>

      <div className="item-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <h3 className="item-card-title">{item.name}</h3>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span className="badge-category">{item.category}</span>
        </div>

        <div className="item-meta">
          <span>📍 {item.location}</span>
        </div>
        <div className="item-meta">
          <span>📅 {isLost ? 'Lost on:' : isFound ? 'Found on:' : 'Reported:'} {formattedDate}</span>
        </div>

        <p className="item-description">{item.description}</p>
      </div>

      <div className="item-card-footer">
        <button
          className="btn btn-sm btn-outline"
          onClick={() => onViewDetails(item)}
        >
          View Details
        </button>

        {!isReunited ? (
          <button
            className="btn btn-sm btn-success"
            onClick={() => onMarkReunited(item.id)}
            title="Mark this item as successfully reunited"
          >
            ✓ Reunited
          </button>
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--color-reunited)', fontWeight: 700 }}>
            ✓ Resolved
          </span>
        )}
      </div>
    </div>
  );
}
