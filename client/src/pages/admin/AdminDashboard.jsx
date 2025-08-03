import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUserPlus, FiTool, FiFileText, FiUpload, FiHelpCircle, FiBarChart2 } from 'react-icons/fi';
import './AdminDashboard.css';

const AdminDashboard = () => {
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
      const requestResponse = await fetch('/api/infra/requests/school', {
        credentials: 'include',
      });
      if (requestResponse.ok) {
        const requestData = await requestResponse.json();
        setRequestCount(requestData.length);
      }

      // Fetch application count
      const applicationResponse = await fetch('/api/infra/school/applications', {
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

      <div className="main-sections">
        <div className="content-section overview-section">
          <h2>Overview</h2>
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
        </div>

        <div className="content-section quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/school/students/add" className="action-btn">
              <span className="action-icon"><FiUserPlus/></span>
              <span className="action-text">Add Student</span>
            </Link>
            <Link to="/school/requests" className="action-btn">
              <span className="action-icon"><FiTool/></span>
              <span className="action-text">Infra Requests</span>
            </Link>
            <Link to="/school/applications" className="action-btn">
              <span className="action-icon"><FiFileText/></span>
              <span className="action-text">Applications</span>
            </Link>
            <Link to="/school/upload" className="action-btn">
              <span className="action-icon"><FiUpload/></span>
              <span className="action-text">Upload Content</span>
            </Link>
            <Link to="/school/quizzes" className="action-btn">
              <span className="action-icon"><FiHelpCircle/></span>
              <span className="action-text">Manage Quizzes</span>
            </Link>
            <Link to="/school/reports" className="action-btn">
              <span className="action-icon"><FiBarChart2/></span>
              <span className="action-text">View Reports</span>
            </Link>
          </div>
        </div>
        
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 