import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import AddStudentForm from './AddStudentForm';
import './AdminPages.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Session-based auth: credentials: 'include' sends session cookie
      const response = await fetch('/api/school/students', {
        credentials: 'include'
      });
      
      if (response.ok) {
        // Parse response: server returns { students: [...] }
        const { students } = await response.json();
        setStudents(students);
      } else {
        throw new Error('Failed to load students');
      }
    } catch (error) {
      console.error('Error loading students:', error);
      setError('Failed to load students. Please try again.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentAdded = (newStudent) => {
    setStudents(prev => [...prev, newStudent]);
    setShowAddStudentForm(false);
    setEditingStudent(null);
  };

  const handleStudentUpdated = (updatedStudent) => {
    setStudents(prev => prev.map(student => 
      student._id === updatedStudent._id ? updatedStudent : student
    ));
    setShowAddStudentForm(false);
    setEditingStudent(null);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowAddStudentForm(true);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        // Session-based auth: credentials: 'include' maintains authenticated session
        const response = await fetch(`/api/school/students/${studentId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (response.ok) {
          setStudents(prev => prev.filter(student => student._id !== studentId));
        } else {
          throw new Error('Failed to delete student');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setEditingStudent(null);
    setShowAddStudentForm(false);
  };

  return (
    <ProtectedRoute role="school">
      <div className="admin-page">
        <div className="page-header">
          <h1>Student Management</h1>
          <p>Manage your school's student records and enrollment</p>
        </div>

        <div className="students-section">
          <div className="section-header">
            <div className="header-info">
              <h2>Student Records</h2>
              <p>Total Students: {students.length}</p>
            </div>
            <button 
              className="add-student-btn"
              onClick={() => setShowAddStudentForm(true)}
            >
              + Add New Student
            </button>
          </div>
          
          {/* Students Table */}
          <div className="students-table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Class</th>
                  <th>Grade</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-students">
                      No students found. Add your first student!
                    </td>
                  </tr>
                ) : (
                  students.map(student => (
                    <tr key={student._id}>
                      <td title={student.updatedAt ? `Last updated: ${new Date(student.updatedAt).toLocaleString()}` : 'Never updated'}>{student._id}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.phone}</td>
                      <td>{student.class}</td>
                      <td>{student.grade}</td>
                      <td>
                        <button 
                          className="edit-btn"
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(student._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Student Modal */}
        {showAddStudentForm && (
          <AddStudentForm
            student={editingStudent}
            onStudentAdded={handleStudentAdded}
            onStudentUpdated={handleStudentUpdated}
            onCancel={handleCancel}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Students; 