import React from 'react';
import { Link } from 'react-router-dom';
import { clearUser } from '../../utils/auth';

const PublicHome = () => {
  const handleClearSession = () => {
    clearUser();
    window.location.reload();
  };

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to VidyaSetu</h1>
        <p>Connecting students with volunteer educators for better learning</p>
        <div className="cta-buttons">
          <Link to="/register/school" className="cta-btn primary">Register as School</Link>
          <Link to="/register/volunteer" className="cta-btn secondary">Become a Volunteer</Link>
        </div>
        {/* Debug button - remove in production */}
        <button 
          onClick={handleClearSession} 
          style={{ 
            marginTop: '1rem', 
            padding: '0.5rem 1rem', 
            background: '#ff6b6b', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Session (Debug)
        </button>
      </div>
    </div>
  );
};

export default PublicHome; 
