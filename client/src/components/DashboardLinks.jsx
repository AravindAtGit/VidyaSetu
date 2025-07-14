// DashboardLinks.jsx - Centralized navigation links for different user roles

export const volunteerLinks = [
  {
    path: '/volunteer/browse-requests',
    label: 'Browse Requests',
    icon: '🔍'
  },
  {
    path: '/volunteer/my-applications',
    label: 'My Applications',
    icon: '📝'
  },
  {
    path: '/volunteer/history',
    label: 'History',
    icon: '📚'
  },
  {
    path: '/volunteer/infra/requests',
    label: 'Infrastructure',
    icon: '🏗️'
  },
  {
    path: '/volunteer/infra/my-applications',
    label: 'My Infra Apps',
    icon: '📋'
  }
];

export const studentLinks = [
  {
    path: '/student/dashboard',
    label: 'Home',
    icon: '🏠'
  },
  {
    path: '/student/my-classes',
    label: 'My Classes',
    icon: '📚'
  },
  {
    path: '/student/resources',
    label: 'Resources',
    icon: '📖'
  },
  {
    path: '/student/progress',
    label: 'Progress',
    icon: '📊'
  }
];

export const adminLinks = [
  {
    path: '/school/dashboard',
    label: 'Home',
    icon: '🏠'
  },
  {
    path: '/school/requests',
    label: 'Requests', // Renamed from 'Pending Requests'
    icon: '📋'
  },
  {
    path: '/school/history',
    label: 'History',
    icon: '📚'
  },
  {
    path: '/school/students',
    label: 'Students',
    icon: '👥'
  },
  {
    path: '/school/reports',
    label: 'Reports',
    icon: '📊'
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