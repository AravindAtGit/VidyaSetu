// Minimal localStorage utility for volatile UI state only
// This should only be used for temporary UI state like dark mode, preferences, etc.
// NOT for persistent data like students, content, quizzes

export const getUIState = (key, fallback = null) => {
  try {
    const value = localStorage.getItem(`ui_${key}`);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Error loading UI state '${key}':`, error);
    return fallback;
  }
};

export const setUIState = (key, value) => {
  try {
    localStorage.setItem(`ui_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving UI state '${key}':`, error);
  }
};

export const removeUIState = (key) => {
  try {
    localStorage.removeItem(`ui_${key}`);
  } catch (error) {
    console.error(`Error removing UI state '${key}':`, error);
  }
};

// Supported UI states
export const UI_KEYS = {
  DARK_MODE: 'darkMode',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
  LANGUAGE_PREFERENCE: 'languagePreference',
  TABLE_PAGE_SIZE: 'tablePageSize',
  NOTIFICATION_PREFERENCES: 'notificationPreferences'
};
