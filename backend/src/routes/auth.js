const express = require('express');
const router = express.Router();

// Simple test route first
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working' });
});

// Public routes
router.post('/register', (req, res) => {
  res.json({ message: 'Register user' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login user' });
});

// Protected routes
router.get('/profile', (req, res) => {
  res.json({ message: 'Get user profile' });
});

module.exports = router; 