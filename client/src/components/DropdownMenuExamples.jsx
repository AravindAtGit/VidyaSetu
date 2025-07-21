import React from 'react';
import DropdownMenu from './DropdownMenu';

// Example usage for different navbar contexts

// Example 1: User Account Dropdown
export const UserAccountDropdown = ({ user, onLogout }) => {
  const userMenuItems = [
    {
      icon: '👤',
      text: 'Profile',
      onClick: () => console.log('Profile clicked'),
    },
    {
      icon: '⚙️',
      text: 'Settings',
      onClick: () => console.log('Settings clicked'),
    },
    {
      icon: '🚪',
      text: 'Logout',
      onClick: onLogout,
    }
  ];

  return (
    <DropdownMenu
      label={user?.name || 'Account'}
      icon="👤"
      items={userMenuItems}
      ariaLabel="User account menu"
      className="user-dropdown"
    />
  );
};

// Example 2: Navigation Menu Dropdown
export const NavigationDropdown = () => {
  const navItems = [
    {
      icon: '🏠',
      text: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: '📊',
      text: 'Analytics',
      href: '/analytics',
    },
    {
      icon: '📋',
      text: 'Reports',
      href: '/reports',
    },
    {
      icon: '👥',
      text: 'Users',
      href: '/users',
    }
  ];

  return (
    <DropdownMenu
      label="Menu"
      icon="☰"
      items={navItems}
      ariaLabel="Main navigation menu"
      className="nav-dropdown"
    />
  );
};

// Example 3: Language/Locale Selector
export const LanguageDropdown = ({ currentLanguage, onLanguageChange }) => {
  const languages = [
    {
      icon: '🇺🇸',
      text: 'English',
      onClick: () => onLanguageChange('en'),
    },
    {
      icon: '🇪🇸',
      text: 'Español',
      onClick: () => onLanguageChange('es'),
    },
    {
      icon: '🇫🇷',
      text: 'Français',
      onClick: () => onLanguageChange('fr'),
    },
    {
      icon: '🇩🇪',
      text: 'Deutsch',
      onClick: () => onLanguageChange('de'),
    }
  ];

  return (
    <DropdownMenu
      label={currentLanguage || 'Language'}
      icon="🌐"
      items={languages}
      ariaLabel="Language selection menu"
      className="language-dropdown"
    />
  );
};

// Example 4: Quick Actions Dropdown
export const QuickActionsDropdown = () => {
  const quickActions = [
    {
      icon: '➕',
      text: 'New Project',
      onClick: () => console.log('New project'),
    },
    {
      icon: '📄',
      text: 'New Document',
      onClick: () => console.log('New document'),
    },
    {
      icon: '👥',
      text: 'Invite User',
      onClick: () => console.log('Invite user'),
    },
    {
      icon: '📊',
      text: 'Generate Report',
      onClick: () => console.log('Generate report'),
      disabled: true, // Example of disabled item
    }
  ];

  return (
    <DropdownMenu
      label="Quick Actions"
      icon="⚡"
      items={quickActions}
      ariaLabel="Quick actions menu"
      className="quick-actions-dropdown"
    />
  );
};

// Example 5: Admin Tools Dropdown (for AdminNavbar)
export const AdminToolsDropdown = () => {
  const adminTools = [
    {
      icon: '🔧',
      text: 'System Settings',
      href: '/admin/settings',
    },
    {
      icon: '👥',
      text: 'User Management',
      href: '/admin/users',
    },
    {
      icon: '📊',
      text: 'Analytics Dashboard',
      href: '/admin/analytics',
    },
    {
      icon: '🔒',
      text: 'Security Logs',
      href: '/admin/security',
    },
    {
      icon: '🗄️',
      text: 'Database Admin',
      href: '/admin/database',
    }
  ];

  return (
    <DropdownMenu
      label="Admin Tools"
      icon="🛠️"
      items={adminTools}
      ariaLabel="Administrator tools menu"
      className="admin-tools-dropdown"
    />
  );
};

// Example 6: Student Resources Dropdown (for StudentNavbar)
export const StudentResourcesDropdown = () => {
  const resources = [
    {
      icon: '📚',
      text: 'Study Materials',
      href: '/student/materials',
    },
    {
      icon: '📝',
      text: 'Assignments',
      href: '/student/assignments',
    },
    {
      icon: '🎯',
      text: 'Quizzes',
      href: '/student/quizzes',
    },
    {
      icon: '💬',
      text: 'Discussion Forums',
      href: '/student/forums',
    },
    {
      icon: '📊',
      text: 'Progress Report',
      href: '/student/progress',
    }
  ];

  return (
    <DropdownMenu
      label="Resources"
      icon="📚"
      items={resources}
      ariaLabel="Student resources menu"
      className="student-resources-dropdown"
    />
  );
};

// Example integration in existing navbar:
/*
// In AdminNavbar.jsx, you could replace the user section with:
<UserAccountDropdown 
  user={user} 
  onLogout={handleLogout}
/>

// Add admin tools dropdown:
<AdminToolsDropdown />

// In StudentNavbar.jsx, you could add:
<StudentResourcesDropdown />

// In regular Navbar.js, you could replace the auth dropdown with:
<NavigationDropdown />
<LanguageDropdown currentLanguage="English" onLanguageChange={handleLanguageChange} />
*/
