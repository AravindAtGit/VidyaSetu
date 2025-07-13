import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SchoolInfraApplications.css';

const SchoolInfraApplications = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approving, setApproving] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [requestId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      console.log('Fetching applications for requestId:', requestId);
      
      const response = await fetch(`/api/school/infra/applications/${requestId}`, {
        credentials: 'include'
      });
      
      console.log('Applications response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Applications data:', data);
        setApplications(data);
        
        // Also fetch request details
        const requestResponse = await fetch(`/api/school/infra/requests`, {
          credentials: 'include'
        });
        console.log('Request response status:', requestResponse.status);
        
        if (requestResponse.ok) {
          const requests = await requestResponse.json();
          console.log('All requests:', requests);
          const currentRequest = requests.find(r => r._id === requestId);
          console.log('Current request:', currentRequest);
          setRequest(currentRequest);
        }
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
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
        fetchApplications();
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
        fetchApplications();
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
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="applications-container">
        <div className="loading">Loading applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applications-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/admin/infra/requests')}>
            Back to Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-container">
      <div className="applications-header">
        <h1>Infrastructure Request Applications</h1>
        <p>Review and manage volunteer applications for your request</p>
        <button 
          className="back-button"
          onClick={() => navigate('/admin/infra/requests')}
        >
          ← Back to Requests
        </button>
      </div>

      {request && (
        <div className="request-summary">
          <h2>Request Details</h2>
          <div className="request-info">
            <p><strong>Category:</strong> {request.category}</p>
            <p><strong>Subcategory:</strong> {request.subcategory}</p>
            {request.description && (
              <p><strong>Description:</strong> {request.description}</p>
            )}
            <p><strong>Status:</strong> {request.status}</p>
            <p><strong>Quantity:</strong> {request.remainingQuantity}/{request.requiredQuantity}</p>
            <p><strong>Request ID:</strong> #{request._id.slice(-6)}</p>
          </div>
        </div>
      )}

      <div className="applications-section">
        <h2>Volunteer Applications ({applications.length})</h2>
        
        {applications.length === 0 ? (
          <div className="no-applications">
            <h3>No Applications Yet</h3>
            <p>No volunteers have applied for this request yet.</p>
          </div>
        ) : (
          <div className="applications-grid">
            {applications.map((application) => (
              <div key={application._id} className="application-card">
                <div className="application-header">
                  <h3>Volunteer Application</h3>
                  <span className={`status-badge ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </div>
                
                <div className="volunteer-info">
                  <div className="info-row">
                    <label>Volunteer Name:</label>
                    <span>{application.volunteer?.name || 'N/A'}</span>
                  </div>
                  
                  <div className="info-row">
                    <label>Email:</label>
                    <span>{application.volunteer?.email || 'N/A'}</span>
                  </div>
                  
                                     <div className="info-row">
                     <label>Phone:</label>
                     <span>{application.volunteer?.contact || 'N/A'}</span>
                   </div>
                  
                  <div className="info-row">
                    <label>Applied:</label>
                    <span>{new Date(application.appliedAt).toLocaleDateString()}</span>
                  </div>
                  
                  {application.fulfilledAt && (
                    <div className="info-row">
                      <label>Fulfilled:</label>
                      <span>{new Date(application.fulfilledAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {application.feedback && (
                    <div className="info-row">
                      <label>Your Feedback:</label>
                      <span className="feedback-text">{application.feedback}</span>
                    </div>
                  )}
                </div>
                
                <div className="application-actions">
                  {application.status === 'pending' && (
                    <button
                      className="approve-button"
                      onClick={() => handleApprove(application._id)}
                      disabled={approving === application._id}
                    >
                      {approving === application._id ? 'Approving...' : 'Approve Application'}
                    </button>
                  )}
                  
                  {application.status === 'approved' && !application.feedback && (
                    <button
                      className="feedback-button"
                      onClick={() => setShowFeedbackModal(application._id)}
                    >
                      Give Feedback
                    </button>
                  )}
                  
                  {application.status === 'approved' && application.feedback && (
                    <div className="feedback-submitted">
                      <p>✓ Feedback submitted</p>
                    </div>
                  )}
                  
                  {application.status === 'rejected' && (
                    <div className="rejected-notice">
                      <p>Application was rejected</p>
                    </div>
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
          <div className="feedback-modal">
            <h3>Provide Feedback</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your feedback about the volunteer's contribution..."
              rows="4"
            />
            <div className="modal-actions">
              <button
                className="submit-feedback-button"
                onClick={() => handleFeedback(showFeedbackModal)}
              >
                Submit Feedback
              </button>
              <button
                className="cancel-button"
                onClick={() => {
                  setShowFeedbackModal(null);
                  setFeedback('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolInfraApplications; 