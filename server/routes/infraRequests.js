const express = require('express');
const router = express.Router();
const InfrastructureRequest = require('../models/InfrastructureRequest');
const InfrastructureApplication = require('../models/InfrastructureApplication');
const School = require('../models/School');
const authSession = require('../middleware/authSession');
const roleCheck = require('../middleware/roleCheck');

// Public: List all open requests
router.get('/requests/open', async (req, res) => {
  try {
    const requests = await InfrastructureRequest.find({ status: 'open', remainingQuantity: { $gt: 0 } })
      .populate('school', 'schoolName location');
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch open requests' });
  }
});

// School: Create a new request
router.post('/school/requests', authSession, roleCheck('school'), async (req, res) => {
  try {
    const { category, subcategory, description, requiredQuantity } = req.body;
    const schoolId = req.session.user.id;
    if (!category || !subcategory || !requiredQuantity || requiredQuantity < 1) {
      return res.status(400).json({ message: 'Invalid request data' });
    }
    const request = new InfrastructureRequest({
      school: schoolId,
      category,
      subcategory,
      description,
      requiredQuantity,
      remainingQuantity: requiredQuantity,
      status: 'open',
      applications: []
    });
    await request.save();
    await School.findByIdAndUpdate(schoolId, { $push: { requests: request._id } });
    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create request' });
  }
});

// School: List all requests for this school (only non-fulfilled)
router.get('/school/requests', authSession, roleCheck('school'), async (req, res) => {
  try {
    const schoolId = req.session.user.id;
    const requests = await InfrastructureRequest.find({ school: schoolId, status: { $ne: 'fulfilled' } })
      .populate('applications')
      .populate('school', 'schoolName location');
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch school requests' });
  }
});

// School: Get fulfilled requests (history) with all fulfilled applications
router.get('/school/requests/history', authSession, roleCheck('school'), async (req, res) => {
  try {
    const schoolId = req.session.user.id;
    const requests = await InfrastructureRequest.find({ school: schoolId, status: 'fulfilled' })
      .populate({
        path: 'applications',
        match: { status: 'fulfilled' },
        populate: [
          { path: 'volunteer', select: 'name email contact' },
          { path: 'request', select: 'category subcategory description requiredQuantity remainingQuantity' }
        ]
      })
      .populate('school', 'schoolName location');
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch request history' });
  }
});

module.exports = router; 