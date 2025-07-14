const express = require('express');
const router = express.Router();
const InfrastructureApplication = require('../models/InfrastructureApplication');
const InfrastructureRequest = require('../models/InfrastructureRequest');
const School = require('../models/School');
const Volunteer = require('../models/Volunteer');
const authSession = require('../middleware/authSession');
const roleCheck = require('../middleware/roleCheck');

// Volunteer applies for a request
router.post('/volunteer/apply/:requestId', authSession, roleCheck('volunteer'), async (req, res) => {
  try {
    const { requestId } = req.params;
    const { quantity } = req.body;
    const volunteerId = req.session.user.id;

    const request = await InfrastructureRequest.findById(requestId);
    if (!request || request.status === 'fulfilled') {
      return res.status(404).json({ message: 'Request not found or already fulfilled' });
    }
    if (quantity < 1 || quantity > request.remainingQuantity) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }
    // Prevent duplicate application
    const existing = await InfrastructureApplication.findOne({ request: requestId, volunteer: volunteerId });
    if (existing) {
      return res.status(400).json({ message: 'Already applied for this request' });
    }
    const application = new InfrastructureApplication({
      request: requestId,
      volunteer: volunteerId,
      school: request.school,
      quantity,
      status: 'pending',
    });
    await application.save();
    // Add to volunteer and request
    await Volunteer.findByIdAndUpdate(volunteerId, { $push: { applications: application._id } });
    await InfrastructureRequest.findByIdAndUpdate(requestId, { $push: { applications: application._id } });
    res.status(201).json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to apply' });
  }
});

// School approves an application
router.post('/school/applications/:appId/approve', authSession, roleCheck('school'), async (req, res) => {
  try {
    const { appId } = req.params;
    const schoolId = req.session.user.id;
    const application = await InfrastructureApplication.findById(appId).populate('request');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.school.toString() !== schoolId) return res.status(403).json({ message: 'Not authorized' });
    if (application.status !== 'pending') return res.status(400).json({ message: 'Only pending applications can be approved' });
    application.status = 'approved';
    await application.save();
    res.json({ message: 'Application approved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to approve application' });
  }
});

// School fulfills an application (with feedback)
router.post('/school/applications/:appId/fulfill', authSession, roleCheck('school'), async (req, res) => {
  try {
    const { appId } = req.params;
    const { feedback } = req.body;
    const schoolId = req.session.user.id;
    const application = await InfrastructureApplication.findById(appId).populate('request');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.school.toString() !== schoolId) return res.status(403).json({ message: 'Not authorized' });
    if (application.status !== 'approved') return res.status(400).json({ message: 'Only approved applications can be fulfilled' });
    application.status = 'fulfilled';
    application.feedback = feedback;
    application.fulfilledAt = new Date();
    await application.save();
    // Update request remaining quantity and status
    const request = application.request;
    request.remainingQuantity -= application.quantity;
    if (request.remainingQuantity <= 0) {
      request.status = 'fulfilled';
      request.remainingQuantity = 0;
    } else {
      request.status = 'partially_fulfilled';
    }
    await request.save();
    res.json({ message: 'Application fulfilled and feedback saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fulfill application' });
  }
});

// Volunteer: Get all my applications (not fulfilled)
router.get('/volunteer/applications', authSession, roleCheck('volunteer'), async (req, res) => {
  try {
    const volunteerId = req.session.user.id;
    const applications = await InfrastructureApplication.find({ volunteer: volunteerId, status: { $ne: 'fulfilled' } })
      .populate({ path: 'request', populate: { path: 'school', select: 'schoolName location' } })
      .populate('school', 'schoolName location');
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// Volunteer: Get my fulfilled applications (history)
router.get('/volunteer/applications/history', authSession, roleCheck('volunteer'), async (req, res) => {
  try {
    const volunteerId = req.session.user.id;
    const applications = await InfrastructureApplication.find({ volunteer: volunteerId, status: 'fulfilled' })
      .populate({
        path: 'request',
        populate: { path: 'school', select: 'schoolName location' }
      })
      .populate('school', 'schoolName location');
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
});

// School: Get all applications for a request
router.get('/school/applications/:requestId', authSession, roleCheck('school'), async (req, res) => {
  try {
    const { requestId } = req.params;
    const schoolId = req.session.user.id;
    const request = await InfrastructureRequest.findById(requestId);
    if (!request || request.school.toString() !== schoolId) {
      return res.status(404).json({ message: 'Request not found or not authorized' });
    }
    const applications = await InfrastructureApplication.find({ request: requestId })
      .populate('volunteer', 'name email contact')
      .populate('request');
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

module.exports = router; 