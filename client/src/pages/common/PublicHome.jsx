import React from 'react';
import { Link } from 'react-router-dom';
import { getUser, clearUser } from '../../utils/auth';
import '../volunteer/VolunteerPages.css';

const PublicHome = () => {
  const user = getUser();

  const handleClearSession = () => {
    clearUser();
    window.location.reload();
  };

  return (
    <div className="home">
      {/* Generic public hero/banner */}
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
          className="debug-clear-btn"
          style={{ 
            marginTop: '1rem', 
            padding: '0.5rem 1rem', 
            background: '#ff6b6b', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer'
          }}
        >
          Clear Session (Debug)
        </button>
      </div>

      {/* Role-specific conditional blocks */}
      {user?.role === 'volunteer' && (
        <div className="volunteer-page">
          <div className="page-header">
            <h1>Volunteer Dashboard</h1>
            <p>Welcome to your volunteer management center</p>
          </div>
          
          <div className="page-content">
            <div className="placeholder-content">
              <div className="placeholder-icon">🎓</div>
              <h2>Volunteer Dashboard</h2>
              <p>This is your central hub for managing volunteer activities and opportunities.</p>
              <div className="feature-list">
                <h3>Coming Features:</h3>
                <ul>
                  <li>Overview of active applications</li>
                  <li>Upcoming volunteer sessions</li>
                  <li>Recent activity and notifications</li>
                  <li>Quick access to browse requests</li>
                  <li>Performance statistics</li>
                  <li>Profile management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'student' && (
        <div className="student-section">
          <div className="page-header">
            <h1>Student Dashboard</h1>
            <p>Welcome to your learning center</p>
          </div>
          <div className="page-content">
            <div className="placeholder-content">
              <h2>Student Dashboard</h2>
              <p>Your personalized learning hub.</p>
              <div className="feature-list">
                <h3>Coming Features:</h3>
                <ul>
                  <li>My Classes</li>
                  <li>Progress Tracking</li>
                  <li>Resources</li>
                  <li>Assignments</li>
                  <li>Study Schedule</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'school' && (
        <div className="school-section">
          <div className="page-header">
            <h1>School Dashboard</h1>
            <p>Welcome to your school management center</p>
          </div>
          <div className="page-content">
            <div className="placeholder-content">
              <h2>School Dashboard</h2>
              <p>Manage your school's volunteer programs.</p>
              <div className="feature-list">
                <h3>Coming Features:</h3>
                <ul>
                  <li>Student Management</li>
                  <li>Volunteer Requests</li>
                  <li>Class Scheduling</li>
                  <li>Reports and Analytics</li>
                  <li>Communication Tools</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'admin' && (
        <div className="admin-section">
          <div className="page-header">
            <h1>Admin Dashboard</h1>
            <p>Welcome to the administration center</p>
          </div>
          <div className="page-content">
            <div className="placeholder-content">
              <h2>Admin Dashboard</h2>
              <p>System administration and oversight.</p>
              <div className="feature-list">
                <h3>Coming Features:</h3>
                <ul>
                  <li>User Management</li>
                  <li>System Reports</li>
                  <li>Application Reviews</li>
                  <li>Configuration Settings</li>
                  <li>Monitoring and Logs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicHome;
