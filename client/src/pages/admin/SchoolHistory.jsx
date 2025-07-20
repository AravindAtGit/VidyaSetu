import React, { useEffect, useState } from 'react';
import './SchoolHistory.css';

const SchoolHistory = () => {
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/infra/requests/history', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        // Backend returns requests array directly, not wrapped in an object
        setHistory(data);
      } else {
        setHistoryError('Unable to fetch history');
      }
    } catch (error) {
      setHistoryError('Unable to fetch history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="history-section">Loading history...</div>;

  return (
    <div className="history-section">
      <h2>Request History</h2>
      {historyError && <div className="error-alert">{historyError}</div>}
      {history.length === 0 ? (
        <div className="no-history">No fulfilled requests yet.</div>
      ) : (
        <div className="history-grid">
          {history.map(request => (
            <div key={request._id || request.id} className="history-card">
              <h3>{request.category || 'Unknown'} - {request.subcategory || 'Unknown'}</h3>
              <p><strong>Description:</strong> {request.description || 'No description available'}</p>
              <p><strong>Quantity:</strong> {request.requiredQuantity || 0}</p>
              <p><strong>Fulfilled:</strong> {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Unknown date'}</p>
              <div className="fulfilled-applications">
                <h4>Fulfilled By:</h4>
                {request.applications && request.applications.length > 0 ? (
                  request.applications.map((app, index) => (
                    <div key={app._id || app.id || `app-${index}`} className="fulfilled-app">
                      <p><strong>Volunteer:</strong> {app.volunteer?.name || 'Unknown'} 
                        ({app.volunteer?.email || 'No email'}, {app.volunteer?.contact || 'No contact'})</p>
                      <p><strong>Quantity Provided:</strong> {app.quantity || 0}</p>
                      <p><strong>Feedback:</strong> {app.feedback || 'No feedback provided'}</p>
                      <p><strong>Fulfilled At:</strong> {app.fulfilledAt ? new Date(app.fulfilledAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  ))
                ) : (
                  <p>No fulfilled applications for this request.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolHistory; 