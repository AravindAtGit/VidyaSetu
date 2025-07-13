export const getUser = () => JSON.parse(localStorage.getItem('user'));
export const saveUser = user => localStorage.setItem('user', JSON.stringify(user));
export const clearUser = () => localStorage.removeItem('user');
export const getRole = () => (getUser() || {}).role;

// Backend logout function
export const logoutUser = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearUser();
  }
};
