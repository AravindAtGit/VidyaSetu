import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../utils/auth';
import logo from '../assets/logo.png';
import './Navbar.css';

const StudentNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const closeProfile = () => setIsProfileOpen(false);

  return (
    <nav className="navbar student-navbar">
      <div className="navbar-container">
        <div className="navbar-logo-container">
          <Link to="/student/dashboard" className="brand-link">
            <img src={logo} alt="VidyaSetu Student Dashboard logo" className="brand-logo navbar-logo" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/student/dashboard" className="nav-link">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </Link>
          
          {/* Learning Dropdown */}
          <div className="dropdown-container">
            <button className="nav-link dropdown-btn" aria-haspopup="true" aria-expanded="false">
              <span className="nav-icon">📚</span>
              <span className="nav-text">Learning</span>
            </button>
            <div className="dropdown-menu" role="menu">
              <Link to="/student/my-classes" className="dropdown-link" role="menuitem" onClick={closeProfile}>
                <span className="nav-icon">📖</span>
                My Classes
              </Link>
              <Link to="/student/resources" className="dropdown-link" role="menuitem" onClick={closeProfile}>
                <span className="nav-icon">📚</span>
                Resources
              </Link>
              <Link to="/student/quizzes" className="dropdown-link" role="menuitem" onClick={closeProfile}>
                <span className="nav-icon">❓</span>
                Quizzes
              </Link>
            </div>
          </div>
          
          <Link to="/student/progress" className="nav-link">
            <span className="nav-icon">📊</span>
            <span className="nav-text">Progress</span>
          </Link>
        </div>
        
        {/* User Section */}
        <div className="navbar-user-section" style={{ marginLeft: 'auto' }}>
          {/* Profile Link */}
          <Link to="/student/profile" className="nav-link">
            <span className="nav-icon">👤</span>
            <span className="nav-text">Profile</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar; 