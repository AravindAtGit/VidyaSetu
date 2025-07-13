import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContributePage.css';

const ContributePage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check user role from session/localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role);
    
    fetchCategories();
    fetchRequests();
  }, []);

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

  const fetchRequests = async () => {
    try {
      setLoading(true);
      let url = '/api/volunteer/infra/requests?';
      const params = new URLSearchParams();
      
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedSubcategory) params.append('subcategory', selectedSubcategory);
      if (searchTerm) params.append('search', searchTerm);
      
      url += params.toString();
      
      const response = await fetch(url, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else if (response.status === 401) {
        // User not logged in, show empty state
        setRequests([]);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedCategory, selectedSubcategory, searchTerm]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory(''); // Reset subcategory when category changes
  };

  const handleViewRequest = (requestId) => {
    if (userRole === 'volunteer') {
      navigate(`/volunteer/infra/apply/${requestId}`);
    } else if (userRole === 'school') {
      navigate(`/school/infra/apps/${requestId}`);
    } else {
      // For non-logged in users, redirect to login
      navigate('/login/volunteer');
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

  const selectedCategoryData = categories.find(cat => cat.name === selectedCategory);

  return (
    <div className="contribute-page">
      <div className="contribute-header">
        <h1>Infrastructure Requests</h1>
        <p>Browse and contribute to infrastructure needs of schools</p>
      </div>

      <div className="filters-section">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="subcategory">Subcategory:</label>
            <select
              id="subcategory"
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              disabled={!selectedCategory}
            >
              <option value="">All Subcategories</option>
              {selectedCategoryData?.subcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="search">Search:</label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search requests..."
            />
          </div>
        </div>
      </div>

      <div className="requests-section">
        {loading ? (
          <div className="loading">Loading requests...</div>
        ) : (
          <div className="requests-grid">
            {requests.length === 0 ? (
              <div className="no-requests">
                <p>No infrastructure requests found matching your criteria.</p>
              </div>
            ) : (
              requests.map((request) => (
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
                    <p><strong>School:</strong> {request.school?.schoolName || 'N/A'}</p>
                    <p><strong>Location:</strong> {request.school?.location || 'N/A'}</p>
                    <p><strong>Request ID:</strong> #{request._id.slice(-6)}</p>
                  </div>
                  
                  <div className="request-actions">
                    <button
                      className="view-button"
                      onClick={() => handleViewRequest(request._id)}
                    >
                      {userRole === 'volunteer' ? 'Apply Now' : 
                       userRole === 'school' ? 'View & Update' : 'View Details'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributePage; 