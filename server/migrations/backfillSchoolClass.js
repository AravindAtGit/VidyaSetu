const mongoose = require('mongoose');
const Content = require('../models/Content');
const Quiz = require('../models/Quiz');
const School = require('../models/School');
require('dotenv').config();
const connectDB = require('../config/db');

/**
 * Migration Script: Back-fill or Archive Missing School/Class Fields
 * 
 * This script handles records in Content and Quiz collections that are missing
 * required 'school' or 'class' fields by:
 * 1. Attempting to infer missing data from existing records
 * 2. Using default values where inference isn't possible
 * 3. Archiving records that cannot be properly updated
 */

const migrateContentCollection = async () => {
    console.log('\n🔄 Processing Content collection...');
    
    // Find records missing school or class fields
    const invalidContent = await Content.find({
        $or: [
            { school: { $exists: false } },
            { school: null },
            { class: { $exists: false } },
            { class: null },
            { class: '' }
        ]
    });
    
    console.log(`📊 Found ${invalidContent.length} Content records with missing school/class fields`);
    
    if (invalidContent.length === 0) {
        console.log('✅ No Content records need migration');
        return;
    }
    
    // Get first available school as default
    const defaultSchool = await School.findOne();
    if (!defaultSchool) {
        console.log('⚠️  No schools found in database. Creating placeholder school...');
        // Create a placeholder school if none exists
        const placeholder = new School({
            name: 'Migrated School',
            address: 'Migration Placeholder',
            contactEmail: 'migration@placeholder.com',
            contactPhone: '0000000000'
        });
        await placeholder.save();
        defaultSchool = placeholder;
    }
    
    let updatedCount = 0;
    let archivedCount = 0;
    
    for (const content of invalidContent) {
        try {
            const updates = {};
            
            // Handle missing school
            if (!content.school) {
                updates.school = defaultSchool._id;
                console.log(`📝 Setting default school for Content: ${content.title}`);
            }
            
            // Handle missing class
            if (!content.class || content.class.trim() === '') {
                updates.class = 'General';
                console.log(`📝 Setting default class for Content: ${content.title}`);
            }
            
            // Mark as migrated for tracking
            updates.migrated = true;
            updates.migratedAt = new Date();
            
            await Content.updateOne({ _id: content._id }, { $set: updates });
            updatedCount++;
            
        } catch (error) {
            console.log(`❌ Failed to update Content ${content._id}: ${error.message}`);
            // Archive records that couldn't be updated
            await Content.updateOne(
                { _id: content._id }, 
                { 
                    $set: { 
                        archived: true, 
                        archivedReason: 'Migration failed: ' + error.message,
                        archivedAt: new Date()
                    } 
                }
            );
            archivedCount++;
        }
    }
    
    console.log(`✅ Content migration completed:`);
    console.log(`   📈 Updated: ${updatedCount} records`);
    console.log(`   📦 Archived: ${archivedCount} records`);
};

const migrateQuizCollection = async () => {
    console.log('\n🔄 Processing Quiz collection...');
    
    // Find records missing school or class fields
    const invalidQuizzes = await Quiz.find({
        $or: [
            { school: { $exists: false } },
            { school: null },
            { class: { $exists: false } },
            { class: null },
            { class: '' }
        ]
    });
    
    console.log(`📊 Found ${invalidQuizzes.length} Quiz records with missing school/class fields`);
    
    if (invalidQuizzes.length === 0) {
        console.log('✅ No Quiz records need migration');
        return;
    }
    
    // Get first available school as default
    const defaultSchool = await School.findOne();
    
    let updatedCount = 0;
    let archivedCount = 0;
    
    for (const quiz of invalidQuizzes) {
        try {
            const updates = {};
            
            // Handle missing school
            if (!quiz.school) {
                updates.school = defaultSchool._id;
                console.log(`📝 Setting default school for Quiz: ${quiz.title}`);
            }
            
            // Handle missing class
            if (!quiz.class || quiz.class.trim() === '') {
                updates.class = 'General';
                console.log(`📝 Setting default class for Quiz: ${quiz.title}`);
            }
            
            // Mark as migrated for tracking
            updates.migrated = true;
            updates.migratedAt = new Date();
            
            await Quiz.updateOne({ _id: quiz._id }, { $set: updates });
            updatedCount++;
            
        } catch (error) {
            console.log(`❌ Failed to update Quiz ${quiz._id}: ${error.message}`);
            // Archive records that couldn't be updated
            await Quiz.updateOne(
                { _id: quiz._id }, 
                { 
                    $set: { 
                        archived: true, 
                        archivedReason: 'Migration failed: ' + error.message,
                        archivedAt: new Date()
                    } 
                }
            );
            archivedCount++;
        }
    }
    
    console.log(`✅ Quiz migration completed:`);
    console.log(`   📈 Updated: ${updatedCount} records`);
    console.log(`   📦 Archived: ${archivedCount} records`);
};

const createIndexes = async () => {
    console.log('\n🔧 Creating compound indexes...');
    
    try {
        // Ensure the compound indexes are created
        await Content.collection.createIndex({ school: 1, class: 1 });
        console.log('✅ Content compound index { school: 1, class: 1 } created');
        
        await Quiz.collection.createIndex({ school: 1, class: 1 });
        console.log('✅ Quiz compound index { school: 1, class: 1 } created');
        
    } catch (error) {
        console.log('⚠️  Index creation error (may already exist):', error.message);
    }
};

// Main migration function
(async () => {
    try {
        console.log('🚀 Starting MongoDB Schema Migration for Content and Quiz collections');
        console.log('📅 Started at:', new Date().toISOString());
        
        await connectDB();
        console.log('✅ Connected to MongoDB');
        
        // Run migrations
        await migrateContentCollection();
        await migrateQuizCollection();
        await createIndexes();
        
        console.log('\n🎉 Migration completed successfully!');
        console.log('📅 Completed at:', new Date().toISOString());
        
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        
    } catch (error) {
        console.error('💥 Migration failed:', error);
        process.exit(1);
    }
})();

