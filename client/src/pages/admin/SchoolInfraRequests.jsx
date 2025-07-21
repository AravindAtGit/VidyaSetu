import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/form.css';
import './AdminPages.css';

const SchoolInfraRequests = () => {
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    requestType: 'infrastructure',
    category: '',
    subcategory: '',
    description: '',
    requiredQuantity: 1
  });
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/infra/requests/school', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        setError('Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/infra/categories', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/infra/requests/history', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else {
        setHistoryError('Unable to fetch history');
      }
    } catch (error) {
      setHistoryError('Unable to fetch history');
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/infra/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({
          requestType: 'infrastructure',
          category: '',
          subcategory: '',
          description: '',
          requiredQuantity: 1
        });
        fetchRequests();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create request');
      }
    } catch (error) {
      console.error('Error creating request:', error);
      setError('Failed to create request');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Reset subcategory when category changes
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value,
        subcategory: ''
      }));
    }
  };

  const handleViewApplications = (requestId) => {
    navigate(`/school/infra/apps/${requestId}`);
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

  // Get subcategories for selected category
  const getSubcategories = () => {
    const selectedCategory = categories.find(cat => cat.name === formData.category);
    return selectedCategory ? selectedCategory.subcategories : [];
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Pending Requests</h1>
        <p>Manage your active infrastructure and virtual class requests</p>
      </div>

      {error && (
        <div className="form-message error">
          {error}
        </div>
      )}

      <div className="requests-section">
        <div className="section-header">
          <h2>Pending Requests</h2>
          <button 
            className="create-request-btn"
            onClick={() => setShowCreateForm(true)}
          >
            + Create New Request
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="no-requests">
            <h3>No Pending Requests</h3>
            <p>You don't have any pending requests at the moment.</p>
            <button 
              className="create-first-btn"
              onClick={() => setShowCreateForm(true)}
            >
              Create Your First Request
            </button>
          </div>
        ) : (
          <div className="requests-grid">
            {requests.map((request) => (
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
                    <label>Remaining:</label>
                    <span>{request.remainingQuantity}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>Created:</label>
                    <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="request-actions">
                  <button 
                    className="view-applications-btn"
                    onClick={() => handleViewApplications(request._id)}
                  >
                    View Applications
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Request Modal */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Request</h2>
              <button 
                className="close-btn"
                onClick={() => setShowCreateForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreateRequest}>
              <div className="form-group">
                <label htmlFor="requestType">Request Type</label>
                <select
                  id="requestType"
                  name="requestType"
                  value={formData.requestType}
                  onChange={handleFormChange}
                  required
                >
                  <option value="infrastructure">Infrastructure</option>
                  <option value="virtual-class">Virtual Class</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="subcategory">Subcategory</label>
                <select
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleFormChange}
                  required
                  disabled={!formData.category}
                >
                  <option value="">Select a subcategory</option>
                  {getSubcategories().map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  placeholder="Describe what you need..."
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="requiredQuantity">Quantity</label>
                <input
                  type="number"
                  id="requiredQuantity"
                  name="requiredQuantity"
                  value={formData.requiredQuantity}
                  onChange={handleFormChange}
                  min="1"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolInfraRequests; 