import React from 'react';
import './StudentDashboard.css';

const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Welcome to your learning journey with VidyaSetu</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Courses Enrolled</h3>
          <p className="stat-number">5</p>
          <p className="stat-change">2 active courses</p>
        </div>
        
        <div className="stat-card">
          <h3>Hours Studied</h3>
          <p className="stat-number">24</p>
          <p className="stat-change">This week</p>
        </div>
        
        <div className="stat-card">
          <h3>Assignments</h3>
          <p className="stat-number">8</p>
          <p className="stat-change">3 pending</p>
        </div>
        
        <div className="stat-card">
          <h3>Progress</h3>
          <p className="stat-number">78%</p>
          <p className="stat-change">+5% this week</p>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="content-section">
          <h2>My Courses</h2>
          <div className="course-list">
            <div className="course-item">
              <div className="course-icon">📐</div>
              <div className="course-details">
                <h4>Mathematics</h4>
                <p>Advanced Algebra and Geometry</p>
                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '75%'}}></div>
                  </div>
                  <span>75% Complete</span>
                </div>
              </div>
            </div>
            
            <div className="course-item">
              <div className="course-icon">🔬</div>
              <div className="course-details">
                <h4>Science</h4>
                <p>Physics and Chemistry Basics</p>
                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '60%'}}></div>
                  </div>
                  <span>60% Complete</span>
                </div>
              </div>
            </div>
            
            <div className="course-item">
              <div className="course-icon">📚</div>
              <div className="course-details">
                <h4>English Literature</h4>
                <p>Classic Novels and Poetry</p>
                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '90%'}}></div>
                  </div>
                  <span>90% Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="content-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">Continue Learning</button>
            <button className="action-btn">View Assignments</button>
            <button className="action-btn">Ask Questions</button>
            <button className="action-btn">Download Resources</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 