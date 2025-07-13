import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ApplyInfraForm.css';

const ApplyInfraForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/volunteer/infra/requests/${id}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequest(data);
        // Set max quantity to remaining quantity
        setQuantity(Math.min(quantity, data.remainingQuantity));
      } else {
        setError('Failed to fetch request details');
      }
    } catch (error) {
      console.error('Error fetching request:', error);
      setError('Failed to fetch request details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      const response = await fetch(`/api/volunteer/infra/apply/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ quantity })
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        navigate('/volunteer/infra/my-applications');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error applying:', error);
      setError('Failed to submit application');
    } finally {
      setApplying(false);
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
      <div className="apply-form-container">
        <div className="loading">Loading request details...</div>
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="apply-form-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/volunteer/infra/requests')}>
            Back to Requests
          </button>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="apply-form-container">
        <div className="error-message">
          <h2>Request Not Found</h2>
          <p>The requested infrastructure request could not be found.</p>
          <button onClick={() => navigate('/volunteer/infra/requests')}>
            Back to Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-form-container">
      <div className="apply-header">
        <h1>Apply for Infrastructure Request</h1>
        <p>Review the request details and submit your application</p>
      </div>

      <div className="request-details-card">
        <div className="request-header">
          <h2>{request.category}</h2>
          <span className={`status-badge ${getStatusColor(request.status)}`}>
            {request.status}
          </span>
        </div>

        <div className="request-info">
          <div className="info-row">
            <label>Subcategory:</label>
            <span>{request.subcategory}</span>
          </div>
          
          {request.description && (
            <div className="info-row">
              <label>Description:</label>
              <span>{request.description}</span>
            </div>
          )}
          
          <div className="info-row">
            <label>Required Quantity:</label>
            <span>{request.requiredQuantity}</span>
          </div>
          
          <div className="info-row">
            <label>Remaining Quantity:</label>
            <span>{request.remainingQuantity}</span>
          </div>
          
          <div className="info-row">
            <label>Quantity to Provide:</label>
            <input
              type="number"
              min="1"
              max={request.remainingQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 1, request.remainingQuantity))}
              className="quantity-input"
            />
          </div>
          
          <div className="info-row">
            <label>School:</label>
            <span>{request.school?.schoolName || 'N/A'}</span>
          </div>
          
          <div className="info-row">
            <label>Location:</label>
            <span>{request.school?.location || 'N/A'}</span>
          </div>
          
          <div className="info-row">
            <label>Request ID:</label>
            <span>#{request._id.slice(-6)}</span>
          </div>
          
          <div className="info-row">
            <label>Created:</label>
            <span>{new Date(request.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
        </div>
      )}

      <div className="apply-actions">
        <button
          className="apply-button"
          onClick={handleApply}
          disabled={applying || request.status !== 'open'}
        >
          {applying ? 'Submitting...' : 'Apply Now'}
        </button>
        
        <button
          className="cancel-button"
          onClick={() => navigate('/volunteer/infra/requests')}
          disabled={applying}
        >
          Cancel
        </button>
      </div>

      {request.status !== 'open' && (
        <div className="status-notice">
          <p>This request is not currently accepting applications.</p>
        </div>
      )}
    </div>
  );
};

export default ApplyInfraForm; 