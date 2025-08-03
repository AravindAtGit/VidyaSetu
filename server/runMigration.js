#!/usr/bin/env node

/**
 * Migration Runner Script
 * 
 * This script runs the MongoDB schema migration to ensure all Content and Quiz
 * records have required 'school' and 'class' fields.
 * 
 * Usage:
 *   node runMigration.js
 *   npm run migrate
 */

console.log('🚀 Starting MongoDB Schema Migration...');
console.log('📁 Running migration from: ./migrations/backfillSchoolClass.js');

// Execute the migration
require('./migrations/backfillSchoolClass.js');
