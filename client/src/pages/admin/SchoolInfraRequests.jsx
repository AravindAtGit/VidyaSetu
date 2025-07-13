import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SchoolInfraRequests.css';

const SchoolInfraRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [requiredQuantity, setRequiredQuantity] = useState(1);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
    fetchCategories();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/school/infra/requests', {
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
      const response = await fetch('/api/infra/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    
    if (!selectedCategory || !selectedSubcategory) {
      alert('Please select both category and subcategory');
      return;
    }

    try {
      setCreating(true);
      const response = await fetch('/api/school/infra/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          category: selectedCategory,
          subcategory: selectedSubcategory,
          description,
          requiredQuantity: parseInt(requiredQuantity)
        })
      });

      if (response.ok) {
        alert('Request created successfully!');
        setShowCreateForm(false);
        resetForm();
        fetchRequests();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to create request');
      }
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request');
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setDescription('');
    setRequiredQuantity(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory('');
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

  const selectedCategoryData = categories.find(cat => cat.name === selectedCategory);

  if (loading) {
    return (
      <div className="school-requests-container">
        <div className="loading">Loading your requests...</div>
      </div>
    );
  }

  return (
    <div className="school-requests-container">
      <div className="requests-header">
        <h1>Infrastructure Requests</h1>
        <p>Manage your school's infrastructure needs</p>
        <button 
          className="create-button"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create New Request'}
        </button>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
        </div>
      )}

      {showCreateForm && (
        <div className="create-form-section">
          <h2>Create New Infrastructure Request</h2>
          <form onSubmit={handleCreateRequest} className="create-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subcategory">Subcategory *</label>
                <select
                  id="subcategory"
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  disabled={!selectedCategory}
                  required
                >
                  <option value="">Select Subcategory</option>
                  {selectedCategoryData?.subcategories.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide additional details about your request..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Required Quantity</label>
              <input
                type="number"
                id="quantity"
                value={requiredQuantity}
                onChange={(e) => setRequiredQuantity(e.target.value)}
                min="1"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create Request'}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
                disabled={creating}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="requests-section">
        {requests.length === 0 ? (
          <div className="no-requests">
            <h3>No Requests Found</h3>
            <p>You haven't created any infrastructure requests yet.</p>
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
                  <p><strong>Subcategory:</strong> {request.subcategory}</p>
                  {request.description && (
                    <p><strong>Description:</strong> {request.description}</p>
                  )}
                  <p><strong>Quantity:</strong> {request.remainingQuantity}/{request.requiredQuantity}</p>
                  <p><strong>Created:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                  <p><strong>Request ID:</strong> #{request._id.slice(-6)}</p>
                </div>
                
                <div className="request-actions">
                  <button
                    className="view-applications-button"
                    onClick={() => navigate(`/admin/infra/apps/${request._id}`)}
                  >
                    View Applications
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolInfraRequests; 