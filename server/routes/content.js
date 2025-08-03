const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { validateSchoolClassAccess, filterBySchoolClass } = require('../middleware/accessControl');
const authSession = require('../middleware/authSession');
const roleCheck = require('../middleware/roleCheck');
const { upload, verifyUploadedFile } = require('../middleware/upload');
const Content = require('../models/Content');
const path = require('path');

const router = express.Router();

// Apply authentication to all routes
router.use(authSession);

// Validation middleware for content creation
const validateContentCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters')
    .escape(),
  body('subject')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Subject must be between 1 and 100 characters')
    .escape(),
  body('class')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Class must be between 1 and 50 characters')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters')
    .escape(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters')
    .escape(),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
];

// Validation middleware for content updates
const validateContentUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters')
    .escape(),
  body('subject')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Subject must be between 1 and 100 characters')
    .escape(),
  body('class')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Class must be between 1 and 50 characters')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters')
    .escape(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters')
    .escape(),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
];

// Validation middleware for content listing
const validateContentQuery = [
  query('class')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Class must be between 1 and 50 characters')
    .escape(),
  query('subject')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Subject must be between 1 and 100 characters')
    .escape()
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Helper function to determine content type from mime type
const getContentType = (mimeType) => {
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.startsWith('image/')) return 'image';
  return 'document';
};

// POST /api/content - Upload file (school role only)
router.post('/', 
  roleCheck('school'),
  upload.single('file'),
  verifyUploadedFile,
  validateContentCreation,
  handleValidationErrors,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { title, subject, class: className, description, tags, isPublic } = req.body;
      
      // Create content document
      const content = new Content({
        title,
        subject,
        class: className,
        school: req.session.user.schoolId,
        type: getContentType(req.file.mimetype),
        fileUrl: `/api/files/${req.file.filename}`,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        description: description || '',
        tags: tags || [],
        isPublic: isPublic || false,
        uploadedBy: req.session.user.schoolId
      });

      await content.save();
      res.status(201).json(content);
    } catch (error) {
      console.error('Content upload error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// GET /api/content - List content (student role auto-filters by schoolId)
router.get('/', 
  validateContentQuery,
  handleValidationErrors,
  async (req, res) => {
    try {
      let query = {};
      
      // For students, auto-filter by schoolId and optionally by class/subject
      if (req.session.user.userType === 'student') {
        query.school = req.session.user.schoolId;
        
        // Optional filters for students
        if (req.query.class) {
          query.class = req.query.class;
        }
        if (req.query.subject) {
          query.subject = req.query.subject;
        }
      } else {
        // For non-students, apply base filtering
        query = filterBySchoolClass(req);
        
        // Add optional filters
        if (req.query.class) {
          query.class = req.query.class;
        }
        if (req.query.subject) {
          query.subject = req.query.subject;
        }
      }
      
      const contents = await Content.find(query).populate('school', 'name');
      res.json(contents);
    } catch (error) {
      console.error('Content listing error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// GET one content
router.get('/:id', validateSchoolClassAccess('Content'), async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate('school', 'name');
    res.json(content);
  } catch (error) {
    console.error('Content fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/content/:id - Update content (restricted to same school)
router.put('/:id', 
  validateSchoolClassAccess('Content'),
  validateContentUpdate,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { title, subject, class: className, description, tags, isPublic } = req.body;
      
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (subject !== undefined) updateData.subject = subject;
      if (className !== undefined) updateData.class = className;
      if (description !== undefined) updateData.description = description;
      if (tags !== undefined) updateData.tags = tags;
      if (isPublic !== undefined) updateData.isPublic = isPublic;
      
      updateData.updatedAt = new Date();
      
      const updatedContent = await Content.findByIdAndUpdate(
        req.params.id, 
        updateData, 
        { new: true }
      ).populate('school', 'name');
      
      res.json(updatedContent);
    } catch (error) {
      console.error('Content update error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// DELETE /api/content/:id - Delete content (restricted to same school)
router.delete('/:id', 
  validateSchoolClassAccess('Content'), 
  async (req, res) => {
    try {
      const content = await Content.findById(req.params.id);
      
      if (!content) {
        return res.status(404).json({ message: 'Content not found' });
      }
      
      // Delete the file from filesystem
      const fs = require('fs');
      const filePath = path.join(__dirname, '..', content.fileUrl);
      
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continue with database deletion even if file deletion fails
      }
      
      await Content.findByIdAndDelete(req.params.id);
      res.status(204).end();
    } catch (error) {
      console.error('Content deletion error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router;
