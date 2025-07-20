const express = require('express');
const router = express.Router();
const School = require('../models/School');
const Student = require('../models/Student');
const authSession = require('../middleware/authSession');
const roleCheck = require('../middleware/roleCheck');

// Create a new student (only schools can do this)
router.post('/create-student', authSession, roleCheck('school'), async (req, res) => {
  try {
    // Handle both direct body and nested student object
    const studentData = req.body.student || req.body;
    const { name, class: studentClass, email, password, phone, grade } = studentData;
    const schoolId = req.session.user.id;

    // Generate a student ID if not provided
    let studentId = studentData.studentId;
    if (!studentId) {
      // Generate a unique student ID based on school ID and timestamp
      const timestamp = Date.now().toString().slice(-6);
      studentId = `STU${schoolId.toString().slice(-4)}${timestamp}`;
    }

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
      phone,
      grade,
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

// Update a student
router.put('/students/:id', authSession, roleCheck('school'), async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.session.user.id;
    
    // Handle both direct body and nested student object
    const studentData = req.body.student || req.body;
    const { name, class: studentClass, email, phone, grade, password } = studentData;

    // Find the student
    const student = await Student.findOne({ _id: id, school: schoolId });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update fields
    if (name) student.name = name;
    if (studentClass) student.class = studentClass;
    if (email) student.email = email;
    if (phone) student.phone = phone;
    if (grade) student.grade = grade;
    if (password) student.passwordHash = password; // Will be hashed by pre-save middleware

    await student.save();

    res.json({
      message: 'Student updated successfully',
      student: {
        _id: student._id,
        name: student.name,
        class: student.class,
        email: student.email,
        phone: student.phone,
        grade: student.grade
      }
    });

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a student
router.delete('/students/:id', authSession, roleCheck('school'), async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.session.user.id;

    // Find the student and remove it
    const student = await Student.findOneAndDelete({ _id: id, school: schoolId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Also remove from the school collection
    await School.findByIdAndUpdate(
      schoolId,
      { $pull: { students: id } }
    );

    res.json({ message: 'Student deleted successfully' });

  } catch (error) {
    console.error('Delete student error:', error);
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

// Get requests history with fulfilled applications for school
router.get('/infra/requests/history-with-fulfillments', authSession, roleCheck('school'), async (req, res) => {
  try {
    const schoolId = req.session.user.id;
    
    // Import models at the top if not already imported
    const InfrastructureRequest = require('../models/InfrastructureRequest');
    const InfrastructureApplication = require('../models/InfrastructureApplication');
    
    // Get all fulfilled requests for this school
    const requests = await InfrastructureRequest.find({ 
      school: schoolId, 
      status: 'fulfilled' 
    }).sort({ createdAt: -1 });
    
    // For each request, get its fulfilled applications with volunteer details
    const history = await Promise.all(
      requests.map(async (request) => {
        const fulfilledApplications = await InfrastructureApplication.find({ 
          request: request._id, 
          status: 'fulfilled' 
        }).populate('volunteer', 'name email contact');
        
        return {
          request: request,
          fulfilledApplications: fulfilledApplications
        };
      })
    );
    
    res.json(history);
    
  } catch (error) {
    console.error('Get school requests history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
