const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const School = require('../models/School');
const Student = require('../models/Student');
const Volunteer = require('../models/Volunteer');
const authSession = require('../middleware/authSession');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, udiseNumber, password, role } = req.body;

    let user;
    let userRole;

    switch (role) {
      case 'school':
        user = await School.findOne({ udiseNumber });
        userRole = 'school';
        break;
      case 'student':
        user = await Student.findOne({ email });
        userRole = 'student';
        break;
      case 'volunteer':
        user = await Volunteer.findOne({ email });
        userRole = 'volunteer';
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create session with enhanced payload
    const sessionPayload = {
      id: user._id,
      email: user.email,
      udiseNumber: user.udiseNumber,
      role: userRole,
      userType: userRole,
      name: user.name || user.schoolName
    };

    // Add schoolId and class based on user type
    if (userRole === 'school') {
      sessionPayload.schoolId = user._id;
    } else if (userRole === 'student') {
      sessionPayload.schoolId = user.school;
      sessionPayload.class = user.class;
    }

    req.session.user = sessionPayload;

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        udiseNumber: user.udiseNumber,
        role: userRole,
        name: user.name || user.schoolName
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Register School
router.post('/register/school', async (req, res) => {
  try {
    const { udiseNumber, password, schoolName, location, email, mobileNumber } = req.body;

    // Input validation
    if (!udiseNumber || !password || !schoolName || !location || !email || !mobileNumber) {
      return res.status(400).json({ 
        message: 'All fields are required',
        missing: {
          udiseNumber: !udiseNumber,
          password: !password,
          schoolName: !schoolName,
          location: !location,
          email: !email,
          mobileNumber: !mobileNumber
        }
      });
    }

    // Validate UDISE number format
    if (!/^\d{11}$/.test(udiseNumber)) {
      return res.status(400).json({ message: 'UDISE number must be exactly 11 digits' });
    }

    // Validate mobile number format
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      return res.status(400).json({ message: 'Mobile number must be a valid 10-digit Indian number starting with 6-9' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Check if school already exists with UDISE number
    const existingSchoolByUdise = await School.findOne({ udiseNumber });
    if (existingSchoolByUdise) {
      return res.status(400).json({ message: 'School with this UDISE number already exists' });
    }

    // Check if school already exists with email
    const existingSchoolByEmail = await School.findOne({ email });
    if (existingSchoolByEmail) {
      return res.status(400).json({ message: 'School with this email already exists' });
    }

    // Create new school
    const school = new School({
      udiseNumber,
      passwordHash: password, // Will be hashed by pre-save middleware
      schoolName,
      location,
      email,
      mobileNumber
    });

    await school.save();

    // Create session with enhanced payload
    req.session.user = {
      id: school._id,
      email: school.email,
      udiseNumber: school.udiseNumber,
      role: 'school',
      userType: 'school',
      schoolId: school._id,
      name: school.schoolName
    };

    res.status(201).json({
      message: 'School registered successfully',
      user: {
        id: school._id,
        email: school.email,
        udiseNumber: school.udiseNumber,
        role: 'school',
        name: school.schoolName
      }
    });

  } catch (error) {
    console.error('School registration error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Register Volunteer
router.post('/register/volunteer', async (req, res) => {
  try {
    const { email, password, name, contact } = req.body;

    // Check if volunteer already exists
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({ message: 'Volunteer with this email already exists' });
    }

    // Create new volunteer
    const volunteer = new Volunteer({
      email,
      passwordHash: password, // Will be hashed by pre-save middleware
      name,
      contact
    });

    await volunteer.save();

    // Create session
    req.session.user = {
      id: volunteer._id,
      email: volunteer.email,
      role: 'volunteer',
      userType: 'volunteer',
      name: volunteer.name
    };

    res.status(201).json({
      message: 'Volunteer registered successfully',
      user: {
        id: volunteer._id,
        email: volunteer.email,
        role: 'volunteer',
        name: volunteer.name
      }
    });

  } catch (error) {
    console.error('Volunteer registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user
router.get('/me', authSession, (req, res) => {
  res.json({ user: req.session.user });
});

// Student login route
router.post('/login/student', async (req, res) => {
  try {
    const { studentId, password } = req.body;

    // Find student by studentId
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(401).json({ message: 'Invalid student ID or password' });
    }

    // Check password
    const isPasswordValid = await student.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid student ID or password' });
    }

    // Create session with enhanced payload
    req.session.user = {
      id: student._id,
      studentId: student.studentId,
      name: student.name,
      class: student.class,
      role: 'student',
      school: student.school,
      userType: 'student',
      schoolId: student.school
    };

    res.json({
      message: 'Login successful',
      user: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        class: student.class,
        role: 'student',
        school: student.school
      }
    });

  } catch (error) {
    console.error('Student login error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Test route to check database connection
router.get('/test', async (req, res) => {
  try {
    // Test database connection by trying to count schools
    const schoolCount = await School.countDocuments();
    const studentCount = await Student.countDocuments();
    
    // Get sample school data to check schema
    const sampleSchool = await School.findOne().select('-passwordHash');
    const sampleStudent = await Student.findOne().select('-passwordHash');
    
    res.json({ 
      message: 'Database connection successful', 
      schoolCount,
      studentCount,
      sampleSchool,
      sampleStudent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

module.exports = router; 