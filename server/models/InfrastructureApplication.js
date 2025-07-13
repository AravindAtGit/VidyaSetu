const mongoose = require('mongoose');

const infrastructureApplicationSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InfrastructureRequest',
    required: true
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'fulfilled'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  fulfilledAt: {
    type: Date
  },
  feedback: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InfrastructureApplication', infrastructureApplicationSchema); 