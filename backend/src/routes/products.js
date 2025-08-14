const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { uploadMultiple, handleUploadError } = require('../middleware/upload');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getUserProducts
} = require('../controllers/productController');

// Public routes
router.get('/', getProducts);

// Protected routes
router.get('/user/my-products', auth, getUserProducts);
router.post('/', auth, authorize('seller', 'admin'), uploadMultiple, handleUploadError, createProduct);

// Routes with ID parameter (must be last)
router.get('/:id', getProduct);
router.put('/:id', auth, authorize('seller', 'admin'), uploadMultiple, handleUploadError, updateProduct);
router.delete('/:id', auth, authorize('seller', 'admin'), deleteProduct);

module.exports = router; 