import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { saveUser } from '../../utils/auth';
import './AuthForms.css';

const VolunteerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect URL from query parameters
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect');

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
          role: 'volunteer'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        saveUser(data.user);
        // Redirect to the specified URL or default to volunteer dashboard
        if (redirectUrl) {
          navigate(redirectUrl);
        } else {
          navigate('/volunteer/applications'); // Default to volunteer applications
        }
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
        <h2>Volunteer Login</h2>
        <p className="auth-subtitle">Access volunteer resources and opportunities</p>
        
        {redirectUrl && (
          <div className="redirect-notice">
            <p>Please login to continue to your requested page.</p>
          </div>
        )}
        
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
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login as Volunteer'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have a volunteer account? <Link to="/register/volunteer">Register here</Link></p>
          <p><Link to="/">Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
};

export default VolunteerLogin; 