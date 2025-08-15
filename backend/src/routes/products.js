const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  getUserProducts 
} = require('../controllers/productController');
const { uploadSingle, handleUploadError } = require('../middleware/upload');
const { auth } = require('../middleware/auth');

// Simple test route first
router.get('/test', (req, res) => {
  res.json({ message: 'Products route working' });
});

// Public routes
router.get('/', getProducts);

// Protected routes - specific routes first
router.get('/user/my-products', auth, getUserProducts);

router.post('/', auth, uploadSingle, handleUploadError, createProduct);

// Generic routes with ID parameter - must be last
router.get('/:id', getProduct);

module.exports = router; 