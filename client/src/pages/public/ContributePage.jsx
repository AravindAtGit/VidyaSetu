import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/auth';
import './ContributePage.css';

const ContributePage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/infra/requests/open', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        setError('Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (requestId) => {
    if (!user) {
      // Redirect to login with return URL to contribute page
      navigate(`/login/volunteer?redirect=/contribute`);
    } else if (user.role === 'volunteer') {
      // Navigate to apply form
      navigate(`/volunteer/apply/${requestId}`);
    } else {
      // Show message for non-volunteer users
      alert('Only volunteers can apply for infrastructure requests. Please login as a volunteer.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'green';
      case 'approved': return 'blue';
      case 'fulfilled': return 'orange';
      case 'completed': return 'purple';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="contribute-page">
        <div className="loading">Loading infrastructure requests...</div>
      </div>
    );
  }

  return (
    <div className="contribute-page">
      <div className="page-header">
        <h1>Infrastructure Requests</h1>
        <p>Help schools by contributing to their infrastructure needs</p>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
        </div>
      )}

      <div className="requests-section">
        {requests.length === 0 ? (
          <div className="no-requests">
            <h3>No Requests Available</h3>
            <p>There are currently no infrastructure requests available.</p>
            <p>Check back later for new opportunities to help schools.</p>
          </div>
        ) : (
          <div className="requests-grid">
            {requests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <h3>{request.category}</h3>
                  <span className={`status-badge ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                
                <div className="request-details">
                  <div className="detail-row">
                    <label>Subcategory:</label>
                    <span>{request.subcategory}</span>
                  </div>
                  
                  {request.description && (
                    <div className="detail-row">
                      <label>Description:</label>
                      <span>{request.description}</span>
                    </div>
                  )}
                  
                  <div className="detail-row">
                    <label>Quantity Needed:</label>
                    <span>{request.requiredQuantity}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>Remaining:</label>
                    <span>{request.remainingQuantity}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>School:</label>
                    <span>{request.school?.schoolName || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>Location:</label>
                    <span>{request.school?.location || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>Posted:</label>
                    <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="request-actions">
                  {request.status === 'open' && request.remainingQuantity > 0 ? (
                    <button 
                      className="apply-btn"
                      onClick={() => handleApply(request._id)}
                    >
                      Apply to Contribute
                    </button>
                  ) : (
                    <div className="request-closed">
                      <p>This request is no longer accepting applications</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="contribute-info">
        <h2>How to Contribute</h2>
        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">👤</div>
            <h3>Register as Volunteer</h3>
            <p>Create a volunteer account to start contributing to infrastructure requests.</p>
            <Link to="/register/volunteer" className="info-link">Register Now</Link>
          </div>
          
          <div className="info-card">
            <div className="info-icon">🔍</div>
            <h3>Browse Requests</h3>
            <p>View available infrastructure requests from schools in need.</p>
            <p>Find opportunities that match your ability to contribute.</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">✅</div>
            <h3>Apply & Contribute</h3>
            <p>Submit your application and deliver the requested items to schools.</p>
            <p>Track your contributions and receive feedback.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributePage; 