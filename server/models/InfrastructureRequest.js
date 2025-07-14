const mongoose = require('mongoose');

const infrastructureRequestSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  description: String,
  requiredQuantity: {
    type: Number,
    required: true
  },
  remainingQuantity: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'partially_fulfilled', 'fulfilled'],
    default: 'open'
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InfrastructureApplication'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InfrastructureRequest', infrastructureRequestSchema); 