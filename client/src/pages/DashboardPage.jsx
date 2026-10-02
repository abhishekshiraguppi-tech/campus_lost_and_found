import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchStats } from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchStats();
      if (res.success) {
        setStats(res.data);
      } else {
        setError(res.message || 'Failed to load statistics');
      }
    } catch (err) {
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
        ⏳ Loading dashboard analytics...
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div style={{ padding: '2rem', background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '12px', textAlign: 'center' }}>
        <h3>⚠️ Unable to Load Dashboard</h3>
        <p style={{ margin: '0.5rem 0 1rem' }}>{error}</p>
        <button className="btn btn-sm btn-primary" onClick={loadStats}>
          Retry
        </button>
      </div>
    );
  }

  const { total, lost, found, reunited, categoryCounts, recent } = stats;

  const reunitedRate = total > 0 ? Math.round((reunited / total) * 100) : 0;

  // Compute category percentages for chart
  const categoriesList = Object.keys(categoryCounts);
  const maxCategoryCount = Math.max(...Object.values(categoryCounts), 1);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Campus System Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Real-time statistics and item distribution analytics across campus locations.
        </p>
      </div>

      {/* Main Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-blue)' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Reported</span>
            <div className="stat-number" style={{ color: 'var(--primary-blue)' }}>{total}</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-blue)' }}>📋</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid var(--color-lost)' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Lost Items</span>
            <div className="stat-number" style={{ color: 'var(--color-lost)' }}>{lost}</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-lost-bg)', color: 'var(--color-lost)' }}>🔴</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid var(--color-found)' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Found Items</span>
            <div className="stat-number" style={{ color: 'var(--color-found)' }}>{found}</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-found-bg)', color: 'var(--color-found)' }}>🟢</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid var(--color-reunited)' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Reunited Items</span>
            <div className="stat-number" style={{ color: 'var(--color-reunited)' }}>{reunited}</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-reunited-bg)', color: 'var(--color-reunited)' }}>💜</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Success Rate</span>
            <div className="stat-number" style={{ color: '#0284c7' }}>{reunitedRate}%</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>🎉</div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Category Breakdown Chart */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
            📊 Items by Category
          </h3>
          {categoriesList.length === 0 ? (
            <p style={{ color: '#64748b' }}>No category data available.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {categoriesList.map(cat => {
                const count = categoryCounts[cat];
                const percentage = Math.round((count / maxCategoryCount) * 100);
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      <span>{cat}</span>
                      <span>{count} items</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--primary-blue), var(--primary-accent))',
                          borderRadius: '999px',
                          transition: 'width 0.5s ease-in-out'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Status Distribution Donut Summary */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
            🍩 Status Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Status Progress Bars */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-lost)' }}>🔴 Lost ({lost})</span>
                <span>{total > 0 ? Math.round((lost / total) * 100) : 0}%</span>
              </div>
              <div style={{ width: '100%', height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${total > 0 ? (lost / total) * 100 : 0}%`, height: '100%', background: 'var(--color-lost)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-found)' }}>🟢 Found ({found})</span>
                <span>{total > 0 ? Math.round((found / total) * 100) : 0}%</span>
              </div>
              <div style={{ width: '100%', height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${total > 0 ? (found / total) * 100 : 0}%`, height: '100%', background: 'var(--color-found)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-reunited)' }}>💜 Reunited ({reunited})</span>
                <span>{total > 0 ? Math.round((reunited / total) * 100) : 0}%</span>
              </div>
              <div style={{ width: '100%', height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${total > 0 ? (reunited / total) * 100 : 0}%`, height: '100%', background: 'var(--color-reunited)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Recent Activity & Reports</h3>
          <Link to="/browse" className="btn btn-sm btn-outline">
            View All →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No recent reports recorded.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(item => (
                  <tr key={item.id}>
                    <td>
                      {item.status.toLowerCase() === 'lost' && <span className="badge badge-lost">Lost</span>}
                      {item.status.toLowerCase() === 'found' && <span className="badge badge-found">Found</span>}
                      {item.status.toLowerCase() === 'reunited' && <span className="badge badge-reunited">Reunited</span>}
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td><span className="badge-category">{item.category}</span></td>
                    <td>📍 {item.location}</td>
                    <td>📅 {item.date}</td>
                    <td>
                      <Link to={`/items/${item.id}`} className="btn btn-sm btn-outline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
