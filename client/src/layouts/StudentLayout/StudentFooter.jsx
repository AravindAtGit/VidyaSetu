import React from 'react';
import './StudentFooter.css';

const StudentFooter = () => {
  return (
    <footer className="student-footer">
      <div className="student-footer-container">
        <div className="student-footer-content">
          <div className="student-footer-section">
            <h3>VidyaSetu Student Portal</h3>
            <p>Access educational resources and track your learning progress</p>
          </div>
          
          <div className="student-footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/student/dashboard">Dashboard</a></li>
              <li><a href="/student/courses">My Courses</a></li>
              <li><a href="/student/progress">Progress</a></li>
              <li><a href="/student/resources">Resources</a></li>
            </ul>
          </div>
          
          <div className="student-footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="/student/help">Help Center</a></li>
              <li><a href="/student/contact">Contact Support</a></li>
              <li><a href="/student/profile">My Profile</a></li>
            </ul>
          </div>
        </div>
        
        <div className="student-footer-bottom">
          <p>&copy; 2024 VidyaSetu Student Portal. All rights reserved.</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </footer>
  );
};

export default StudentFooter; 