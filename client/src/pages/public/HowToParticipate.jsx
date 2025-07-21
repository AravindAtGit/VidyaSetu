import React from 'react';
import './HowToParticipate.css';

const HowToParticipate = () => {
  return (
    <div className="participate-page">
      <div className="participate-card">
        <h1>How to Participate</h1>
        <p>
          VidyaSetu welcomes students, volunteers, and schools to join our mission. Here’s how you can get involved:
        </p>
        <div className="participate-section">
          <h2>For Students</h2>
          <ul>
            <li>Register for free and access learning resources.</li>
            <li>Join virtual classes and track your progress.</li>
            <li>Connect with volunteer educators for support.</li>
          </ul>
        </div>
        <div className="participate-section">
          <h2>For Volunteers</h2>
          <ul>
            <li>Sign up to teach, mentor, or contribute content.</li>
            <li>Help students learn and grow.</li>
            <li>Make a difference in your community.</li>
          </ul>
        </div>
        <div className="participate-section">
          <h2>For Schools</h2>
          <ul>
            <li>Register your school to manage students and volunteers.</li>
            <li>Track student progress and participation.</li>
            <li>Access reports and analytics.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HowToParticipate; 