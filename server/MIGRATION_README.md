# MongoDB Schema Migration: Content and Quiz Collections

## Overview
This migration ensures that all Content and Quiz documents have the required `school` (ObjectId) and `class` (String) fields, and adds compound indexes for improved query performance.

## Changes Made

### 1. Schema Updates
- ✅ **Content.js**: Already had required `school` and `class` fields
- ✅ **Quiz.js**: Already had required `school` and `class` fields
- ✅ Added compound index `{ school: 1, class: 1 }` to both collections

### 2. Index Optimizations
#### Content Collection Indexes:
```javascript
contentSchema.index({ school: 1, class: 1 });        // NEW - Primary compound index
contentSchema.index({ school: 1, type: 1, class: 1 }); // Existing - Enhanced filtering
contentSchema.index({ school: 1, subject: 1 });        // Existing - Subject queries
```

#### Quiz Collection Indexes:
```javascript
quizSchema.index({ school: 1, class: 1 }); // NEW - Primary compound index
```

### 3. Migration Strategy

The migration script `backfillSchoolClass.js` handles three scenarios:

1. **Valid Records**: Records with both `school` and `class` fields are left unchanged
2. **Missing Fields**: Records missing either field are updated with defaults:
   - Missing `school` → Set to first available School document
   - Missing `class` → Set to 'General'
3. **Failed Updates**: Records that cannot be updated are archived with error details

## Running the Migration

### Prerequisites
1. Ensure `.env` file is properly configured with `MONGODB_URI`
2. Verify database connection is working
3. Backup your database (recommended)

### Execution Methods

#### Method 1: Using npm script (Recommended)
```bash
cd server
npm run migrate
```

#### Method 2: Direct execution
```bash
cd server
node runMigration.js
```

#### Method 3: Direct migration file
```bash
cd server
node migrations/backfillSchoolClass.js
```

## Migration Output

The script provides detailed console output:
```
🚀 Starting MongoDB Schema Migration for Content and Quiz collections
📅 Started at: 2025-01-03T17:20:00.000Z
✅ Connected to MongoDB

🔄 Processing Content collection...
📊 Found 5 Content records with missing school/class fields
📝 Setting default school for Content: Introduction to Physics
📝 Setting default class for Content: Math Basics
✅ Content migration completed:
   📈 Updated: 4 records
   📦 Archived: 1 records

🔄 Processing Quiz collection...
📊 Found 2 Quiz records with missing school/class fields
📝 Setting default school for Quiz: Science Quiz 1
✅ Quiz migration completed:
   📈 Updated: 2 records
   📦 Archived: 0 records

🔧 Creating compound indexes...
✅ Content compound index { school: 1, class: 1 } created
✅ Quiz compound index { school: 1, class: 1 } created

🎉 Migration completed successfully!
📅 Completed at: 2025-01-03T17:20:15.000Z
🔌 Disconnected from MongoDB
```

## Post-Migration Verification

### Check Updated Records
```javascript
// Count migrated records
db.contents.countDocuments({ migrated: true })
db.quizzes.countDocuments({ migrated: true })

// Check archived records
db.contents.find({ archived: true })
db.quizzes.find({ archived: true })
```

### Verify Indexes
```javascript
// List indexes
db.contents.getIndexes()
db.quizzes.getIndexes()

// Verify compound index exists
db.contents.getIndexes().find(idx => 
  idx.key.school === 1 && idx.key.class === 1
)
```

### Test Query Performance
```javascript
// Test queries using the new compound index
db.contents.find({ school: ObjectId("..."), class: "Grade 10" }).explain("executionStats")
db.quizzes.find({ school: ObjectId("..."), class: "Grade 10" }).explain("executionStats")
```

## Rollback Strategy

If rollback is needed:

1. **Remove migration markers**:
```javascript
db.contents.updateMany(
  { migrated: true }, 
  { $unset: { migrated: 1, migratedAt: 1 } }
)
db.quizzes.updateMany(
  { migrated: true }, 
  { $unset: { migrated: 1, migratedAt: 1 } }
)
```

2. **Restore archived records** (if needed):
```javascript
db.contents.updateMany(
  { archived: true, archivedReason: /Migration failed/ }, 
  { $unset: { archived: 1, archivedReason: 1, archivedAt: 1 } }
)
```

3. **Drop compound indexes** (if needed):
```javascript
db.contents.dropIndex({ school: 1, class: 1 })
db.quizzes.dropIndex({ school: 1, class: 1 })
```

## Performance Impact

- **Query Performance**: Significant improvement for filtered queries by school and class
- **Storage**: Minimal overhead from compound indexes
- **Write Performance**: Slight impact due to additional index maintenance

## Files Modified

- `server/models/Content.js` - Added compound index
- `server/models/Quiz.js` - Added compound index  
- `server/migrations/backfillSchoolClass.js` - New migration script
- `server/runMigration.js` - New migration runner
- `server/package.json` - Added migration npm script

## Best Practices for Future Migrations

1. Always backup database before running migrations
2. Test migrations on development/staging environments first
3. Use transaction blocks for complex multi-collection migrations
4. Include rollback strategies in migration documentation
5. Monitor performance impact after index changes
