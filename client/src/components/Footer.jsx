import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>🎓 Campus Lost & Found</h3>
          <p>Helping students and staff safely report and recover items across university grounds.</p>
        </div>
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '0.75rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li><Link to="/browse" style={{ color: '#cbd5e1' }}>Browse All Listings</Link></li>
            <li><Link to="/report-lost" style={{ color: '#cbd5e1' }}>Report Lost Property</Link></li>
            <li><Link to="/report-found" style={{ color: '#cbd5e1' }}>Turn in Found Item</Link></li>
            <li><Link to="/dashboard" style={{ color: '#cbd5e1' }}>Campus Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '0.75rem' }}>Campus Info</h4>
          <p style={{ fontSize: '0.9rem' }}>Main Security Office: Student Union Bldg, Rm 102</p>
          <p style={{ fontSize: '0.9rem' }}>Emergency Contact: (555) 019-2000</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#64748b' }}>No account or registration required.</p>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #334155', fontSize: '0.85rem' }}>
        © {new Date().getFullYear()} Campus Lost & Found System • Open Student Engineering Project
      </div>
    </footer>
  );
}
