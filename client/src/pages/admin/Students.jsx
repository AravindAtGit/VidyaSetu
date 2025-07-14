import React, { useState, useEffect } from 'react';
import AddStudentForm from './AddStudentForm';
import StudentList from './StudentList';
import './AdminPages.css';

const Students = () => {
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
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
    <div className="admin-page">
      <div className="page-header">
        <h1>Student Management</h1>
        <p>Manage your school's student records and enrollment</p>
      </div>

      <div className="students-section">
        <div className="section-header">
          <div className="header-info">
            <h2>Student Records</h2>
            <p>Total Students: {studentCount}</p>
          </div>
          <button 
            className="add-student-btn"
            onClick={() => setShowAddStudentForm(true)}
          >
            + Add New Student
          </button>
        </div>
        
        <StudentList onStudentAdded={refreshTrigger} />
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

export default Students; 