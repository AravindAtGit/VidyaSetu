import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './VolunteerPages.css';

const VolunteerInfraRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

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
        setError('Failed to fetch infrastructure requests');
      }
    } catch (error) {
      console.error('Error fetching infrastructure requests:', error);
      setError('Failed to fetch infrastructure requests');
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

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  if (loading) {
    return (
      <div className="volunteer-page">
        <div className="loading">Loading infrastructure requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="volunteer-page">
        <div className="error-message">{error}</div>
        <button onClick={fetchRequests} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="volunteer-page">
      <div className="page-header">
        <h1>Infrastructure Requests</h1>
        <p>Browse and respond to infrastructure needs from schools</p>
      </div>

      <div className="filter-section">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Requests</option>
          <option value="open">Open</option>
          <option value="approved">Approved</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="requests-grid">
        {filteredRequests.length === 0 ? (
          <div className="no-requests">
            <p>No infrastructure requests found matching your criteria.</p>
          </div>
        ) : (
          filteredRequests.map(request => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <h3>{request.category} - {request.subcategory}</h3>
                <span className={`status-badge ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
              
              <div className="request-details">
                <p><strong>Description:</strong> {request.description}</p>
                <p><strong>Quantity:</strong> {request.requiredQuantity}</p>
                <p><strong>School:</strong> {request.school?.schoolName || 'Unknown'}</p>
                <p><strong>Location:</strong> {request.school?.location || 'Unknown'}</p>
                <p><strong>Posted:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="request-actions">
                {request.status === 'open' && (
                  <Link 
                    to={`/volunteer/infra/apply/${request._id}`}
                    className="apply-btn"
                  >
                    Apply to Help
                  </Link>
                )}
                <Link 
                  to={`/volunteer/infra/request/${request._id}`}
                  className="view-details-btn"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VolunteerInfraRequests; 