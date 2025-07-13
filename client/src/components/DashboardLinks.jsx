// DashboardLinks.jsx - Centralized navigation links for different user roles

export const volunteerLinks = [
  {
    path: '/volunteer/dashboard',
    label: 'Home',
    icon: '🏠'
  },
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
    path: '/admin/dashboard',
    label: 'Home',
    icon: '🏠'
  },
  {
    path: '/admin/requests',
    label: 'Requests',
    icon: '📋'
  },
  {
    path: '/admin/applications',
    label: 'Applications',
    icon: '📝'
  },
  {
    path: '/admin/students',
    label: 'Students',
    icon: '👥'
  },
  {
    path: '/admin/reports',
    label: 'Reports',
    icon: '📊'
  },
  {
    path: '/admin/infra/requests',
    label: 'Infrastructure',
    icon: '🏗️'
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