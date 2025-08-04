// navConfig.js - Centralized navigation configuration by role

const navConfig = {
  public: [
    {
      label: 'Home',
      type: 'link',
      icon: '🏠',
      path: '/'
    },
    {
      label: 'About',
      type: 'link', 
      icon: 'ℹ️',
      path: '/about'
    },
    {
      label: 'Contact',
      type: 'link',
      icon: '📧',
      path: '/contact'
    }
  ],

  volunteer: [
    {
      label: 'Dashboard',
      type: 'link',
      icon: '🏠',
      path: '/volunteer/dashboard'
    },
    {
      label: 'Contributions',
      type: 'dropdown',
      icon: '🔍',
      items: [
        { path: '/volunteer/applications', label: 'My Applications' },
        { path: '/volunteer/history', label: 'History' }
      ]
    }
  ],

  student: [
    {
      label: 'Dashboard',
      type: 'link',
      icon: '🏠',
      path: '/student/dashboard'
    },
    {
      label: 'Learning',
      type: 'dropdown',
      icon: '📚',
      items: [
        { path: '/student/my-classes', label: 'My Classes' },
        { path: '/student/resources', label: 'Resources' }
      ]
    },
    {
      label: 'Progress',
      type: 'link',
      icon: '📊',
      path: '/student/progress'
    }
  ],

  school: [
    {
      label: 'Dashboard',
      type: 'link',
      icon: '🏠',
      path: '/school/dashboard'
    },
    {
      label: 'Infrastructure',
      type: 'dropdown',
      icon: '🏗️',
      items: [
        { path: '/school/requests', label: 'Infra Requests' },
        { path: '/school/applications', label: 'Applications' },
        { path: '/school/history', label: 'History' }
      ]
    },
    {
      label: 'Students',
      type: 'link',
      icon: '👥',
      path: '/school/students'
    },
    {
      label: 'Content Management',
      type: 'dropdown',
      icon: '📚',
      items: [
        { path: '/school/upload', label: 'Upload Content' },
        { path: '/school/virtual-classes', label: 'Virtual Classes' }
      ]
    },
    {
      label: 'Assessment',
      type: 'dropdown',
      icon: '❓',
      items: [
        { path: '/school/quizzes', label: 'Quizzes' },
        { path: '/school/quiz-results', label: 'Quiz Results' }
      ]
    },
    {
      label: 'Reports',
      type: 'link',
      icon: '📈',
      path: '/school/reports'
    }
  ]
};

export default navConfig;
