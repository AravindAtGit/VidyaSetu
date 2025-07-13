const express = require('express');
const router = express.Router();
const School = require('../models/School');
const Student = require('../models/Student');
const authSession = require('../middleware/authSession');
const roleCheck = require('../middleware/roleCheck');

// Create a new student (only schools can do this)
router.post('/create-student', authSession, roleCheck('school'), async (req, res) => {
  try {
    const { studentId, name, class: studentClass, email, password } = req.body;
    const schoolId = req.session.user.id;

    // Check if student ID already exists
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student ID already exists' });
    }

    // Create new student
    const student = new Student({
      studentId,
      name,
      class: studentClass,
      email,
      passwordHash: password, // Will be hashed by pre-save middleware
      school: schoolId
    });

    await student.save();

    // Add student to school's students array
    await School.findByIdAndUpdate(
      schoolId,
      { $push: { students: student._id } }
    );

    res.status(201).json({
      message: 'Student created successfully',
      student: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        class: student.class,
        email: student.email
      }
    });

  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all students for the school
router.get('/students', authSession, roleCheck('school'), async (req, res) => {
  try {
    const schoolId = req.session.user.id;
    
    const students = await Student.find({ school: schoolId })
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    res.json({ students });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get school profile
router.get('/profile', authSession, roleCheck('school'), async (req, res) => {
  try {
    const schoolId = req.session.user.id;
    
    const school = await School.findById(schoolId)
      .select('-passwordHash')
      .populate('students', 'studentId name class email');

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.json({ school });

  } catch (error) {
    console.error('Get school profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 