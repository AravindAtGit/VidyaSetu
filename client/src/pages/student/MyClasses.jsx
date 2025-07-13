import React from 'react';
import './StudentPages.css';

const MyClasses = () => {
  return (
    <div className="student-page">
      <div className="page-header">
        <h1>My Classes</h1>
        <p>View and manage your enrolled classes</p>
      </div>
      
      <div className="page-content">
        <div className="placeholder-content">
          <div className="placeholder-icon">📚</div>
          <h2>My Classes</h2>
          <p>This page will show all your enrolled classes and learning materials.</p>
          <div className="feature-list">
            <h3>Coming Features:</h3>
            <ul>
              <li>View all enrolled classes</li>
              <li>Access class materials and resources</li>
              <li>Track class progress and attendance</li>
              <li>Submit assignments and homework</li>
              <li>View class schedule and timings</li>
              <li>Communicate with teachers and volunteers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyClasses; 