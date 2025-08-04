// DashboardLinks.jsx - Centralized navigation links for different user roles

export const volunteerLinks = [
  {
    path: '/volunteer/applications',
    label: 'My Applications'
  },
  {
    path: '/volunteer/history',
    label: 'History'
  }
];

export const studentLinks = [
  {
    path: '/student/dashboard',
    label: 'Home'
  },
  {
    path: '/student/my-classes',
    label: 'My Classes'
  },
  {
    path: '/student/resources',
    label: 'Resources'
  },
  {
    path: '/student/progress',
    label: 'Progress'
  }
];

export const adminLinks = [
  {
    path: '/school/dashboard',
    label: 'Dashboard'
  },
  // Infrastructure Management
  {
    path: '/school/requests',
    label: 'Infra Requests'
  },
  {
    path: '/school/applications',
    label: 'Applications'
  },
  {
    path: '/school/history',
    label: 'History'
  },
  // Student Management
  {
    path: '/school/students',
    label: 'Students'
  },
  // Educational Content
  {
    path: '/school/upload',
    label: 'Upload Content'
  },
  {
    path: '/school/quizzes',
    label: 'Quizzes'
  },
  {
    path: '/school/quiz-results',
    label: 'Quiz Results'
  },
  {
    path: '/school/virtual-classes',
    label: 'Virtual Classes'
  },
  // Reports
  {
    path: '/school/reports',
    label: 'Reports'
  }
];

// Helper function to get links by role
export const getLinksByRole = (role) => {
  switch (role) {
    case 'volunteer':
      return volunteerLinks;
    case 'student':
      return studentLinks;
    case 'school':
      return adminLinks;
    default:
      return [];
  }
}; 