import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/form.css';
import './ApplyInfraForm.css';

const ApplyInfraForm = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/infra/requests/open`);
      if (response.ok) {
        const data = await response.json();
        const found = data.find(r => r._id === requestId);
        if (found) {
          setRequest(found);
          setQuantity(1);
        } else {
          setError('Request not found or already fulfilled.');
        }
      } else {
        setError('Failed to fetch request details.');
      }
    } catch (err) {
      setError('Failed to fetch request details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!request) return;
    if (quantity < 1 || quantity > request.remainingQuantity) {
      setError(`Quantity must be between 1 and ${request.remainingQuantity}`);
      return;
    }
    try {
      const response = await fetch(`/api/infra/volunteer/apply/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity })
      });
      if (response.ok) {
        setSuccess('Application submitted successfully!');
        setTimeout(() => navigate('/volunteer/applications'), 1500);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit application.');
      }
    } catch (err) {
      setError('Failed to submit application.');
    }
  };

  if (loading) return <div className="apply-form-container"><div className="loading">Loading...</div></div>;
  if (error) return <div className="apply-form-container"><div className="form-message error">{error}</div></div>;
  if (!request) return null;

  return (
    <div className="apply-form-container">
      <div className="apply-header">
        <h1>Apply to Contribute</h1>
        <p>Review the request details and submit your application</p>
      </div>
      <div className="request-details-card">
        <div className="request-header">
          <h2>{request.category} - {request.subcategory}</h2>
        </div>
        <div className="request-info">
          <div className="info-row">
            <label>Description:</label>
            <span>{request.description}</span>
          </div>
          <div className="info-row">
            <label>School:</label>
            <span>{request.school?.schoolName} ({request.school?.location})</span>
          </div>
          <div className="info-row">
            <label>Quantity Needed:</label>
            <span>{request.requiredQuantity}</span>
          </div>
          <div className="info-row">
            <label>Remaining:</label>
            <span>{request.remainingQuantity}</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="apply-form">
        <div className="form-group">
          <label htmlFor="quantity">Quantity to Contribute:</label>
          <input
            type="number"
            id="quantity"
            min="1"
            max={request.remainingQuantity}
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">Submit Application</button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/contribute')}>Back to Requests</button>
        </div>
      </form>
      {success && <div className="form-message success">{success}</div>}
      {error && <div className="form-message error">{error}</div>}
    </div>
  );
};

export default ApplyInfraForm; 