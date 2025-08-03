const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const { upload, verifyUploadedFile } = require('./middleware/upload');

// Import routes
const authRoutes = require('./routes/auth');
const schoolRoutes = require('./routes/school');
const volunteerRoutes = require('./routes/volunteer');
const infraCategoriesRoutes = require('./routes/infraCategories');
const infraRequestsRoutes = require('./routes/infraRequests');
const infraAppsRoutes = require('./routes/infraApps');
const statisticsRouter = require('./routes/statistics');
const contentRoutes = require('./routes/content');
const quizRoutes = require('./routes/quiz');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
// Helmet for basic security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false // Allow file uploads
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use(limiter);

// Stricter rate limiting for upload endpoint
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 upload requests per windowMs
  message: 'Too many upload requests, please try again later.',
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Secure file serving instead of static serving
app.get('/api/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads-secure', filename);
  
  // Check if file exists
  if (!require('fs').existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  // Basic authorization check (you can enhance this based on your auth system)
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Serve file with proper headers
  res.sendFile(filePath);
});

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' // Prevent CSRF attacks
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/infra', infraCategoriesRoutes);
app.use('/api/infra', infraRequestsRoutes);
app.use('/api/infra', infraAppsRoutes);
app.use('/api/statistics', statisticsRouter);
app.use('/api/content', contentRoutes);
app.use('/api/quiz', quizRoutes);

// File upload route
app.post('/api/upload', uploadLimiter, upload.single('file'), verifyUploadedFile, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const url = `${req.protocol}://${req.get('host')}/api/files/${req.file.filename}`;
  res.json({ url });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 