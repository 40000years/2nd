const express = require('express');
const router = express.Router();

// Simple test route first
router.get('/test', (req, res) => {
  res.json({ message: 'Products route working' });
});

// Public routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all products' });
});

// Protected routes - specific routes first
router.get('/user/my-products', (req, res) => {
  res.json({ message: 'Get user products' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create product' });
});

// Generic routes with ID parameter - must be last
router.get('/:id', (req, res) => {
  res.json({ message: `Get product ${req.params.id}` });
});

module.exports = router; 