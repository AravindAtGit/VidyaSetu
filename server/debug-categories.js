const mongoose = require('mongoose');
const InfraCategory = require('./models/InfraCategory');
require('dotenv').config();

const debugCategories = async () => {
  try {
    console.log('🔍 Debug: Testing Categories API');
    console.log('Environment variables:');
    console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    console.log('- NODE_ENV:', process.env.NODE_ENV || 'Not set');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('📍 Database name:', mongoose.connection.name);
    console.log('📍 Host:', mongoose.connection.host);
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📋 Available collections:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Check if infracategories collection exists
    const infraCategoryCollection = collections.find(col => 
      col.name === 'infracategories' || col.name === 'InfraCategory'
    );
    
    if (infraCategoryCollection) {
      console.log(`\n✅ Found infrastructure categories collection: ${infraCategoryCollection.name}`);
    } else {
      console.log('\n❌ Infrastructure categories collection not found');
    }
    
    // Try to find categories using the model
    console.log('\n🔍 Searching for categories using InfraCategory model...');
    const categories = await InfraCategory.find({});
    console.log(`Found ${categories.length} categories`);
    
    if (categories.length > 0) {
      console.log('\n📋 Categories found:');
      categories.forEach((cat, idx) => {
        console.log(`  ${idx + 1}. ${cat.name} (${cat.subcategories.length} subcategories)`);
      });
    }
    
    // Try direct database query
    console.log('\n🔍 Searching using direct database query...');
    const directCategories = await mongoose.connection.db.collection('infracategories').find({}).toArray();
    console.log(`Direct query found ${directCategories.length} categories`);
    
    mongoose.connection.close();
    console.log('\n✅ Diagnostic complete');
  } catch (error) {
    console.error('❌ Error in diagnostic:', error);
    process.exit(1);
  }
};

debugCategories();
