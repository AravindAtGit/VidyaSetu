export const load = (key, fallback = []) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (error) {
    console.error(`Error loading key '${key}' from localStorage:`, error);
    return fallback;
  }
};

export const save = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving key '${key}' to localStorage:`, error);
    if (error.name === 'QuotaExceededError') {
      alert("LocalStorage quota exceeded. Please clear some data.");
    }
  }
};

// Keys: students, videos, pdfs, quizzes, quizResults, virtualClasses
