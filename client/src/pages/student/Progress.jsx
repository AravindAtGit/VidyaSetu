import React from 'react';
import './StudentPages.css';

const Progress = () => {
  return (
    <div className="student-page">
      <div className="page-header">
        <h1>My Progress</h1>
        <p>Track your learning progress and achievements</p>
      </div>
      
      <div className="page-content">
        <div className="placeholder-content">
          <div className="placeholder-icon">📊</div>
          <h2>My Progress</h2>
          <p>This page will show your learning progress, achievements, and performance analytics.</p>
          <div className="feature-list">
            <h3>Coming Features:</h3>
            <ul>
              <li>Overall academic progress tracking</li>
              <li>Subject-wise performance analysis</li>
              <li>Attendance and participation records</li>
              <li>Assignment and test scores</li>
              <li>Progress charts and visualizations</li>
              <li>Goal setting and achievement tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress; 