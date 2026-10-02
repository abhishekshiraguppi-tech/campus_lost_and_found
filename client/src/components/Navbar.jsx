import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMobile}>
          <div className="brand-icon">🎓</div>
          <span>Campus Lost & Found</span>
        </Link>

        <button className="mobile-toggle" onClick={toggleMobile} aria-label="Toggle Navigation">
          {mobileOpen ? '✕' : '☰'}
        </button>

        <ul className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <li>
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/browse" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              Browse Items
            </NavLink>
          </li>
          <li>
            <NavLink to="/report-lost" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              Report Lost
            </NavLink>
          </li>
          <li>
            <NavLink to="/report-found" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              Report Found
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <Link to="/report-lost" className="btn btn-sm btn-primary nav-btn-action" onClick={closeMobile}>
              + Post Item
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
