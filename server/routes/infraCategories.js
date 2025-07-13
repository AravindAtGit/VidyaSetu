const express = require('express');
const router = express.Router();
const InfraCategory = require('../models/InfraCategory');

// GET /api/infra/categories - List all categories with subcategories
router.get('/categories', async (req, res) => {
  try {
    const categories = await InfraCategory.find({}).select('name subcategories');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching infrastructure categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

module.exports = router; 