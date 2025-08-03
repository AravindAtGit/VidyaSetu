const express = require('express');
const Student = require('../models/Student');
const School = require('../models/School');
const Volunteer = require('../models/Volunteer');
const Content = require('../models/Content');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Get counts from database
    const [studentsCount, schoolsCount, volunteersCount, contributionsCount] = await Promise.all([
      Student.countDocuments(),
      School.countDocuments(),
      Volunteer.countDocuments(),
      Content.countDocuments()
    ]);

    res.json({
      students: studentsCount,
      schools: schoolsCount,
      volunteers: volunteersCount,
      contributions: contributionsCount
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      message: 'Failed to fetch statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
