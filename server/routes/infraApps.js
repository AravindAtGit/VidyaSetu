const express = require('express');
const router = express.Router();
const InfrastructureApplication = require('../models/InfrastructureApplication');
const InfrastructureRequest = require('../models/InfrastructureRequest');
const authSession = require('../middleware/authSession');
const roleCheck = require('../middleware/roleCheck');

// POST /api/volunteer/infra/apply/:requestId - Create application (Volunteer only)
router.post('/volunteer/infra/apply/:requestId', authSession, roleCheck('volunteer'), async (req, res) => {
  try {
    const { requestId } = req.params;
    const { quantity = 1 } = req.body;
    
    // Check if request exists and is open
    const request = await InfrastructureRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.status !== 'open') {
      return res.status(400).json({ message: 'Request is not open for applications' });
    }

    // Validate quantity
    if (quantity < 1 || quantity > request.remainingQuantity) {
      return res.status(400).json({ 
        message: `Quantity must be between 1 and ${request.remainingQuantity}` 
      });
    }

    // Check if volunteer already applied
    const existingApplication = await InfrastructureApplication.findOne({
      request: requestId,
      volunteer: req.session.user.id
    });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this request' });
    }

    const newApplication = new InfrastructureApplication({
      request: requestId,
      volunteer: req.session.user.id,
      quantity
    });

    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    console.error('Error creating infrastructure application:', error);
    res.status(500).json({ message: 'Failed to create application' });
  }
});

// GET /api/volunteer/infra/applications - List volunteer's applications
router.get('/volunteer/infra/applications', authSession, roleCheck('volunteer'), async (req, res) => {
  try {
    const applications = await InfrastructureApplication.find({ volunteer: req.session.user.id })
      .populate('request', 'category subcategory description status school requiredQuantity remainingQuantity')
      .populate('request.school', 'schoolName location')
      .sort({ appliedAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching volunteer applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// GET /api/school/infra/applications/:requestId - List applications for a request (School only)
router.get('/school/infra/applications/:requestId', authSession, roleCheck('school'), async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // Verify the request belongs to this school
    const request = await InfrastructureRequest.findOne({
      _id: requestId,
      school: req.session.user.id
    });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const applications = await InfrastructureApplication.find({ request: requestId })
      .populate('volunteer', 'name email contact')
      .sort({ appliedAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching school applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// POST /api/school/infra/applications/:appId/approve - Approve an application (School only)
router.post('/school/infra/applications/:appId/approve', authSession, roleCheck('school'), async (req, res) => {
  try {
    const { appId } = req.params;
    
    const application = await InfrastructureApplication.findById(appId)
      .populate('request');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify the request belongs to this school
    if (application.request.school.toString() !== req.session.user.id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update application status
    application.status = 'approved';
    await application.save();

    // Update request status
    application.request.status = 'approved';
    await application.request.save();

    res.json({ message: 'Application approved successfully' });
  } catch (error) {
    console.error('Error approving application:', error);
    res.status(500).json({ message: 'Failed to approve application' });
  }
});

// POST /api/school/infra/applications/:appId/feedback - Save feedback and mark as fulfilled (School only)
router.post('/school/infra/applications/:appId/feedback', authSession, roleCheck('school'), async (req, res) => {
  try {
    const { appId } = req.params;
    const { feedback } = req.body;
    
    if (!feedback) {
      return res.status(400).json({ message: 'Feedback is required' });
    }

    const application = await InfrastructureApplication.findById(appId)
      .populate('request');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify the request belongs to this school
    if (application.request.school.toString() !== req.session.user.id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if application is approved
    if (application.status !== 'approved') {
      return res.status(400).json({ message: 'Application must be approved before providing feedback' });
    }

    // Update application with feedback and mark as fulfilled
    application.feedback = feedback;
    application.fulfilledAt = new Date();
    application.status = 'fulfilled';
    await application.save();

    // Update request remaining quantity based on application quantity
    const request = application.request;
    request.remainingQuantity = Math.max(0, request.remainingQuantity - application.quantity);
    
    // If all items fulfilled, mark as fulfilled, otherwise keep as approved
    if (request.remainingQuantity === 0) {
      request.status = 'fulfilled';
    }
    
    await request.save();

    res.json({ message: 'Feedback saved and fulfillment confirmed successfully' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Failed to save feedback' });
  }
});

// GET /api/volunteer/infra/applications/:appId - Get specific application details (Volunteer only)
router.get('/volunteer/infra/applications/:appId', authSession, roleCheck('volunteer'), async (req, res) => {
  try {
    const { appId } = req.params;
    
    const application = await InfrastructureApplication.findById(appId)
      .populate('request', 'category subcategory description status school requiredQuantity remainingQuantity')
      .populate('request.school', 'schoolName location')
      .populate('volunteer', 'name email contact');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify the application belongs to this volunteer
    if (application.volunteer._id.toString() !== req.session.user.id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(application);
  } catch (error) {
    console.error('Error fetching application details:', error);
    res.status(500).json({ message: 'Failed to fetch application details' });
  }
});

module.exports = router; 