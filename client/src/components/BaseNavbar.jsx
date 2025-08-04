import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';
import { getUser, logoutUser } from '../utils/auth';
import './BaseNavbar.css';

const BaseNavbar = ({ menuConfig = [], showAuth = true, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    } else {
      await logoutUser();
      navigate('/');
    }
  };

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleAuthDropdown = () => {
    setShowAuthDropdown(!showAuthDropdown);
  };

  const renderMenuItems = () => {
    return menuConfig.map((item, index) => {
      if (item.type === 'dropdown') {
        // Transform menu items for DropdownMenu component
        const dropdownItems = item.items?.map(menuItem => ({
          text: menuItem.label,
          href: menuItem.path,
          icon: menuItem.icon || null,
          onClick: () => {
            if (menuItem.path) {
              navigate(menuItem.path);
            }
          }
        })) || [];

        return (
          <DropdownMenu
            key={index}
            label={item.label}
            icon={item.icon}
            items={dropdownItems}
            ariaLabel={`${item.label} menu`}
            className="base-navbar-dropdown"
          />
        );
      } else {
        // Simple link
        return (
          <Link
            key={index}
            to={item.path}
            className="base-navbar-link"
            onClick={() => setIsOpen(false)} // Close mobile menu on link click
          >
            {item.icon && <span className="nav-icon">{item.icon}</span>}
            <span className="nav-text">{item.label}</span>
          </Link>
        );
      }
    });
  };

  return (
    <nav className="base-navbar">
      <div className="base-navbar-container">
        {/* Brand Logo */}
        <div className="navbar-logo-container">
          <Link to="/" className="brand-link">
            <span className="brand-icon navbar-logo">🎓</span>
            <span className="brand-text">VidyaSetu</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle (Burger Button) */}
        <button 
          className="base-navbar-toggle" 
          onClick={toggleMobileMenu}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger ${isOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isOpen ? 'active' : ''}`}></span>
        </button>

        {/* Flex Wrapper for Menu and Auth */}
        <div className={`base-navbar-content ${isOpen ? 'mobile-active' : ''}`}>
          {/* Navigation Menu */}
          <div className="base-navbar-menu">
            {renderMenuItems()}
          </div>

          {/* Right-aligned Auth/Profile Area */}
          {showAuth && (
            <div className="navbar-user-section" style={{ marginLeft: 'auto' }}>
              {user ? (
                <div className="user-section">
                  <span className="user-name">Welcome, {user.name}</span>
                  <button onClick={handleLogout} className="logout-btn">
                    <span className="nav-icon">🚪</span>
                    <span className="nav-text">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="auth-dropdown">
                  <button 
                    onClick={toggleAuthDropdown} 
                    className="auth-dropdown-btn"
                    aria-expanded={showAuthDropdown}
                    aria-label="Authentication menu"
                  >
                    Get Started ▼
                  </button>
                  {showAuthDropdown && (
                    <div className="auth-dropdown-menu">
                      <div className="auth-section">
                        <h4>Login</h4>
                        <Link 
                          to="/login/school" 
                          className="auth-dropdown-link"
                          onClick={() => setShowAuthDropdown(false)}
                        >
                          Login as School
                        </Link>
                        <Link 
                          to="/login/student" 
                          className="auth-dropdown-link"
                          onClick={() => setShowAuthDropdown(false)}
                        >
                          Login as Student
                        </Link>
                        <Link 
                          to="/login/volunteer" 
                          className="auth-dropdown-link"
                          onClick={() => setShowAuthDropdown(false)}
                        >
                          Login as Volunteer
                        </Link>
                      </div>
                      <div className="auth-section">
                        <h4>Register</h4>
                        <Link 
                          to="/register/school" 
                          className="auth-dropdown-link"
                          onClick={() => setShowAuthDropdown(false)}
                        >
                          Register as School
                        </Link>
                        <Link 
                          to="/register/volunteer" 
                          className="auth-dropdown-link"
                          onClick={() => setShowAuthDropdown(false)}
                        >
                          Register as Volunteer
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BaseNavbar;
