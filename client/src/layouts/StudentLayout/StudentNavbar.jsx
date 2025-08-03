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
        <div className="student-navbar-brand">
          <Link to="/student/dashboard" className="student-navbar-logo">
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

        <div className="student-navbar-user">
          <span className="student-user-name">Welcome, {user?.name || 'Student'}</span>
          <button onClick={handleLogout} className="student-logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar; 