import React from 'react';
import './VolunteerPages.css';

const BrowseRequests = () => {
  return (
    <div className="volunteer-page">
      <div className="page-header">
        <h1>Browse Requests</h1>
        <p>Find volunteer opportunities that match your skills</p>
      </div>
      
      <div className="page-content">
        <div className="placeholder-content">
          <div className="placeholder-icon">🔍</div>
          <h2>Browse Requests</h2>
          <p>This page will show available volunteer requests from schools and students.</p>
          <div className="feature-list">
            <h3>Coming Features:</h3>
            <ul>
              <li>Filter requests by subject, location, and time</li>
              <li>View detailed request information</li>
              <li>Apply for volunteer opportunities</li>
              <li>Save favorite requests</li>
              <li>Track application status</li>
              <li>Direct messaging with schools</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseRequests; 