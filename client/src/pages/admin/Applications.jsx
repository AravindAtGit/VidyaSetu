import React from 'react';
import './AdminPages.css';

const Applications = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Volunteer Applications</h1>
        <p>Review and manage volunteer applications</p>
      </div>
      
      <div className="page-content">
        <div className="placeholder-content">
          <div className="placeholder-icon">📝</div>
          <h2>Volunteer Applications</h2>
          <p>This page will show all volunteer applications submitted to your school.</p>
          <div className="feature-list">
            <h3>Coming Features:</h3>
            <ul>
              <li>View all volunteer applications</li>
              <li>Review volunteer profiles and credentials</li>
              <li>Approve or reject applications</li>
              <li>Schedule interviews with volunteers</li>
              <li>Send notifications to applicants</li>
              <li>Track application processing time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications; 