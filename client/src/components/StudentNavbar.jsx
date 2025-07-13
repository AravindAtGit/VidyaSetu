import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { studentLinks } from './DashboardLinks';
import { logoutUser } from '../utils/auth';
import './Navbar.css';

const StudentNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar student-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/student/dashboard" className="brand-link">
            <span className="brand-icon">🎓</span>
            <span className="brand-text">VidyaSetu</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          {studentLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-text">{link.label}</span>
            </Link>
          ))}
          
          <button onClick={handleLogout} className="nav-link logout-btn">
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
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