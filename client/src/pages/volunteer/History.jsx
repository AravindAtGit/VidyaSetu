import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './History.css';

const History = () => {
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
      const response = await fetch('/api/infra/volunteer/applications/history', {
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
      case 'fulfilled': return 'green';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading">Loading your contribution history...</div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>My Contribution History</h1>
        <p>Track your completed infrastructure contributions</p>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
        </div>
      )}

      <div className="history-section">
        {applications.length === 0 ? (
          <div className="no-history">
            <h3>No Completed Contributions</h3>
            <p>You haven't completed any infrastructure contributions yet.</p>
            <button 
              className="browse-button"
              onClick={() => navigate('/contribute')}
            >
              Browse Requests
            </button>
          </div>
        ) : (
          <div className="history-grid">
            {applications.map((application) => (
              <div key={application._id} className="history-card">
                <div className="history-card-header">
                  <h3>{application.request?.category}</h3>
                  <span className={`status-badge ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </div>
                
                <div className="history-card-details">
                  <div className="detail-row">
                    <label>Subcategory:</label>
                    <span>{application.request?.subcategory}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>Quantity Provided:</label>
                    <span>{application.quantity || 1}</span>
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
                    <label>Completed:</label>
                    <span>{new Date(application.fulfilledAt || application.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {application.feedback && (
                  <div className="feedback-section">
                    <h4>School Feedback:</h4>
                    <div className="feedback-content">
                      <p>{application.feedback}</p>
                    </div>
                  </div>
                )}
                
                <div className="contribution-badge">
                  <span className="badge-icon">✅</span>
                  <span className="badge-text">Successfully Contributed</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History; 