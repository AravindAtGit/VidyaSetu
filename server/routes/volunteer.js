const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');
const authSession = require('../middleware/authSession');
const roleCheck = require('../middleware/roleCheck');

// Get volunteer profile
router.get('/profile', authSession, roleCheck('volunteer'), async (req, res) => {
  try {
    const volunteerId = req.session.user.id;
    
    const volunteer = await Volunteer.findById(volunteerId)
      .select('-passwordHash');

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json({ volunteer });

  } catch (error) {
    console.error('Get volunteer profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update volunteer profile
router.put('/profile', authSession, roleCheck('volunteer'), async (req, res) => {
  try {
    const volunteerId = req.session.user.id;
    const { name, contact } = req.body;

    const volunteer = await Volunteer.findByIdAndUpdate(
      volunteerId,
      { name, contact },
      { new: true }
    ).select('-passwordHash');

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    // Update session
    req.session.user.name = volunteer.name;

    res.json({
      message: 'Profile updated successfully',
      volunteer
    });

  } catch (error) {
    console.error('Update volunteer profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 