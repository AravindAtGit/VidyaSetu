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
  description: {
    type: String
  },
  requiredQuantity: {
    type: Number,
    default: 1
  },
  remainingQuantity: {
    type: Number,
    default: function() {
      return this.requiredQuantity;
    }
  },
  status: {
    type: String,
    enum: ['open', 'approved', 'fulfilled', 'completed'],
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InfrastructureRequest', infrastructureRequestSchema); 