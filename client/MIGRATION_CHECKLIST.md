# localStorage to Server Persistence Migration Checklist

## ✅ Completed Tasks

### Hooks Implementation
- [x] Created `useContent` hook for managing videos/PDFs with server persistence
- [x] Created `useQuizzes` hook for managing quizzes with server persistence
- [x] Created `useQuizResults` hook for managing quiz results with server persistence
- [x] Created `useStudents` hook for managing students with server persistence
- [x] Created `useVirtualClasses` hook for managing virtual classes with server persistence
- [x] Created hooks index file for easier imports

### Component Updates
- [x] Updated `UploadContent` component to use `useContent` hook
- [x] Updated `Students` component to use `useStudents` hook
- [x] Updated `Quizzes` component to use `useQuizzes` hook
- [x] Updated `Resources` component to use `useContent` hook
- [x] Added loading and error states to all updated components

### Storage Utilities
- [x] Created minimal `uiStorage.js` for volatile UI state only
- [x] Added deprecation warnings to old `storage.js` file
- [x] Identified appropriate UI state keys (dark mode, sidebar collapse, etc.)

## 🔄 Remaining Tasks

### Component Updates Needed
- [ ] Update `VirtualClasses` component to use `useVirtualClasses` hook
- [ ] Update `QuizResults` component to use `useQuizResults` hook
- [ ] Update student quiz pages to use `useQuizzes` and `useQuizResults` hooks
- [ ] Update `StudentDashboard` component to use appropriate hooks
- [ ] Update `Progress` component to use `useQuizResults` hook

### Backend API Endpoints
- [ ] Ensure `/api/virtual-classes` endpoints exist and are functional
- [ ] Verify quiz results endpoints handle student-specific filtering
- [ ] Test access control for all endpoints (students see only their school's content)
- [ ] Implement proper class-based filtering for quizzes and virtual classes

### Authentication & Access Control
- [ ] Verify session-based authentication works with all new hooks
- [ ] Test that students can only access content from their school
- [ ] Test that students can only see quizzes for their specific class
- [ ] Test that schools can only manage their own content/students/quizzes

### Legacy Code Cleanup
- [ ] Remove all remaining `load()` and `save()` imports from components
- [ ] Update any remaining localStorage usage to use `uiStorage.js` where appropriate
- [ ] Remove unused localStorage keys after migration is complete
- [ ] Update `AddStudentForm` component to use `useStudents` hook methods

### Testing & Validation
- [ ] Test all CRUD operations work correctly with new hooks
- [ ] Verify data persistence across browser sessions
- [ ] Test loading states and error handling
- [ ] Verify role-based access control works correctly
- [ ] Test offline/online behavior

### Documentation
- [ ] Update component documentation to reflect new data flow
- [ ] Document new hook APIs and usage patterns
- [ ] Create troubleshooting guide for common issues

## 🚨 Breaking Changes to Watch For

1. **Data Structure Changes**: Server data might have different field names than localStorage data
2. **Authentication Requirements**: All API calls now require valid session authentication
3. **Access Control**: Data filtering happens on server-side, not client-side
4. **Async Operations**: All data operations are now asynchronous and require proper error handling

## 📋 Validation Criteria

Before removing `storage.js` completely:

1. All components use appropriate hooks instead of localStorage
2. No console warnings about deprecated storage functions
3. All CRUD operations work correctly
4. Loading states and error handling work properly
5. Authentication and access control function as expected
6. Data persists correctly across browser sessions
7. Performance is acceptable (no unnecessary API calls)

## 🔧 Usage Examples

### Before (localStorage)
```javascript
import { load, save } from '../utils/storage';

const students = load('students', []);
save('students', updatedStudents);
```

### After (Server Hooks)
```javascript
import { useStudents } from '../hooks';

const { students, loading, error, addStudent, updateStudent } = useStudents();
```

### UI State (Still localStorage)
```javascript
import { getUIState, setUIState, UI_KEYS } from '../utils/uiStorage';

const isDarkMode = getUIState(UI_KEYS.DARK_MODE, false);
setUIState(UI_KEYS.DARK_MODE, true);
```
