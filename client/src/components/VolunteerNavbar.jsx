import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logoutUser } from '../utils/auth';
import logo from '../assets/logo.png';
import './Navbar.css';

const VolunteerNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const closeProfile = () => setIsProfileOpen(false);

  return (
    <nav className="navbar volunteer-navbar">
      <div className="navbar-container">
        <div className="navbar-logo-container">
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="VidyaSetu logo" className="brand-logo navbar-logo" />
          </Link>
        </div>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/about" className="navbar-link">About</Link>
          <Link to="/how-to-participate" className="navbar-link">How to Participate</Link>
          <Link to="/contribute" className="navbar-link">Contribute</Link>
          
          {/* Volunteer-specific links */}
          <Link to="/volunteer/applications" className="navbar-link">My Applications</Link>
          <Link to="/volunteer/history" className="navbar-link">History</Link>
        </div>

        <div className="navbar-user-section" style={{ marginLeft: 'auto' }}>
          {user ? (
            <Link to="/volunteer/profile" className="navbar-link">
              <span className="nav-icon">👤</span>
              <span className="nav-text">Profile</span>
            </Link>
          ) : (
            <div className="auth-dropdown">
              <button className="auth-dropdown-btn">
                Get Started
              </button>
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
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default VolunteerNavbar; 