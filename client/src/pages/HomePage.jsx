import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchItems, fetchStats, markAsReunited } from '../services/api';
import ItemCard from '../components/ItemCard';
import ItemDetailModal from '../components/ItemDetailModal';
import NotificationBanner from '../components/NotificationBanner';

export default function HomePage() {
  const [stats, setStats] = useState({ total: 0, lost: 0, found: 0, reunited: 0 });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, itemsRes] = await Promise.all([
        fetchStats(),
        fetchItems({ sort: 'newest' })
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
      }
      if (itemsRes.success) {
        // Display top 4 recent items
        setRecentItems(itemsRes.data.slice(0, 4));
      }
    } catch (err) {
      console.error('Error loading home page data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleMarkReunited = async (id) => {
    try {
      const res = await markAsReunited(id);
      if (res.success) {
        setNotification({ type: 'success', message: 'Item successfully marked as Reunited! 🎉' });
        loadDashboardData();
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to update status' });
    }
  };

  return (
    <div>
      {/* Banner / Toast Notification */}
      <NotificationBanner
        message={notification?.message}
        type={notification?.type}
        onClose={() => setNotification(null)}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-tag">🏛️ Official Student & Staff Portal</span>
          <h1 className="hero-title">Campus Lost & Found System</h1>
          <p className="hero-subtitle">
            Lost an item in a lecture hall or library? Found something around campus?
            Our simple, open registry helps connect items back to their rightful owners quickly and safely.
          </p>
          <div className="hero-actions">
            <Link to="/report-lost" className="btn btn-danger">
              🚨 Report Lost Item
            </Link>
            <Link to="/report-found" className="btn btn-success">
              📦 Report Found Item
            </Link>
            <Link to="/browse" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              🔍 Browse All Items
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Statistics Bar */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Current Campus Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card" style={{ borderLeft: '4px solid var(--color-lost)' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Lost Items
              </span>
              <div className="stat-number" style={{ color: 'var(--color-lost)' }}>{stats.lost}</div>
            </div>
            <div className="stat-icon" style={{ backgroundColor: 'var(--color-lost-bg)', color: 'var(--color-lost)' }}>
              🔴
            </div>
          </div>

          <div className="stat-card" style={{ borderLeft: '4px solid var(--color-found)' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Found Items
              </span>
              <div className="stat-number" style={{ color: 'var(--color-found)' }}>{stats.found}</div>
            </div>
            <div className="stat-icon" style={{ backgroundColor: 'var(--color-found-bg)', color: 'var(--color-found)' }}>
              🟢
            </div>
          </div>

          <div className="stat-card" style={{ borderLeft: '4px solid var(--color-reunited)' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Items Reunited
              </span>
              <div className="stat-number" style={{ color: 'var(--color-reunited)' }}>{stats.reunited}</div>
            </div>
            <div className="stat-icon" style={{ backgroundColor: 'var(--color-reunited-bg)', color: 'var(--color-reunited)' }}>
              💜
            </div>
          </div>

          <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-blue)' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Reports
              </span>
              <div className="stat-number" style={{ color: 'var(--primary-blue)' }}>{stats.total}</div>
            </div>
            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-blue)' }}>
              📊
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Guide */}
      <section style={{ marginBottom: '3rem', backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', textAlign: 'center' }}>How Campus Lost & Found Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>📝</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>1. Post a Report</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Fill out a quick form describing your lost or found item with location and contact details. No login required!
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>2. Search & Match</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Filter by building, category (electronics, keys, bags), or keyword search to quickly locate matches.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🤝</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>3. Connect & Reunite</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Contact the poster directly via phone or email, retrieve your belongings, and click 'Mark Reunited'.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Listings Section */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>Recent Campus Listings</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Latest lost and found items reported across campus buildings.</p>
          </div>
          <Link to="/browse" className="btn btn-outline">
            View All ({stats.total}) →
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            ⏳ Loading campus listings...
          </div>
        ) : recentItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            📦 No listings reported yet. Be the first to report a lost or found item!
          </div>
        ) : (
          <div className="item-grid">
            {recentItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onViewDetails={(item) => setSelectedItem(item)}
                onMarkReunited={handleMarkReunited}
              />
            ))}
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onMarkReunited={handleMarkReunited}
        />
      )}
    </div>
  );
}
