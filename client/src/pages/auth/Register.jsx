import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveUser } from '../../utils/auth';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Get users from localStorage or empty array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // Check for duplicate email
    const existing = users.find(u => u.email === formData.email);
    if (existing) {
      setError('A user with this email already exists.');
      return;
    }
    // Create new user object
    const newUser = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    };
    // Save to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    // Log in the new user
    saveUser(newUser);
    // Redirect by role
    if (newUser.role === 'school') {
      navigate('/admin/dashboard');
    } else if (newUser.role === 'student') {
      navigate('/student/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Join VidyaSetu</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="school">School Admin</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
        
        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register; 