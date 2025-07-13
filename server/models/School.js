const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schoolSchema = new mongoose.Schema({
  udiseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        // UDISE number is typically 11 digits
        return /^\d{11}$/.test(v);
      },
      message: 'UDISE number must be exactly 11 digits'
    }
  },
  passwordHash: {
    type: String,
    required: true
  },
  schoolName: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Indian mobile number validation (10 digits)
        return /^[6-9]\d{9}$/.test(v);
      },
      message: 'Mobile number must be a valid 10-digit Indian number'
    }
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to compare password
schoolSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Pre-save middleware to hash password
schoolSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('School', schoolSchema); 