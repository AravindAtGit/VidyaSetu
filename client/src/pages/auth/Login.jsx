import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveUser } from '../../utils/auth';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    // Get users from localStorage or empty array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // Find user with matching email and password
    const user = users.find(u => u.email === formData.email && u.password === formData.password);
    if (!user) {
      setError('Invalid email or password.');
      return;
    }
    // Log in the user
    saveUser(user);
    // Redirect by role
    if (user.role === 'school') {
      navigate('/admin/dashboard');
    } else if (user.role === 'student') {
      navigate('/student/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to VidyaSetu</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
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
          
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login; 