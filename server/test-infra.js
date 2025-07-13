const mongoose = require('mongoose');
const InfraCategory = require('./models/InfraCategory');
require('dotenv').config();

const testInfraCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vidyasetu');
    console.log('Connected to MongoDB');

    // Check if categories exist
    const categories = await InfraCategory.find({});
    console.log(`Found ${categories.length} infrastructure categories`);
    
    if (categories.length === 0) {
      console.log('No categories found. Please run the seed script first:');
      console.log('node seeds/seedInfraCategories.js');
    } else {
      console.log('Categories found:');
      categories.forEach(category => {
        console.log(`- ${category.name}: ${category.subcategories.length} subcategories`);
      });
    }

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error testing infrastructure categories:', error);
    process.exit(1);
  }
};

testInfraCategories(); 