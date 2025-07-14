import React, { useState, useEffect } from 'react';
import './AdminPages.css';

const Requests = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/school/infra/requests/history-with-fulfillments', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else {
        setError('Failed to fetch requests history');
      }
    } catch (error) {
      console.error('Error fetching requests history:', error);
      setError('Failed to fetch requests history');
    } finally {
      setLoading(false);
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
      <div className="admin-page">
        <div className="loading">Loading requests history...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Requests History</h1>
        <p>View all your fulfilled infrastructure requests and the volunteers who contributed</p>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
        </div>
      )}

      <div className="requests-section">
        <div className="section-header">
          <h2>All Fulfilled Requests</h2>
        </div>

        {history.length === 0 ? (
          <div className="no-requests">
            <h3>No Fulfilled Requests Found</h3>
            <p>You haven't had any requests fulfilled yet.</p>
          </div>
        ) : (
          <div className="requests-grid">
            {history.map(({ request, fulfilledApplications }) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <h3>{request.category}</h3>
                  <span className={`status-badge ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                <div className="request-details">
                  <div className="detail-row">
                    <label>Type:</label>
                    <span>Infrastructure</span>
                  </div>
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
                    <label>Quantity:</label>
                    <span>{request.requiredQuantity}</span>
                  </div>
                  <div className="detail-row">
                    <label>Created:</label>
                    <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                  {request.updatedAt && request.updatedAt !== request.createdAt && (
                    <div className="detail-row">
                      <label>Last Updated:</label>
                      <span>{new Date(request.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                {/* Fulfilled Volunteers */}
                <div className="fulfilled-volunteers-section">
                  <h4>Fulfilled By:</h4>
                  {fulfilledApplications.length === 0 ? (
                    <div className="no-volunteers">No volunteer details available.</div>
                  ) : (
                    <div className="volunteers-list">
                      {fulfilledApplications.map(app => (
                        <div key={app._id} className="volunteer-card">
                          <div className="detail-row">
                            <label>Name:</label>
                            <span>{app.volunteer?.name || 'N/A'}</span>
                          </div>
                          <div className="detail-row">
                            <label>Email:</label>
                            <span>{app.volunteer?.email || 'N/A'}</span>
                          </div>
                          <div className="detail-row">
                            <label>Contact:</label>
                            <span>{app.volunteer?.contact || 'N/A'}</span>
                          </div>
                          <div className="detail-row">
                            <label>Quantity Provided:</label>
                            <span>{app.quantity}</span>
                          </div>
                          <div className="detail-row">
                            <label>Fulfilled At:</label>
                            <span>{app.fulfilledAt ? new Date(app.fulfilledAt).toLocaleDateString() : 'N/A'}</span>
                          </div>
                          {app.feedback && (
                            <div className="detail-row">
                              <label>Feedback:</label>
                              <span>{app.feedback}</span>
                            </div>
                          )}
                        </div>
                      ))}
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

export default Requests; 