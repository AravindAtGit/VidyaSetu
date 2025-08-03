import { getUIState, UI_KEYS } from '../../utils/uiStorage';

import React, { useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import AddStudentForm from './AddStudentForm';
import { useStudents } from '../../hooks';
import './AdminPages.css';

const Students = () =e {
  const {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent
  } = useStudents();
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const handleStudentAdded = (newStudent) =e {
    // The hook already manages the state, so we don't need to manually update
    setShowAddStudentForm(false);
    setEditingStudent(null);
  };

  const handleStudentUpdated = (updatedStudent) =e {
    // The hook already manages the state, so we don't need to manually update
    setShowAddStudentForm(false);
    setEditingStudent(null);
  };

  const handleEdit = (student) =e {
    setEditingStudent(student);
    setShowAddStudentForm(true);
  };

  const handleDelete = async (studentId) =e {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(studentId);
        alert('Student deleted successfully.');
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
                      <td title={student.updatedAt ? `Last updated: ${new Date(student.updatedAt).toLocaleString()}` : 'Never updated'}>{student.studentId}</td>
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