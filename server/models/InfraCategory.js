const mongoose = require('mongoose');

const infraCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  subcategories: [{
    type: String,
    required: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('InfraCategory', infraCategorySchema); 