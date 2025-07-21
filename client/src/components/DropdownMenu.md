# DropdownMenu Component

A fully accessible, reusable dropdown menu component built for navbar integration with semantic HTML, ARIA attributes, keyboard navigation, and smooth CSS transitions.

## Features

✅ **Semantic HTML Structure**
- Uses proper `button` toggler with `ul > li > a` menu structure
- Supports both button actions and link navigation

✅ **ARIA Compliance**
- `aria-expanded` and `aria-controls` attributes
- Proper `role` attributes for menu accessibility
- Screen reader friendly labels

✅ **Keyboard Navigation**
- `Escape` key closes the dropdown
- `Arrow Down/Up` cycles through menu items
- `Enter/Space` activates menu items
- `Tab` closes dropdown and moves to next element

✅ **Smooth Animations**
- CSS transform and opacity transitions
- Hover and focus state animations
- Configurable animation preferences

✅ **Responsive Design**
- Mobile-friendly responsive breakpoints
- Supports high contrast and reduced motion preferences
- Dark theme support

## API Reference

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | ✅ | Text displayed on the dropdown toggle button |
| `icon` | `string\|ReactNode` | ❌ | Icon to display before the label (emoji or React component) |
| `items` | `Array<MenuItem>` | ✅ | Array of menu items to display |
| `ariaLabel` | `string` | ❌ | Custom ARIA label for accessibility (defaults to "{label} menu") |
| `className` | `string` | ❌ | Additional CSS class names to apply |

### MenuItem Object

```typescript
interface MenuItem {
  icon?: string | ReactNode;    // Icon for the menu item
  text: string;                 // Display text
  onClick?: () => void;         // Click handler for button items
  href?: string;                // URL for link items
  external?: boolean;           // Whether link opens in new tab
  disabled?: boolean;           // Whether item is disabled
}
```

## Basic Usage

```jsx
import DropdownMenu from './components/DropdownMenu';

const MyComponent = () => {
  const menuItems = [
    {
      icon: '🏠',
      text: 'Dashboard',
      href: '/dashboard'
    },
    {
      icon: '⚙️',
      text: 'Settings',
      onClick: () => console.log('Settings clicked')
    },
    {
      icon: '🚪',
      text: 'Logout',
      onClick: handleLogout
    }
  ];

  return (
    <DropdownMenu
      label="Account"
      icon="👤"
      items={menuItems}
      ariaLabel="User account menu"
    />
  );
};
```

## Integration Examples

### 1. Admin Navbar Integration

```jsx
import DropdownMenu from './DropdownMenu';

const AdminNavbar = () => {
  const adminTools = [
    { icon: '🔧', text: 'System Settings', href: '/admin/settings' },
    { icon: '👥', text: 'User Management', href: '/admin/users' },
    { icon: '📊', text: 'Analytics', href: '/admin/analytics' }
  ];

  return (
    <nav className="admin-navbar">
      {/* Other navbar items */}
      <DropdownMenu
        label="Admin Tools"
        icon="🛠️"
        items={adminTools}
        ariaLabel="Administrator tools menu"
      />
    </nav>
  );
};
```

### 2. Student Navbar Integration

```jsx
const StudentNavbar = () => {
  const resources = [
    { icon: '📚', text: 'Study Materials', href: '/student/materials' },
    { icon: '📝', text: 'Assignments', href: '/student/assignments' },
    { icon: '🎯', text: 'Quizzes', href: '/student/quizzes' }
  ];

  return (
    <nav className="navbar student-navbar">
      {/* Other navbar items */}
      <DropdownMenu
        label="Resources"
        icon="📚"
        items={resources}
        ariaLabel="Student resources menu"
      />
    </nav>
  );
};
```

### 3. Public Navbar Integration

```jsx
const PublicNavbar = () => {
  const authItems = [
    { icon: '🏫', text: 'Login as School', href: '/login/school' },
    { icon: '👨‍🎓', text: 'Login as Student', href: '/login/student' },
    { icon: '🙋‍♀️', text: 'Login as Volunteer', href: '/login/volunteer' }
  ];

  return (
    <nav className="navbar">
      {/* Other navbar items */}
      <DropdownMenu
        label="Get Started"
        icon="🚪"
        items={authItems}
        ariaLabel="Login options menu"
      />
    </nav>
  );
};
```

## Keyboard Navigation Guide

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Opens dropdown when closed, activates item when focused |
| `Arrow Down` | Opens dropdown or moves to next item |
| `Arrow Up` | Moves to previous item (cycles to last when at first) |
| `Escape` | Closes dropdown and returns focus to toggle button |
| `Tab` | Closes dropdown and moves focus to next element |

## Styling

The component includes comprehensive CSS with:

- **Smooth transitions** using `cubic-bezier` easing
- **Hover and focus states** with visual feedback
- **Responsive breakpoints** for mobile devices
- **Accessibility support** for high contrast and reduced motion
- **Theme support** for dark mode

### Custom Styling

You can override styles by targeting these CSS classes:

```css
/* Main container */
.dropdown-menu { }

/* Toggle button */
.dropdown-toggle { }

/* Dropdown menu list */
.dropdown-menu-list { }

/* Menu items */
.dropdown-menu-item { }

/* Icons and text */
.dropdown-icon { }
.item-icon { }
.item-text { }
```

## Accessibility Features

- **Screen Reader Support**: Proper ARIA attributes and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast Mode**: Enhanced visibility for users with vision impairments  
- **Reduced Motion**: Respects user's motion preferences
- **Focus Management**: Proper focus handling and visual indicators

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Considerations

- Uses React refs for efficient DOM access
- Event listeners are properly cleaned up
- CSS transitions are GPU-accelerated
- Minimal re-renders through proper state management

## Common Patterns

### User Account Menu
```jsx
const userMenuItems = [
  { icon: '👤', text: 'Profile', href: '/profile' },
  { icon: '⚙️', text: 'Settings', href: '/settings' },
  { icon: '🚪', text: 'Logout', onClick: handleLogout }
];
```

### Navigation Menu
```jsx
const navItems = [
  { icon: '🏠', text: 'Home', href: '/' },
  { icon: '📊', text: 'Dashboard', href: '/dashboard' },
  { icon: '📋', text: 'Reports', href: '/reports' }
];
```

### Action Menu
```jsx
const actionItems = [
  { icon: '➕', text: 'New Item', onClick: () => createNew() },
  { icon: '📤', text: 'Export', onClick: () => exportData() },
  { icon: '🗑️', text: 'Delete', onClick: () => deleteItem(), disabled: !canDelete }
];
```
