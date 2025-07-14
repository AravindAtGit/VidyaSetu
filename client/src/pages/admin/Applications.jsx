import React, { useState, useEffect } from 'react';
import './AdminPages.css';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approving, setApproving] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchAllApplications();
  }, []);

  const fetchAllApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/school/infra/applications', {
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

  const handleApprove = async (appId) => {
    try {
      setApproving(appId);
      const response = await fetch(`/api/school/infra/applications/${appId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        alert('Application approved successfully!');
        fetchAllApplications();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to approve application');
      }
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Failed to approve application');
    } finally {
      setApproving(null);
    }
  };

  const handleFeedback = async (appId) => {
    if (!feedback.trim()) {
      alert('Please enter feedback');
      return;
    }

    try {
      const response = await fetch(`/api/school/infra/applications/${appId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ feedback })
      });

      if (response.ok) {
        alert('Feedback submitted successfully!');
        setShowFeedbackModal(null);
        setFeedback('');
        fetchAllApplications();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback');
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

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Volunteer Applications</h1>
        <p>Review and manage volunteer applications for your infrastructure requests</p>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
        </div>
      )}

      <div className="applications-section">
        <div className="section-header">
          <h2>All Applications ({applications.length})</h2>
        </div>

        {applications.length === 0 ? (
          <div className="no-applications">
            <h3>No Applications Found</h3>
            <p>No volunteers have applied for your infrastructure requests yet.</p>
          </div>
        ) : (
          <div className="applications-grid">
            {applications.map((application) => (
              <div key={application._id} className="application-card">
                <div className="application-header">
                  <h3>{application.request?.category} - {application.request?.subcategory}</h3>
                  <span className={`status-badge ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </div>
                
                <div className="application-details">
                  <div className="detail-row">
                    <label>Volunteer:</label>
                    <span>{application.volunteer?.name || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>Email:</label>
                    <span>{application.volunteer?.email || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>Contact:</label>
                    <span>{application.volunteer?.contact || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>Quantity Offered:</label>
                    <span>{application.quantity || 1}</span>
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
                      <label>Your Feedback:</label>
                      <span className="feedback-text">{application.feedback}</span>
                    </div>
                  )}
                </div>
                
                <div className="application-actions">
                  {application.status === 'pending' && (
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(application._id)}
                      disabled={approving === application._id}
                    >
                      {approving === application._id ? 'Approving...' : 'Approve'}
                    </button>
                  )}
                  
                  {application.status === 'approved' && !application.feedback && (
                    <button
                      className="feedback-btn"
                      onClick={() => setShowFeedbackModal(application._id)}
                    >
                      Give Feedback
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Give Feedback</h2>
              <button 
                className="close-btn"
                onClick={() => setShowFeedbackModal(null)}
              >
                ×
              </button>
            </div>
            
            <div className="form-group">
              <label htmlFor="feedback">Feedback:</label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="4"
                placeholder="Enter your feedback for the volunteer..."
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={() => setShowFeedbackModal(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="submit-btn"
                onClick={() => handleFeedback(showFeedbackModal)}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications; 