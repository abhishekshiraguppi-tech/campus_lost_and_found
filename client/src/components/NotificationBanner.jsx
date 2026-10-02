import React from 'react';

export default function NotificationBanner({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`}>
      <span>{type === 'success' ? '✅' : '⚠️'} {message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'inherit' }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
