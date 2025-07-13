import React from 'react';
import './AdminPages.css';

const Requests = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Volunteer Requests</h1>
        <p>Manage volunteer requests from your school</p>
      </div>
      
      <div className="page-content">
        <div className="placeholder-content">
          <div className="placeholder-icon">📋</div>
          <h2>Volunteer Requests</h2>
          <p>This page will show all volunteer requests submitted by your school and students.</p>
          <div className="feature-list">
            <h3>Coming Features:</h3>
            <ul>
              <li>View all volunteer requests</li>
              <li>Filter requests by subject and urgency</li>
              <li>Approve or reject volunteer applications</li>
              <li>Assign volunteers to specific requests</li>
              <li>Track request status and progress</li>
              <li>Generate request reports</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests; 