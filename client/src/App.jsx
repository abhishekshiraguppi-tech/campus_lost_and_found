import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ReportLostPage from './pages/ReportLostPage';
import ReportFoundPage from './pages/ReportFoundPage';
import DashboardPage from './pages/DashboardPage';
import ItemDetailPage from './pages/ItemDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/report-lost" element={<ReportLostPage />} />
            <Route path="/report-found" element={<ReportFoundPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/items/:id" element={<ItemDetailPage />} />
            
            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>4️⃣0️⃣4️⃣</div>
                  <h2>Page Not Found</h2>
                  <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>
                    The page you are looking for doesn't exist or has moved.
                  </p>
                  <Link to="/" className="btn btn-primary">
                    Return to Home Page
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
