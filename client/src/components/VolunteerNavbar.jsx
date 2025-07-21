import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUser, logoutUser } from '../utils/auth';
import './Navbar.css';

const VolunteerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const toggleAuthDropdown = () => {
    setShowAuthDropdown(!showAuthDropdown);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <nav className="navbar volunteer-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            VidyaSetu
          </Link>
        </div>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            <span className="home-icon">🏠</span>
            Home
          </Link>
          <Link to="/about" className="navbar-link">About</Link>
          <Link to="/how-to-participate" className="navbar-link">How to Participate</Link>
          <Link to="/contribute" className="navbar-link">Contribute</Link>
          
          {/* Volunteer-specific links */}
          <Link to="/volunteer/browse-requests" className="navbar-link">
            <span className="nav-icon">🔍</span>
            Browse Requests
          </Link>
          <Link to="/volunteer/my-applications" className="navbar-link">
            <span className="nav-icon">📝</span>
            My Applications
          </Link>
          <Link to="/volunteer/history" className="navbar-link">
            <span className="nav-icon">📚</span>
            History
          </Link>
        </div>

        <div className="navbar-auth">
          {user ? (
            <div className="user-section">
              <span className="user-name">Welcome, {user.name}</span>
              
              {/* Profile Dropdown */}
              <div className="profile-dropdown">
                <button onClick={toggleProfileDropdown} className="profile-dropdown-btn">
                  Profile ▼
                </button>
                {showProfileDropdown && (
                  <div className="profile-dropdown-menu">
                    <Link to="/volunteer/settings" className="profile-dropdown-link">
                      <span className="nav-icon">⚙️</span>
                      Settings
                    </Link>
                    <Link to="/volunteer/help" className="profile-dropdown-link">
                      <span className="nav-icon">❓</span>
                      Help & FAQ
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="profile-dropdown-link logout-link">
                      <span className="nav-icon">🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="auth-dropdown">
              <button onClick={toggleAuthDropdown} className="auth-dropdown-btn">
                Get Started ▼
              </button>
              {showAuthDropdown && (
                <div className="auth-dropdown-menu">
                  <div className="auth-section">
                    <h4>Login</h4>
                    <Link to="/login/school" className="auth-dropdown-link">Login as School</Link>
                    <Link to="/login/student" className="auth-dropdown-link">Login as Student</Link>
                    <Link to="/login/volunteer" className="auth-dropdown-link">Login as Volunteer</Link>
                  </div>
                  <div className="auth-section">
                    <h4>Register</h4>
                    <Link to="/register/school" className="auth-dropdown-link">Register as School</Link>
                    <Link to="/register/volunteer" className="auth-dropdown-link">Register as Volunteer</Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default VolunteerNavbar; 