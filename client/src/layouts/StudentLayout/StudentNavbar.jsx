import { getUIState, UI_KEYS } from '../../utils/uiStorage';

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../utils/auth';
import './StudentNavbar.css';

const StudentNavbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = async () => {
    await logoutUser();
    navigate('/'); // Redirect to landing page
  };

  return (
    <nav className="student-navbar">
      <div className="student-navbar-container">
        <div className="navbar-logo-container">
          <Link to="/student/dashboard" className="student-navbar-logo navbar-logo">
            VidyaSetu Student
          </Link>
        </div>
        
        <div className="student-navbar-menu">
          <Link to="/student/dashboard" className="student-navbar-link">
            Dashboard
          </Link>
          <Link to="/student/courses" className="student-navbar-link">
            My Courses
          </Link>
          <Link to="/student/progress" className="student-navbar-link">
            Progress
          </Link>
          <Link to="/student/resources" className="student-navbar-link">
            Resources
          </Link>
        </div>

        <div className="navbar-user-section" style={{ marginLeft: 'auto' }}>
          <Link to="/student/profile" className="student-navbar-link">
            <span className="student-navbar-icon">👤</span>
            <span className="nav-text">Profile</span>
          </Link>
          <button onClick={handleLogout} className="student-navbar-link logout-btn">
            <span className="student-navbar-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar; 