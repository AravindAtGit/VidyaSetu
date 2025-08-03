import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logoutUser, getRole } from '../utils/auth';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();
  const userRole = getRole();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="VidyaSetu logo" className="brand-logo" />
          </Link>
        </div>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to="/about" className="navbar-link">About</Link>
          <Link to="/how-to-participate" className="navbar-link">How to Participate</Link>
          <Link to="/contribute" className="navbar-link">Contribute</Link>
          <Link to="/infra-requests" className="navbar-link">Infrastructure</Link>
          
          {/* Show volunteer-specific links only for logged-in volunteers */}
          {user && userRole === 'volunteer' && (
            <>
              <Link to="/volunteer/applications" className="navbar-link">
                My Applications
              </Link>
              <Link to="/volunteer/history" className="navbar-link">
                History
              </Link>
            </>
          )}

          {/* Add school-specific links */}
          {user && userRole === 'school' && (
            <>
              <Link to="/school/requests" className="navbar-link">
                Requests
              </Link>
              <Link to="/school/history" className="navbar-link">
                History
              </Link>
            </>
          )}
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
              <div className="auth-dropdown-btn">
                Get Started
              </div>
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

export default Navbar; 