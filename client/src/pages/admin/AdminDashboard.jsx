import React, { useState, useEffect } from 'react';
import AddStudentForm from './AddStudentForm';
import StudentList from './StudentList';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [studentCount, setStudentCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchStudentCount();
  }, []);

  const fetchStudentCount = async () => {
    try {
      const response = await fetch('/api/school/students', {
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setStudentCount(data.students.length);
      }
    } catch (error) {
      console.error('Error fetching student count:', error);
    }
  };

  const handleStudentAdded = () => {
    fetchStudentCount();
    setShowAddStudentForm(false);
    setRefreshTrigger(prev => prev + 1);
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
          className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          Students
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
              <h3>Active Volunteers</h3>
              <p className="stat-number">0</p>
              <p className="stat-change">Available for sessions</p>
            </div>
            
            <div className="stat-card">
              <h3>Total Sessions</h3>
              <p className="stat-number">0</p>
              <p className="stat-change">Conducted this month</p>
            </div>
            
            <div className="stat-card">
              <h3>Success Rate</h3>
              <p className="stat-number">0%</p>
              <p className="stat-change">Student engagement</p>
            </div>
          </div>
        </>
      )}

      {activeTab === 'students' && (
        <div className="students-section">
          <div className="section-header">
            <h2>Student Management</h2>
            <button 
              className="add-student-btn"
              onClick={() => setShowAddStudentForm(true)}
            >
              + Add New Student
            </button>
          </div>
          <StudentList onStudentAdded={refreshTrigger} />
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
                <h4>Volunteer session completed</h4>
                <p>Dr. Priya conducted Science workshop</p>
                <span className="activity-time">4 hours ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon">📊</div>
              <div className="activity-details">
                <h4>Monthly report generated</h4>
                <p>December 2024 performance report ready</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="content-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button 
              className="action-btn"
              onClick={() => setShowAddStudentForm(true)}
            >
              Add New Student
            </button>
            <button className="action-btn">Assign Volunteer</button>
            <button className="action-btn">Generate Report</button>
            <button className="action-btn">Manage Resources</button>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudentForm && (
        <div className="modal-overlay">
          <AddStudentForm 
            onStudentAdded={handleStudentAdded}
            onClose={() => setShowAddStudentForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 