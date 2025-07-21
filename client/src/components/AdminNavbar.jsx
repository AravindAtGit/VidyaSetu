import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUser, logoutUser } from '../utils/auth';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showRequestDropdown, setShowRequestDropdown] = useState(false);
  const [showContentDropdown, setShowContentDropdown] = useState(false);
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
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

  const toggleDropdown = (dropdownName) => {
    // Close all other dropdowns
    setShowStudentDropdown(false);
    setShowRequestDropdown(false);
    setShowContentDropdown(false);
    setShowReportsDropdown(false);
    setShowProfileDropdown(false);
    
    // Toggle the clicked dropdown
    switch (dropdownName) {
      case 'student':
        setShowStudentDropdown(!showStudentDropdown);
        break;
      case 'request':
        setShowRequestDropdown(!showRequestDropdown);
        break;
      case 'content':
        setShowContentDropdown(!showContentDropdown);
        break;
      case 'reports':
        setShowReportsDropdown(!showReportsDropdown);
        break;
      case 'profile':
        setShowProfileDropdown(!showProfileDropdown);
        break;
      default:
        break;
    }
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
          <Link to="/school/dashboard" className="admin-navbar-link">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </Link>
          
          {/* Student Management Dropdown */}
          <div className="dropdown-container">
            <button onClick={() => toggleDropdown('student')} className="admin-navbar-link dropdown-btn">
              <span className="nav-icon">👥</span>
              <span className="nav-text">Student Management ▼</span>
            </button>
            {showStudentDropdown && (
              <div className="dropdown-menu">
                <Link to="/school/students/add" className="dropdown-link">
                  <span className="nav-icon">➕</span>
                  Add Student
                </Link>
                <Link to="/school/students" className="dropdown-link">
                  <span className="nav-icon">📋</span>
                  Student List
                </Link>
              </div>
            )}
          </div>
          
          {/* Request Management Dropdown */}
          <div className="dropdown-container">
            <button onClick={() => toggleDropdown('request')} className="admin-navbar-link dropdown-btn">
              <span className="nav-icon">📋</span>
              <span className="nav-text">Request Management ▼</span>
            </button>
            {showRequestDropdown && (
              <div className="dropdown-menu">
                <Link to="/school/requests" className="dropdown-link">
                  <span className="nav-icon">🏗️</span>
                  Infrastructure Requests
                </Link>
                <Link to="/school/history" className="dropdown-link">
                  <span className="nav-icon">📚</span>
                  Request History
                </Link>
              </div>
            )}
          </div>
          
          {/* Content Management Dropdown */}
          <div className="dropdown-container">
            <button onClick={() => toggleDropdown('content')} className="admin-navbar-link dropdown-btn">
              <span className="nav-icon">📚</span>
              <span className="nav-text">Content Management ▼</span>
            </button>
            {showContentDropdown && (
              <div className="dropdown-menu">
                <Link to="/school/upload" className="dropdown-link">
                  <span className="nav-icon">📤</span>
                  Upload Recorded Classes
                </Link>
                <Link to="/school/upload" className="dropdown-link">
                  <span className="nav-icon">📄</span>
                  Upload Materials
                </Link>
                <Link to="/school/quizzes" className="dropdown-link">
                  <span className="nav-icon">❓</span>
                  Manage Quizzes
                </Link>
                <Link to="/school/virtual-classes" className="dropdown-link">
                  <span className="nav-icon">💻</span>
                  Schedule Virtual Classes
                </Link>
              </div>
            )}
          </div>
          
          {/* Reports Dropdown */}
          <div className="dropdown-container">
            <button onClick={() => toggleDropdown('reports')} className="admin-navbar-link dropdown-btn">
              <span className="nav-icon">📊</span>
              <span className="nav-text">Reports ▼</span>
            </button>
            {showReportsDropdown && (
              <div className="dropdown-menu">
                <Link to="/school/reports" className="dropdown-link">
                  <span className="nav-icon">📈</span>
                  Student Progress Report
                </Link>
                <Link to="/school/reports" className="dropdown-link">
                  <span className="nav-icon">📋</span>
                  Request Fulfillment Report
                </Link>
              </div>
            )}
          </div>
          
          {/* Profile Dropdown */}
          <div className="dropdown-container">
            <button onClick={() => toggleDropdown('profile')} className="admin-navbar-link dropdown-btn">
              <span className="nav-icon">👤</span>
              <span className="nav-text">Profile ▼</span>
            </button>
            {showProfileDropdown && (
              <div className="dropdown-menu">
                <Link to="/school/settings" className="dropdown-link">
                  <span className="nav-icon">⚙️</span>
                  Settings
                </Link>
                <Link to="/school/help" className="dropdown-link">
                  <span className="nav-icon">❓</span>
                  Help & Support
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-link logout-link">
                  <span className="nav-icon">🚪</span>
                  Logout
                </button>
              </div>
            )}
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