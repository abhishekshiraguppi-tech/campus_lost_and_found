const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');
const upload = require('../middleware/upload');
const { validateItemForm } = require('../middleware/validate');

// Statistics dashboard endpoint
router.get('/stats', itemsController.getStats);

// List items with search, category, status, sort filters
router.get('/', itemsController.getItems);

// Get single item details by ID
router.get('/:id', itemsController.getItemById);

// Create new item report with optional image upload & validation
router.post('/', upload.single('image'), validateItemForm, itemsController.createItem);

// Update existing item
router.put('/:id', upload.single('image'), validateItemForm, itemsController.updateItem);

// Mark item as reunited
router.patch('/:id/reunite', itemsController.markReunited);

// Delete item
router.delete('/:id', itemsController.deleteItem);

module.exports = router;
