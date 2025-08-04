const express = require('express');
const authSession = require('../middleware/authSession');
const School = require('../models/School');
const Student = require('../models/Student');
const Volunteer = require('../models/Volunteer');
const InfrastructureApplication = require('../models/InfrastructureApplication');
const router = express.Router();

// Public statistics endpoint (no authentication required)
router.get('/', async (req, res) => {
  try {
    // Get counts from database
    const [schoolCount, studentCount, volunteerCount, contributionCount] = await Promise.all([
      School.countDocuments(),
      Student.countDocuments(),
      Volunteer.countDocuments(),
      InfrastructureApplication.countDocuments({ status: 'fulfilled' })
    ]);

    res.json({
      schools: schoolCount,
      students: studentCount, // Maps to 'children' in frontend
      volunteers: volunteerCount,
      contributions: contributionCount
    });
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected statistics endpoint for authenticated users (if needed for detailed stats)
router.get('/detailed', authSession, async (req, res) => {
  try {
    // This could provide more detailed statistics for authenticated users
    res.json({ message: 'Detailed statistics endpoint - under development' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
