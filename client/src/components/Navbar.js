import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logoutUser } from '../utils/auth';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const toggleAuthDropdown = () => {
    setShowAuthDropdown(!showAuthDropdown);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            VidyaSetu
          </Link>
        </div>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/about" className="navbar-link">About</Link>
          <Link to="/how-to-participate" className="navbar-link">How to Participate</Link>
          <Link to="/contribute" className="navbar-link">Contribute</Link>
          <Link to="/infra-requests" className="navbar-link">Infrastructure</Link>
        </div>

        <div className="navbar-auth">
          {user ? (
            <div className="user-section">
              <span className="user-name">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
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

export default Navbar; 