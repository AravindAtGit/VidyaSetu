import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { adminLinks } from '../../components/DashboardLinks';
import { logoutUser } from '../../utils/auth';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-navbar-brand">
          <Link to="/admin/dashboard" className="admin-navbar-logo">
            <span className="brand-icon">🎓</span>
            <span className="brand-text">VidyaSetu Admin</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className={`admin-navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {adminLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`admin-navbar-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-text">{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="admin-navbar-user">
          <span className="admin-user-name">Welcome, {user?.name || 'Admin'}</span>
          <button onClick={handleLogout} className="admin-logout-btn">
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

export default AdminNavbar; 