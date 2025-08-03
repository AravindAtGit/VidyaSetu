const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: String,
    required: true,
    trim: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  questions: [{
    text: {
      type: String,
      required: true
    },
    answers: [{
      type: String,
      required: true
    }],
    correct: {
      type: Number,
      required: true
    }
  }],
  timeLimit: {
    type: Number, // in minutes, null means no time limit
    default: null
  },
  maxAttempts: {
    type: Number,
    default: 1,
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
quizSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
quizSchema.index({ school: 1, class: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
