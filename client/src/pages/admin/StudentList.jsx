import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import './StudentList.css';

const StudentList = ({ onStudentAdded }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  // Listen for student added events from parent
  useEffect(() => {
    if (onStudentAdded) {
      fetchStudents();
    }
  }, [onStudentAdded]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/school/students', {
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setStudents(data.students);
      } else {
        setError(data.message || 'Failed to fetch students');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentAdded = (newStudent) => {
    setStudents(prevStudents => [newStudent, ...prevStudents]);
  };

  if (loading) {
    return (
      <div className="student-list-container">
        <div className="loading">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-list-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchStudents} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <h2>Student Management</h2>
        <p>Manage all students in your school</p>
      </div>

      <div className="student-stats">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-number">{students.length}</p>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No Students Yet</h3>
          <p>Start by adding your first student to the system.</p>
        </div>
      ) : (
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Class</th>
                <th>Email</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.studentId}</td>
                  <td>{student.name}</td>
                  <td>Class {student.class}</td>
                  <td>{student.email || 'N/A'}</td>
                  <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit"><FiEdit/> Edit</button>
                      <button className="action-btn delete"><FiTrash2/> Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList; 