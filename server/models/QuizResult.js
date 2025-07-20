const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  answers: [{
    questionIndex: {
      type: Number,
      required: true
    },
    selectedAnswer: {
      type: Number,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate submissions
quizResultSchema.index({ student: 1, quiz: 1 }, { unique: true });

module.exports = mongoose.model('QuizResult', quizResultSchema);
