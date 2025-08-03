import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUser, logoutUser } from '../utils/auth';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({
    student: false,
    request: false,
    content: false,
    reports: false,
    profile: false
  });
  const [dropdownTimeouts, setDropdownTimeouts] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setDropdownStates(prev => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}), // Close all
      [dropdown]: !prev[dropdown] // Toggle current
    }));
  };

  const closeAllDropdowns = () => {
    setDropdownStates({
      student: false,
      request: false,
      content: false,
      reports: false,
      profile: false
    });
  };

  const handleDropdownKeyDown = (event, dropdown) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        toggleDropdown(dropdown);
        break;
      case 'Escape':
        event.preventDefault();
        closeAllDropdowns();
        event.target.blur();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!dropdownStates[dropdown]) {
          toggleDropdown(dropdown);
        }
        break;
      default:
        break;
    }
  };

  const handleDropdownFocus = (dropdown) => {
    // Only open dropdown on focus if it's not already open
    setDropdownStates(prev => ({ ...prev, [dropdown]: true }));
  };

  const handleDropdownBlur = (event, dropdown) => {
    // Close dropdown if focus moves outside the dropdown container
    setTimeout(() => {
      try {
        const activeElement = document.activeElement;
        // Get the dropdown container more safely
        let dropdownContainer = null;
        
        // Try to find the closest dropdown container
        if (event.currentTarget && event.currentTarget.closest) {
          dropdownContainer = event.currentTarget.closest('.dropdown-container');
        }
        
        // If we can't find it or focus moved outside, close the dropdown
        if (!dropdownContainer || !dropdownContainer.contains(activeElement)) {
          setDropdownStates(prev => ({ ...prev, [dropdown]: false }));
        }
      } catch (error) {
        // If there's any error, just close the dropdown
        setDropdownStates(prev => ({ ...prev, [dropdown]: false }));
      }
    }, 150);
  };

  const handleLinkClick = (dropdown) => {
    // Close dropdown when a link is clicked
    setDropdownStates(prev => ({ ...prev, [dropdown]: false }));
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-navbar-brand">
          <Link to="/school/dashboard" className="admin-navbar-logo">
            <span className="brand-icon">🎓</span>
            <span className="brand-text">VidyaSetu Admin</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className={`admin-navbar-menu ${isMenuOpen ? 'active' : ''}`}>
<Link to="/school/dashboard" className="admin-navbar-link">Home</Link>
          
          {/* Student Management Dropdown */}
          <div className="dropdown-container">
            <button 
              className="admin-navbar-link dropdown-btn"
              aria-haspopup="true"
              aria-expanded={dropdownStates.student}
              aria-label="Student Management menu"
              type="button"
              onFocus={() => handleDropdownFocus('student')}
              onBlur={(e) => handleDropdownBlur(e, 'student')}
              onKeyDown={(e) => handleDropdownKeyDown(e, 'student')}
            >
              Student Management
            </button>
            <div className={`dropdown-menu ${dropdownStates.student ? 'open' : ''}`} role="menu" aria-label="Student Management options">
              <Link to="/school/students/add" className="dropdown-link" role="menuitem" tabIndex={dropdownStates.student ? 0 : -1} onClick={() => handleLinkClick('student')}>Add Student</Link>
              <Link to="/school/students" className="dropdown-link" role="menuitem" tabIndex={dropdownStates.student ? 0 : -1} onClick={() => handleLinkClick('student')}>Student List</Link>
            </div>
          </div>
          
          {/* Request Management Dropdown */}
          <div className="dropdown-container">
            <button 
              className="admin-navbar-link dropdown-btn"
              aria-haspopup="true"
              aria-expanded={dropdownStates.request}
              aria-label="Request Management menu"
              type="button"
              onFocus={() => handleDropdownFocus('request')}
              onBlur={(e) => handleDropdownBlur(e, 'request')}
              onKeyDown={(e) => handleDropdownKeyDown(e, 'request')}
            >
              Request Management
            </button>
            <div className={`dropdown-menu ${dropdownStates.request ? 'open' : ''}`} role="menu" aria-label="Request Management options">
              <Link to="/school/requests" className="dropdown-link" role="menuitem" tabIndex={dropdownStates.request ? 0 : -1} onClick={() => handleLinkClick('request')}>Infrastructure Requests</Link>
              <Link to="/school/history" className="dropdown-link" role="menuitem" tabIndex={dropdownStates.request ? 0 : -1} onClick={() => handleLinkClick('request')}>Request History</Link>
            </div>
          </div>
          
          {/* Content Management Dropdown */}
          <div className="dropdown-container">
            <button 
              className="admin-navbar-link dropdown-btn"
              aria-haspopup="true"
              aria-expanded={dropdownStates.content}
              aria-label="Content Management menu"
              type="button"
              onFocus={() => handleDropdownFocus('content')}
              onBlur={(e) => handleDropdownBlur(e, 'content')}
              onKeyDown={(e) => handleDropdownKeyDown(e, 'content')}
            >
              Content Management
            </button>
            <div className={`dropdown-menu ${dropdownStates.content ? 'open' : ''}`} role="menu" aria-label="Content Management options">
              <Link to="/school/upload" className="dropdown-link" role="menuitem" tabIndex={dropdownStates.content ? 0 : -1} onClick={() => handleLinkClick('content')}>Upload Recorded Classes</Link>
              <Link to="/school/upload" className="dropdown-link" role="menuitem" tabIndex={dropdownStates.content ? 0 : -1} onClick={() => handleLinkClick('content')}>Upload Materials</Link>
              <Link to="/school/quizzes" className="dropdown-link" role="menuitem" tabIndex={dropdownStates.content ? 0 : -1} onClick={() => handleLinkClick('content')}>Manage Quizzes</Link>
              <Link to="/school/virtual-classes" className="dropdown-link" role="menuitem" tabIndex={dropdownStates.content ? 0 : -1} onClick={() => handleLinkClick('content')}>Schedule Virtual Classes</Link>
            </div>
          </div>
          
          {/* Reports Dropdown */}
          <div className="dropdown-container">
            <button 
              className="admin-navbar-link dropdown-btn"
              aria-haspopup="true"
              aria-expanded={dropdownStates.reports}
              aria-label="Reports menu"
              type="button"
              onFocus={() => handleDropdownFocus('reports')}
              onBlur={(e) => handleDropdownBlur(e, 'reports')}
              onKeyDown={(e) => handleDropdownKeyDown(e, 'reports')}
            >
              Reports
            </button>
            <div className={`dropdown-menu ${dropdownStates.reports ? 'open' : ''}`} role="menu" aria-label="Reports options">
              <Link to="/school/reports" className="dropdown-link" role="menuitem" tabIndex={dropdownStates.reports ? 0 : -1} onClick={() => handleLinkClick('reports')}>Student Progress Report</Link>
              <Link to="/school/reports" className="dropdown-link" role="menuitem" tabIndex={dropdownStates.reports ? 0 : -1} onClick={() => handleLinkClick('reports')}>Request Fulfillment Report</Link>
            </div>
          </div>
          
          {/* Profile Dropdown */}
          <div className="dropdown-container">
            <button 
              className="admin-navbar-link dropdown-btn"
              aria-haspopup="true"
              aria-expanded={dropdownStates.profile}
              aria-label="Profile menu"
              type="button"
              onFocus={() => handleDropdownFocus('profile')}
              onBlur={(e) => handleDropdownBlur(e, 'profile')}
              onKeyDown={(e) => handleDropdownKeyDown(e, 'profile')}
            >
              Profile
            </button>
            <div className={`dropdown-menu ${dropdownStates.profile ? 'open' : ''}`} role="menu" aria-label="Profile options">
              <Link to="/school/settings" className="dropdown-link" role="menuitem" tabIndex={dropdownStates.profile ? 0 : -1} onClick={() => handleLinkClick('profile')}>Settings</Link>
              <Link to="/school/help" className="dropdown-link" role="menuitem" tabIndex={dropdownStates.profile ? 0 : -1} onClick={() => handleLinkClick('profile')}>Help & Support</Link>
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout} className="dropdown-link logout-link" role="menuitem" tabIndex={dropdownStates.profile ? 0 : -1}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar; 