import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [studentCount, setStudentCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch student count
      const studentResponse = await fetch('/api/school/students', {
        credentials: 'include',
      });
      if (studentResponse.ok) {
        const studentData = await studentResponse.json();
        setStudentCount(studentData.students.length);
      }

      // Fetch request count
      const requestResponse = await fetch('/api/school/infra/requests', {
        credentials: 'include',
      });
      if (requestResponse.ok) {
        const requestData = await requestResponse.json();
        setRequestCount(requestData.length);
      }

      // Fetch application count
      const applicationResponse = await fetch('/api/school/infra/applications', {
        credentials: 'include',
      });
      if (applicationResponse.ok) {
        const applicationData = await applicationResponse.json();
        setApplicationCount(applicationData.length);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>School Admin Dashboard</h1>
        <p>Welcome to the VidyaSetu School Management Panel</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'quick-actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('quick-actions')}
        >
          Quick Actions
        </button>
      </div>
      
      {activeTab === 'overview' && (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Total Students</h3>
              <p className="stat-number">{studentCount}</p>
              <p className="stat-change">Registered in your school</p>
            </div>
            
            <div className="stat-card">
              <h3>Infrastructure Requests</h3>
              <p className="stat-number">{requestCount}</p>
              <p className="stat-change">Active requests</p>
            </div>
            
            <div className="stat-card">
              <h3>Volunteer Applications</h3>
              <p className="stat-number">{applicationCount}</p>
              <p className="stat-change">Pending applications</p>
            </div>
            
            <div className="stat-card">
              <h3>Success Rate</h3>
              <p className="stat-number">85%</p>
              <p className="stat-change">Request fulfillment</p>
            </div>
          </div>
        </>
      )}

      {activeTab === 'quick-actions' && (
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">Add New Student</button>
            <button className="action-btn">Create Infrastructure Request</button>
            <button className="action-btn">Review Applications</button>
            <button className="action-btn">Generate Report</button>
            <button className="action-btn">Manage Resources</button>
            <button className="action-btn">View Analytics</button>
          </div>
        </div>
      )}
      
      <div className="dashboard-content">
        <div className="content-section">
          <h2>Recent Activities</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📚</div>
              <div className="activity-details">
                <h4>New student registered</h4>
                <p>Rahul Kumar joined the Mathematics program</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon">👨‍🏫</div>
              <div className="activity-details">
                <h4>Volunteer application received</h4>
                <p>Dr. Priya applied for Science workshop</p>
                <span className="activity-time">4 hours ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon">📊</div>
              <div className="activity-details">
                <h4>Infrastructure request fulfilled</h4>
                <p>Desks and chairs delivered to Class 6A</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="content-section">
          <h2>Quick Links</h2>
          <div className="quick-links">
            <a href="/school/students" className="quick-link">Manage Students</a>
            <a href="/school/requests" className="quick-link">View Requests</a>
            <a href="/school/applications" className="quick-link">Review Applications</a>
            <a href="/school/reports" className="quick-link">Generate Reports</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 