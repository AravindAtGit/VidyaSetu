const express = require('express');
const router = express.Router();
const InfrastructureRequest = require('../models/InfrastructureRequest');
const authSession = require('../middleware/authSession');
const roleCheck = require('../middleware/roleCheck');

// POST /api/school/infra/requests - Create new infrastructure request (School only)
router.post('/school/infra/requests', authSession, roleCheck('school'), async (req, res) => {
  try {
    const { category, subcategory, description, requiredQuantity } = req.body;
    
    if (!category || !subcategory) {
      return res.status(400).json({ message: 'Category and subcategory are required' });
    }

    const newRequest = new InfrastructureRequest({
      school: req.session.user.id,
      category,
      subcategory,
      description,
      requiredQuantity: requiredQuantity || 1
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error('Error creating infrastructure request:', error);
    res.status(500).json({ message: 'Failed to create request' });
  }
});

// GET /api/school/infra/requests - List requests by this school
router.get('/school/infra/requests', authSession, roleCheck('school'), async (req, res) => {
  try {
    const requests = await InfrastructureRequest.find({ school: req.session.user.id })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching school infrastructure requests:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

// GET /api/volunteer/infra/requests - List all open requests (Volunteer only)
router.get('/volunteer/infra/requests', authSession, roleCheck('volunteer'), async (req, res) => {
  try {
    const { category, subcategory, search } = req.query;
    let query = { status: 'open' };

    // Add filters if provided
    if (category) {
      query.category = category;
    }
    if (subcategory) {
      query.subcategory = subcategory;
    }
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } }
      ];
    }

    const requests = await InfrastructureRequest.find(query)
      .populate('school', 'schoolName location')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching volunteer infrastructure requests:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

// GET /api/volunteer/infra/requests/:requestId - Get specific request by ID (Volunteer only)
router.get('/volunteer/infra/requests/:requestId', authSession, roleCheck('volunteer'), async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const request = await InfrastructureRequest.findById(requestId)
      .populate('school', 'schoolName location');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    res.json(request);
  } catch (error) {
    console.error('Error fetching specific infrastructure request:', error);
    res.status(500).json({ message: 'Failed to fetch request' });
  }
});

module.exports = router; 