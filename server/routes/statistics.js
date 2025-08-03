const express = require('express');
const authSession = require('../middleware/authSession');
const router = express.Router();

// Apply authentication to all routes
router.use(authSession);

// Basic statistics endpoint
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Statistics endpoint - under development' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
