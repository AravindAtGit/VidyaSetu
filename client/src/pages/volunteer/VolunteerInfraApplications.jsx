import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './VolunteerPages.css';

const VolunteerInfraApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/infra/volunteer/applications', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        setError('Failed to fetch your infrastructure applications');
      }
    } catch (error) {
      console.error('Error fetching infrastructure applications:', error);
      setError('Failed to fetch your infrastructure applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'completed': return 'blue';
      default: return 'gray';
    }
  };

  const filteredApplications = applications.filter(application => {
    if (filter === 'all') return true;
    return application.status === filter;
  });

  const handleWithdraw = async (applicationId) => {
    try {
      const response = await fetch(`/api/infra/volunteer/applications/${applicationId}/withdraw`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Remove the application from the list
        setApplications(prev => prev.filter(app => app._id !== applicationId));
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to withdraw application');
      }
    } catch (error) {
      console.error('Error withdrawing application:', error);
      alert('Failed to withdraw application. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="volunteer-page">
        <div className="loading">Loading your infrastructure applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="volunteer-page">
        <div className="error-message">{error}</div>
        <button onClick={fetchApplications} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="volunteer-page">
      <div className="page-header">
        <h1>My Infrastructure Applications</h1>
        <p>Track your applications for infrastructure requests</p>
      </div>

      <div className="filter-section">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Applications</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="applications-grid">
        {filteredApplications.length === 0 ? (
          <div className="no-applications">
            <p>No infrastructure applications found matching your criteria.</p>
            <Link to="/volunteer/infra/requests" className="browse-btn">
              Browse Infrastructure Requests
            </Link>
          </div>
        ) : (
          filteredApplications.map(application => (
            <div key={application._id} className="application-card">
              <div className="application-header">
                <h3>{application.request?.category} - {application.request?.subcategory}</h3>
                <span className={`status-badge ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
              </div>
              
              <div className="application-details">
                <p><strong>Request Description:</strong> {application.request?.description}</p>
                <p><strong>Your Offer:</strong> {application.quantity} units</p>
                <p><strong>School:</strong> {application.request?.school?.schoolName || 'Unknown'}</p>
                <p><strong>Location:</strong> {application.request?.school?.location || 'Unknown'}</p>
                <p><strong>Applied:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
                {application.status === 'approved' && (
                  <p><strong>Approved:</strong> {new Date(application.updatedAt).toLocaleDateString()}</p>
                )}
              </div>

              <div className="application-actions">
                <Link 
                  to={`/volunteer/infra/application/${application._id}`}
                  className="view-details-btn"
                >
                  View Details
                </Link>
                {application.status === 'pending' && (
                  <button 
                    onClick={() => handleWithdraw(application._id)}
                    className="withdraw-btn"
                  >
                    Withdraw Application
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VolunteerInfraApplications; 