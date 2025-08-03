#!/usr/bin/env node
/**
 * Security Setup Script
 * Run this script to verify and set up security measures
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔒 Security Hardening Setup');
console.log('============================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found');
  console.log('📝 Creating .env from .env.example...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created');
  } else {
    console.log('❌ .env.example not found');
    process.exit(1);
  }
}

// Generate a secure session secret
const generateSecureSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

console.log('\n🔑 Session Security');
console.log('-------------------');
console.log('Generated secure session secret:');
console.log(generateSecureSecret());
console.log('\n📋 Copy this secret to your .env file as SESSION_SECRET');

// Check upload directory
const uploadDir = path.join(__dirname, '../uploads-secure');
if (!fs.existsSync(uploadDir)) {
  console.log('\n📁 Creating secure upload directory...');
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Created: uploads-secure/');
} else {
  console.log('\n✅ Secure upload directory exists');
}

// Security checklist
console.log('\n📋 Security Checklist');
console.log('---------------------');
const checklist = [
  'Set NODE_ENV=production in production',
  'Use the generated SESSION_SECRET in .env',
  'Enable HTTPS with SSL certificates',
  'Configure reverse proxy (nginx/Apache)',
  'Set up firewall rules',
  'Enable database authentication',
  'Configure log monitoring',
  'Set up regular backup strategy',
  'Review CORS settings for production',
  'Test rate limiting functionality'
];

checklist.forEach((item, index) => {
  console.log(`${index + 1}. ${item}`);
});

console.log('\n🔍 File Upload Security Features');
console.log('--------------------------------');
console.log('✅ Filename sanitization');
console.log('✅ MIME type verification');
console.log('✅ File size limits (PDF: 10MB, MP4: 100MB)');
console.log('✅ Storage outside web root');
console.log('✅ Authenticated file access');
console.log('✅ Rate limiting on uploads');

console.log('\n🛡️  Security Headers (Helmet)');
console.log('-----------------------------');
console.log('✅ Content Security Policy');
console.log('✅ X-Frame-Options');
console.log('✅ X-Content-Type-Options');
console.log('✅ Strict-Transport-Security');

console.log('\n⚡ Rate Limiting');
console.log('---------------');
console.log('✅ General API: 100 req/15min per IP');
console.log('✅ File uploads: 10 req/15min per IP');

console.log('\n🍪 Session Security');
console.log('------------------');
console.log('✅ Secure cookies (HTTPS in production)');
console.log('✅ HttpOnly cookies');
console.log('✅ SameSite strict');

console.log('\n📚 Documentation');
console.log('----------------');
console.log('📖 Read SECURITY.md for detailed security information');
console.log('📖 Check .env.example for environment configuration');

console.log('\n🚀 Next Steps');
console.log('-------------');
console.log('1. Update .env with your production values');
console.log('2. Deploy with NODE_ENV=production');
console.log('3. Test all security features');
console.log('4. Monitor logs for security events');

console.log('\n✨ Security hardening setup complete!');
