const mongoose = require('mongoose');

/**
 * Middleware to validate that a user can access a specific document based on school and class
 * @param {string} modelName - Name of the mongoose model to check
 * @returns {Function} Express middleware function
 */
const validateSchoolClassAccess = (modelName) => {
  return async (req, res, next) => {
    try {
      const doc = await mongoose.model(modelName).findById(req.params.id).select('school class');
      
      if (!doc) {
        return res.status(404).json({ message: 'Not found' });
      }
      
      // If user is a student, enforce school and class restrictions
      if (req.session.user.userType === 'student') {
        if (doc.school.toString() !== req.session.user.schoolId || 
            doc.class !== req.session.user.class) {
          return res.status(403).json({ message: 'Forbidden' });
        }
      } 
      // If user is a school, ensure they can only access their own content
      else if (req.session.user.userType === 'school') {
        if (doc.school.toString() !== req.session.user.schoolId) {
          return res.status(403).json({ message: 'Forbidden' });
        }
      }
      // For other user types (volunteers, admins), allow access to all content
      
      next();
    } catch (error) {
      console.error('Access control error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

/**
 * Helper function to inject school and class filters into queries for students and schools
 * @param {Object} req - Express request object
 * @param {Object} baseQuery - Base query object to extend
 * @returns {Object} Query object with school/class filters based on user type
 */
const filterBySchoolClass = (req, baseQuery = {}) => {
  // If user is a student, add school and class filters
  if (req.session.user.userType === 'student') {
    return {
      ...baseQuery,
      school: req.session.user.schoolId,
      class: req.session.user.class
    };
  }
  
  // If user is a school, filter by their school ID only
  if (req.session.user.userType === 'school') {
    return {
      ...baseQuery,
      school: req.session.user.schoolId
    };
  }
  
  // For other user types (volunteers, admins), return base query without additional filters
  return baseQuery;
};

module.exports = {
  validateSchoolClassAccess,
  filterBySchoolClass
};
