import React from 'react';
import { Link } from 'react-router-dom';
import { clearUser } from '../../utils/auth';
import './Home.css';

const PublicHome = () => {
  const handleClearSession = () => {
    clearUser();
    window.location.reload();
  };

  return (
    <div className="public-home">
      <div className="hero-section">
        <h1>Welcome to VidyaSetu</h1>
        <p>Connecting students with volunteer educators for better learning</p>
        <div className="cta-buttons">
          <Link to="/register/school" className="cta-btn primary">Register as School</Link>
          <Link to="/register/volunteer" className="cta-btn secondary">Become a Volunteer</Link>
        </div>
        <button 
          onClick={handleClearSession} 
          className="debug-btn"
        >
          Clear Session (Debug)
        </button>
      </div>
    </div>
  );
};

export default PublicHome; 
