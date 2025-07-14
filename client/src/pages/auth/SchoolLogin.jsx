import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveUser } from '../../utils/auth';
import './AuthForms.css';

const SchoolLogin = () => {
  const [formData, setFormData] = useState({
    udiseNumber: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          role: 'school'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        saveUser(data.user);
        navigate('/school/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>School Admin Login</h2>
        <p className="auth-subtitle">Access your school's admin panel</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="udiseNumber">UDISE Number</label>
            <input
              type="text"
              id="udiseNumber"
              name="udiseNumber"
              value={formData.udiseNumber}
              onChange={handleChange}
              placeholder="11-digit UDISE number"
              maxLength="11"
              pattern="[0-9]{11}"
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
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login as School'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have a school account? <Link to="/register/school">Register here</Link></p>
          <p><Link to="/">Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SchoolLogin; 