export const getUser = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Return null if no user is stored
  if (!user) {
    return null;
  }
  
  // Ensure required core fields are present with fallback defaults
  const userWithDefaults = {
    // Core required fields
    name: user.name || 'Anonymous User',
    email: user.email || '',
    role: user.role || 'user',
    
    // Preserve all existing custom fields
    ...user,
    
    // Re-apply core fields to ensure they override any undefined/null values in user object
    name: user.name || 'Anonymous User',
    email: user.email || '',
    role: user.role || 'user'
  };
  
  return userWithDefaults;
};
export const saveUser = user => localStorage.setItem('user', JSON.stringify(user));
export const clearUser = () => localStorage.removeItem('user');
export const getRole = () => (getUser() || {}).role;

// Role-specific field validation with defaults
export const getUserWithRoleDefaults = () => {
  const user = getUser();
  
  if (!user) {
    return null;
  }
  
  // Apply role-specific defaults based on user role
  switch (user.role?.toLowerCase()) {
    case 'student':
      return {
        ...user,
        class: user.class || '',
        rollNumber: user.rollNumber || user.roll || '',
        studentId: user.studentId || user.id || '',
        school: user.school || '',
        gradeLevel: user.gradeLevel || '',
        dateOfBirth: user.dateOfBirth || '',
        phoneNumber: user.phoneNumber || ''
      };
      
    case 'volunteer':
      return {
        ...user,
        expertiseAreas: user.expertiseAreas || [],
        skills: user.skills || [],
        availability: user.availability || '',
        volunteerId: user.volunteerId || user.id || '',
        phoneNumber: user.phoneNumber || '',
        organization: user.organization || '',
        yearsOfExperience: user.yearsOfExperience || '',
        bio: user.bio || '',
        joinDate: user.joinDate || user.createdAt || ''
      };
      
    case 'school':
      return {
        ...user,
        schoolName: user.schoolName || '',
        totalStudents: user.totalStudents || '',
        address: user.address || '',
        contactNumber: user.contactNumber || '',
        schoolCode: user.schoolCode || user.code || '',
        principalName: user.principalName || '',
        establishedYear: user.establishedYear || '',
        website: user.website || ''
      };
      
    default:
      return user;
  }
};

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
