const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const itemsRoutes = require('./routes/itemsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Data folder initialization
const dataPath = path.join(__dirname, 'data');
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

// Routes
app.use('/api/items', itemsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Campus Lost & Found API Server',
    time: new Date().toISOString()
  });
});

// Root endpoint info
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Campus Lost & Found API Server',
    endpoints: {
      health: 'GET /api/health',
      items: 'GET /api/items',
      stats: 'GET /api/items/stats',
      createItem: 'POST /api/items'
    }
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum allowed size is 5MB.'
    });
  }
  res.status(500).json({
    success: false,
    message: err.message || 'An internal server error occurred.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` Campus Lost & Found API Server running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(` API Base URL: http://localhost:${PORT}/api/items`);
  console.log(`===================================================`);
});
