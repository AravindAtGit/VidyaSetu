const mongoose = require('mongoose');
const InfraCategory = require('./server/models/InfraCategory');
require('dotenv').config({ path: './server/.env' });

const testCategoriesAPI = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI configured' : 'No URI found');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vidyasetu');
    console.log('Connected to MongoDB');

    // Check if categories exist in the database
    const categories = await InfraCategory.find({}).select('name subcategories');
    console.log(`Found ${categories.length} infrastructure categories in database`);
    
    if (categories.length > 0) {
      console.log('Categories:');
      categories.forEach((category, index) => {
        console.log(`${index + 1}. ${category.name} (${category.subcategories.length} subcategories)`);
      });
    } else {
      console.log('No categories found in database. Need to seed categories.');
    }

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error testing categories:', error);
    process.exit(1);
  }
};

testCategoriesAPI();
