const mongoose = require('mongoose');

/**
 * MongoDB Connection Configuration with Hardened Security
 * - Pulls exclusively from MONGODB_URI environment variable
 * - Supports MongoDB Atlas SRV strings
 * - Implements retry logic with exponential backoff
 * - Configurable connection pool and timeout settings
 */

const connectDB = async () => {
  // Validate MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is required');
    console.error('Please set MONGODB_URI in your .env file or environment variables');
    process.exit(1);
  }

  // Connection options with configurable values from environment
  const options = {
    // Connection pool settings
    maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE) || 10,
    minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE) || 2,
    
    // Timeout settings (in milliseconds)
    serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT) || 5000,
    socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT) || 45000,
    connectTimeoutMS: parseInt(process.env.MONGODB_CONNECT_TIMEOUT) || 10000,
    
    // Buffering settings
    bufferMaxEntries: 0, // Disable mongoose buffering
    bufferCommands: false, // Disable mongoose buffering
    
    // Additional stability options
    maxIdleTimeMS: parseInt(process.env.MONGODB_MAX_IDLE_TIME) || 30000,
    retryWrites: true,
    w: 'majority'
  };

  const maxRetries = parseInt(process.env.MONGODB_MAX_RETRIES) || 5;
  const retryDelay = parseInt(process.env.MONGODB_RETRY_DELAY) || 5000;

  let retryCount = 0;

  const attemptConnection = async () => {
    try {
      console.log(`🔄 Attempting MongoDB connection... (Attempt ${retryCount + 1}/${maxRetries})`);
      
      const conn = await mongoose.connect(process.env.MONGODB_URI, options);
      
      console.log('✅ MongoDB Connected Successfully!');
      console.log(`📍 Host: ${conn.connection.host}`);
      console.log(`🗄️  Database: ${conn.connection.name}`);
      console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
      console.log(`🏊 Pool Size: ${options.maxPoolSize} (max), ${options.minPoolSize} (min)`);
      
      return conn;
    } catch (error) {
      retryCount++;
      console.error(`❌ MongoDB connection failed (Attempt ${retryCount}/${maxRetries}):`, error.message);
      
      if (retryCount >= maxRetries) {
        console.error('🚨 Maximum retry attempts reached. Unable to connect to MongoDB.');
        console.error('Please check:');
        console.error('  - MONGODB_URI is correct and accessible');
        console.error('  - Network connectivity to MongoDB server');
        console.error('  - MongoDB server is running and accepting connections');
        console.error('  - Database credentials are valid');
        console.error('  - IP address is whitelisted (for Atlas clusters)');
        process.exit(1);
      }
      
      // Exponential backoff: delay increases with each retry
      const delay = retryDelay * Math.pow(2, retryCount - 1);
      console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return attemptConnection();
    }
  };

  return attemptConnection();
};

// Handle connection events
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('📴 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during MongoDB disconnection:', error);
    process.exit(1);
  }
});

module.exports = connectDB;
