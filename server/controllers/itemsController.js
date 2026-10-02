const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/items.json');

// Initial data store initialized empty without mock or fake users
const SEED_ITEMS = [];

/**
 * Safely read items array from data/items.json
 */
function readItems() {
  try {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_ITEMS, null, 2), 'utf8');
      return SEED_ITEMS;
    }

    const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
    if (!fileContent.trim()) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_ITEMS, null, 2), 'utf8');
      return SEED_ITEMS;
    }

    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading items.json:', error);
    return [];
  }
}

/**
 * Safely write items array to data/items.json
 */
function writeItems(items) {
  try {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to items.json:', error);
    return false;
  }
}

// Controller Methods

/**
 * GET /api/items
 * Supports query parameters: search, status, category, sort
 */
function getItems(req, res) {
  try {
    let items = readItems();
    const { search, status, category, sort } = req.query;

    // Search query filter (matches name, description, location, contactName, category)
    if (search && search.trim() !== '') {
      const term = search.trim().toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term) ||
        (item.category && item.category.toLowerCase().includes(term)) ||
        (item.contactName && item.contactName.toLowerCase().includes(term))
      );
    }

    // Status filter (Lost, Found, Reunited)
    if (status && status !== 'all') {
      const statusLower = status.toLowerCase();
      items = items.filter(item => item.status.toLowerCase() === statusLower);
    }

    // Category filter
    if (category && category !== 'all') {
      items = items.filter(item => item.category === category);
    }

    // Sorting (newest default, oldest)
    if (sort === 'oldest') {
      items.sort((a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date));
    } else {
      // newest first
      items.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
    }

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving items', error: error.message });
  }
}

/**
 * GET /api/items/stats
 * Statistics overview for dashboard
 */
function getStats(req, res) {
  try {
    const items = readItems();
    const total = items.length;
    const lost = items.filter(i => i.status.toLowerCase() === 'lost').length;
    const found = items.filter(i => i.status.toLowerCase() === 'found').length;
    const reunited = items.filter(i => i.status.toLowerCase() === 'reunited').length;

    // Category breakdown
    const categoryCounts = {};
    items.forEach(item => {
      const cat = item.category || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Recent items (top 5)
    const recent = [...items]
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        total,
        lost,
        found,
        reunited,
        categoryCounts,
        recent
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching statistics', error: error.message });
  }
}

/**
 * GET /api/items/:id
 */
function getItemById(req, res) {
  try {
    const items = readItems();
    const item = items.find(i => i.id === req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching item', error: error.message });
  }
}

/**
 * POST /api/items
 * Create new lost or found item report
 */
function createItem(req, res) {
  try {
    const items = readItems();
    const {
      name,
      category,
      description,
      date,
      location,
      contactName,
      contactInfo,
      additionalDetails,
      type // 'lost' or 'found'
    } = req.body;

    // Determine status
    let status = 'Lost';
    if (type && type.toLowerCase() === 'found') {
      status = 'Found';
    } else if (req.body.status && ['lost', 'found'].includes(req.body.status.toLowerCase())) {
      status = req.body.status.charAt(0).toUpperCase() + req.body.status.slice(1).toLowerCase();
    }

    // Determine image URL if file uploaded
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newItem = {
      id: `item_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      status: status,
      category: category.trim(),
      description: description.trim(),
      date: date.trim(),
      location: location.trim(),
      contactName: contactName.trim(),
      contactInfo: contactInfo.trim(),
      additionalDetails: additionalDetails ? additionalDetails.trim() : '',
      imageUrl: imageUrl,
      createdAt: new Date().toISOString()
    };

    items.unshift(newItem);
    writeItems(items);

    res.status(201).json({
      success: true,
      message: `${status} item report created successfully!`,
      data: newItem
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating item', error: error.message });
  }
}

/**
 * PUT /api/items/:id
 * Update an existing item
 */
function updateItem(req, res) {
  try {
    const items = readItems();
    const index = items.findIndex(i => i.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const existingItem = items[index];
    const {
      name,
      category,
      description,
      date,
      location,
      contactName,
      contactInfo,
      additionalDetails,
      status
    } = req.body;

    let imageUrl = existingItem.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedItem = {
      ...existingItem,
      name: name ? name.trim() : existingItem.name,
      category: category ? category.trim() : existingItem.category,
      description: description ? description.trim() : existingItem.description,
      date: date ? date.trim() : existingItem.date,
      location: location ? location.trim() : existingItem.location,
      contactName: contactName ? contactName.trim() : existingItem.contactName,
      contactInfo: contactInfo ? contactInfo.trim() : existingItem.contactInfo,
      additionalDetails: additionalDetails !== undefined ? additionalDetails.trim() : existingItem.additionalDetails,
      status: status ? status : existingItem.status,
      imageUrl: imageUrl,
      updatedAt: new Date().toISOString()
    };

    items[index] = updatedItem;
    writeItems(items);

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating item', error: error.message });
  }
}

/**
 * PATCH /api/items/:id/reunite
 * Mark an item as reunited with its owner
 */
function markReunited(req, res) {
  try {
    const items = readItems();
    const index = items.findIndex(i => i.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    items[index].status = 'Reunited';
    items[index].reunitedAt = new Date().toISOString();

    writeItems(items);

    res.json({
      success: true,
      message: 'Item successfully marked as Reunited!',
      data: items[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating status', error: error.message });
  }
}

/**
 * DELETE /api/items/:id
 * Remove item from storage
 */
function deleteItem(req, res) {
  try {
    let items = readItems();
    const item = items.find(i => i.id === req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    items = items.filter(i => i.id !== req.params.id);
    writeItems(items);

    res.json({
      success: true,
      message: 'Item removed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting item', error: error.message });
  }
}

module.exports = {
  getItems,
  getStats,
  getItemById,
  createItem,
  updateItem,
  markReunited,
  deleteItem
};
