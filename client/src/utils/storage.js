// DEPRECATED: This file is deprecated and should not be used for new development
// Use server-side hooks instead: useContent, useQuizzes, useStudents, etc.
// For UI state only, use uiStorage.js

console.warn('DEPRECATED: storage.js is deprecated. Use server-side hooks or uiStorage.js for UI state.');

export const load = (key, fallback = []) => {
  console.warn(`DEPRECATED: load('${key}') - Use appropriate server-side hook instead`);
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (error) {
    console.error(`Error loading key '${key}' from localStorage:`, error);
    return fallback;
  }
};

export const save = (key, data) => {
  console.warn(`DEPRECATED: save('${key}') - Use appropriate server-side hook instead`);
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving key '${key}' to localStorage:`, error);
    if (error.name === 'QuotaExceededError') {
      alert("LocalStorage quota exceeded. Please clear some data.");
    }
  }
};

// DEPRECATED Keys: students, videos, pdfs, quizzes, quizResults, virtualClasses
// Use server-side hooks instead

