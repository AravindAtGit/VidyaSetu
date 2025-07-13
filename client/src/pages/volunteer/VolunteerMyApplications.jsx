import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VolunteerMyApplications.css';

const VolunteerMyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/volunteer/infra/applications', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'blue';
      case 'rejected': return 'red';
      case 'fulfilled': return 'green';
      default: return 'gray';
    }
  };

  const getRequestStatusColor = (status) => {
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
      <div className="applications-container">
        <div className="loading">Loading your applications...</div>
      </div>
    );
  }

  return (
    <div className="applications-container">
      <div className="applications-header">
        <h1>My Infrastructure Applications</h1>
        <p>Track the status of your infrastructure contribution applications</p>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
        </div>
      )}

      <div className="applications-section">
        {applications.length === 0 ? (
          <div className="no-applications">
            <h3>No Applications Found</h3>
            <p>You haven't applied for any infrastructure requests yet.</p>
            <button 
              className="browse-button"
              onClick={() => navigate('/volunteer/infra/requests')}
            >
              Browse Requests
            </button>
          </div>
        ) : (
          <div className="applications-grid">
            {applications.map((application) => (
              <div key={application._id} className="application-card">
                <div className="application-header">
                  <h3>{application.request?.category}</h3>
                  <div className="status-badges">
                    <span className={`status-badge ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                    <span className={`status-badge ${getRequestStatusColor(application.request?.status)}`}>
                      {application.request?.status}
                    </span>
                  </div>
                </div>
                
                <div className="application-details">
                  <div className="detail-row">
                    <label>Subcategory:</label>
                    <span>{application.request?.subcategory}</span>
                  </div>
                  
                  {application.request?.description && (
                    <div className="detail-row">
                      <label>Description:</label>
                      <span>{application.request.description}</span>
                    </div>
                  )}
                  
                  <div className="detail-row">
                    <label>Quantity Providing:</label>
                    <span>{application.quantity || 1}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>Request Total:</label>
                    <span>{application.request?.remainingQuantity || 0}/{application.request?.requiredQuantity || 0}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>School:</label>
                    <span>{application.request?.school?.schoolName || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>Location:</label>
                    <span>{application.request?.school?.location || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>Applied:</label>
                    <span>{new Date(application.appliedAt).toLocaleDateString()}</span>
                  </div>
                  
                  {application.fulfilledAt && (
                    <div className="detail-row">
                      <label>Fulfilled:</label>
                      <span>{new Date(application.fulfilledAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {application.feedback && (
                    <div className="detail-row">
                      <label>Feedback:</label>
                      <span>{application.feedback}</span>
                    </div>
                  )}
                </div>
                
                <div className="application-actions">
                  {application.status === 'pending' && (
                    <div className="pending-notice">
                      <p>Your application is under review by the school.</p>
                    </div>
                  )}
                  
                  {application.status === 'approved' && !application.fulfilledAt && (
                    <div className="approved-notice">
                      <p>✓ Your application has been approved! Please deliver the requested items.</p>
                    </div>
                  )}
                  
                  {application.status === 'rejected' && (
                    <div className="rejected-notice">
                      <p>Your application was not approved.</p>
                    </div>
                  )}
                  
                  {application.status === 'fulfilled' && (
                    <div className="fulfilled-notice">
                      <p>✓ Successfully fulfilled and feedback received</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerMyApplications; 