import React, { useState, useEffect } from 'react';
import { fetchItems, markAsReunited } from '../services/api';
import ItemCard from '../components/ItemCard';
import ItemDetailModal from '../components/ItemDetailModal';
import NotificationBanner from '../components/NotificationBanner';

const CATEGORIES = [
  'All',
  'Electronics',
  'Keys & Cards',
  'Bags & Wallets',
  'Clothing & Accessories',
  'Books & Notes',
  'Personal Items',
  'Other'
];

export default function BrowsePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Selected item modal
  const [selectedItem, setSelectedItem] = useState(null);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchItems({
        search,
        status: statusFilter,
        category: categoryFilter === 'All' ? 'all' : categoryFilter,
        sort: sortBy
      });

      if (res.success) {
        setItems(res.data);
      } else {
        setError(res.message || 'Failed to fetch items');
      }
    } catch (err) {
      setError(err.message || 'Server error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [search, statusFilter, categoryFilter, sortBy]);

  const handleMarkReunited = async (id) => {
    try {
      const res = await markAsReunited(id);
      if (res.success) {
        setNotification({ type: 'success', message: 'Item status updated to Reunited! 🎉' });
        loadItems();
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Could not update status.' });
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setCategoryFilter('All');
    setSortBy('newest');
  };

  return (
    <div>
      {/* Header Banner */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Browse Campus Items</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Search and filter all lost, found, and reunited items reported on campus.
        </p>
      </div>

      {/* Notification Toast */}
      <NotificationBanner
        message={notification?.message}
        type={notification?.type}
        onClose={() => setNotification(null)}
      />

      {/* Search & Filter Control Bar */}
      <div className="filter-bar">
        {/* Search input */}
        <div className="search-box">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search item name, location, keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="status-tabs">
          <button
            className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button
            className={`tab-btn ${statusFilter === 'lost' ? 'active' : ''}`}
            onClick={() => setStatusFilter('lost')}
          >
            Lost
          </button>
          <button
            className={`tab-btn ${statusFilter === 'found' ? 'active' : ''}`}
            onClick={() => setStatusFilter('found')}
          >
            Found
          </button>
          <button
            className={`tab-btn ${statusFilter === 'reunited' ? 'active' : ''}`}
            onClick={() => setStatusFilter('reunited')}
          >
            Reunited
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="filter-group">
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>

          {(search || statusFilter !== 'all' || categoryFilter !== 'All' || sortBy !== 'newest') && (
            <button className="btn btn-sm btn-outline" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content List / States */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
          <p>Loading items from server...</p>
        </div>
      ) : error ? (
        <div style={{ padding: '2rem', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fca5a5', color: '#dc2626', textAlign: 'center' }}>
          <h3>⚠️ Unable to Load Items</h3>
          <p style={{ margin: '0.5rem 0 1rem' }}>{error}</p>
          <button className="btn btn-sm btn-primary" onClick={loadItems}>
            Retry Request
          </button>
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔎</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No matching items found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            We couldn't find any listings matching your search or filter selection. Try adjusting your parameters.
          </p>
          <button className="btn btn-outline" onClick={clearFilters}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Showing <strong>{items.length}</strong> {items.length === 1 ? 'item' : 'items'}
          </div>

          <div className="item-grid">
            {items.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onViewDetails={(item) => setSelectedItem(item)}
                onMarkReunited={handleMarkReunited}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal Detail View */}
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
