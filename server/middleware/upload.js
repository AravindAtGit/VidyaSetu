const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store uploads outside web root for security
    const uploadPath = path.join(__dirname, '../../uploads-secure');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    const uniqueSuffix = crypto.randomBytes(6).toString('hex');
    cb(null, `${Date.now()}-${uniqueSuffix}-${sanitizedFilename}`);
  }
});

// MIME type verification with magic numbers
const verifyMimeType = buffer => {
  const signatures = {
    'video/mp4': [[0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70]],
    'application/pdf': [[0x25, 0x50, 0x44, 0x46]]
  };
  
  for (const [mimeType, sigs] of Object.entries(signatures)) {
    for (const sig of sigs) {
      if (sig.every((byte, index) => buffer[index] === byte)) {
        return mimeType;
      }
    }
  }
  return null;
};

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'application/pdf'];
  const maxSizes = {
    'video/mp4': 100 * 1024 * 1024, // 100 MB for videos
    'application/pdf': 10 * 1024 * 1024 // 10 MB for PDFs
  };
  
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only MP4 and PDF files are allowed.'), false);
  }
  
  // Set size limit based on MIME type
  req.maxFileSize = maxSizes[file.mimetype] || 10 * 1024 * 1024;
  
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
  fileFilter: fileFilter
});

// Middleware to verify MIME type after upload
const verifyUploadedFile = (req, res, next) => {
  if (!req.file) {
    return next();
  }
  
  const filePath = req.file.path;
  const buffer = fs.readFileSync(filePath, { start: 0, end: 32 }); // Read first 32 bytes
  
  const detectedMimeType = verifyMimeType(buffer);
  
  if (!detectedMimeType || detectedMimeType !== req.file.mimetype) {
    // Remove the uploaded file
    fs.unlinkSync(filePath);
    return res.status(400).json({ error: 'File content does not match declared MIME type' });
  }
  
  next();
};

module.exports = { upload, verifyUploadedFile };
