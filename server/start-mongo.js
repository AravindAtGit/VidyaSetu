const { exec } = require('child_process');

console.log('Checking if MongoDB is running...');

// Check if MongoDB is running on Windows
exec('netstat -an | findstr :27017', (error, stdout, stderr) => {
  if (error) {
    console.log('Error checking MongoDB status:', error.message);
    return;
  }
  
  if (stdout.includes('LISTENING')) {
    console.log('✅ MongoDB is running on port 27017');
    console.log('You can now start the server with: npm start');
  } else {
    console.log('❌ MongoDB is not running');
    console.log('Please start MongoDB first:');
    console.log('1. Open MongoDB Compass or');
    console.log('2. Run: mongod (if MongoDB is installed) or');
    console.log('3. Install MongoDB from: https://www.mongodb.com/try/download/community');
  }
}); 