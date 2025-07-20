import React, { useState } from 'react';
import './AddStudentForm.css';

const AddStudentForm = ({ student, onStudentAdded, onStudentUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: student ? student.name : '',
    email: student ? student.email : '',
    phone: student ? student.phone : '',
    class: student ? student.class : '',
    grade: student ? student.grade : '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = student ? `/api/school/students/${student._id}` : '/api/school/create-student';
      const method = student ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ student: formData })
      });

      const data = await response.json();

      if (response.ok) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          class: '',
          grade: '',
          password: ''
        });
        
// Show success message
        const successMessage = student ? 'Student updated successfully!' : 'Student added successfully!';
        alert(successMessage);
        
        // Call parent callback
        if (student && onStudentUpdated) {
          onStudentUpdated(data.student);
        } else if (onStudentAdded) {
          onStudentAdded(data.student);
        }
        
        // Close modal if provided
        if (onCancel) {
          onCancel();
        }
      } else {
        setError(data.message || 'Failed to add student');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-student-form">
      <div className="form-header">
        <h2>{student ? 'Edit Student' : 'Add New Student'}</h2>
        {onCancel && (
          <button className="close-btn" onClick={onCancel}>
            ×
          </button>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Student Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter student's full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email (Optional)</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter student's email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone (Optional)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter student's phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="class">Class *</label>
          <select
            id="class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
          >
            <option value="">Select Class</option>
            <option value="1">Class 1</option>
            <option value="2">Class 2</option>
            <option value="3">Class 3</option>
            <option value="4">Class 4</option>
            <option value="5">Class 5</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="grade">Grade (Optional)</label>
          <input
            type="text"
            id="grade"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            placeholder="Enter student's grade/performance"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter login password"
            minLength="6"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (student ? 'Updating Student...' : 'Adding Student...') : (student ? 'Update Student' : 'Add Student')}
          </button>
          {onCancel && (
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddStudentForm; 