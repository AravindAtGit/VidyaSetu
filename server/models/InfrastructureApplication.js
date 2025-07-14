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
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'fulfilled'],
    default: 'pending'
  },
  feedback: String,
  fulfilledAt: Date,
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InfrastructureApplication', infrastructureApplicationSchema); 