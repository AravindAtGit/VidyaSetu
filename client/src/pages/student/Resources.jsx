import React from 'react';
import './StudentPages.css';

const Resources = () => {
  return (
    <div className="student-page">
      <div className="page-header">
        <h1>Learning Resources</h1>
        <p>Access educational materials and study resources</p>
      </div>
      
      <div className="page-content">
        <div className="placeholder-content">
          <div className="placeholder-icon">📖</div>
          <h2>Learning Resources</h2>
          <p>This page will provide access to educational materials and study resources.</p>
          <div className="feature-list">
            <h3>Coming Features:</h3>
            <ul>
              <li>Download study materials and notes</li>
              <li>Access video lectures and tutorials</li>
              <li>Practice tests and quizzes</li>
              <li>Reference books and guides</li>
              <li>Interactive learning tools</li>
              <li>Subject-wise resource organization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources; 