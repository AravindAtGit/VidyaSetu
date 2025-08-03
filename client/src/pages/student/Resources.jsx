import React, { useState } from 'react';
import { useContent } from '../../hooks';
import './StudentPages.css';

const Resources = () =e {
  const { content, loading, error } = useContent();
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContent = () =e {
    let filteredData = [...content];

    if (filterType !== 'all') {
      if (filterType === 'video') {
        filteredData = filteredData.filter(item =e item.type === 'video');
      } else if (filterType === 'pdf') {
        filteredData = filteredData.filter(item =e item.type === 'pdf');
      }
    }

    if (searchTerm) {
      filteredData = filteredData.filter(item =e 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.class.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filteredData;
  };
  return (
    <div className="student-page">
      <div className="page-header">
        <h1>Learning Resources</h1>
        <p>Access educational materials and study resources</p>
      </div>
      
      <div className="page-content">
        {/* Filter and Search */}
        <div className="filter-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-options">
            <button 
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filterType === 'video' ? 'active' : ''}`}
              onClick={() =e setFilterType('video')}
            >
              Videos
            </button>
            <button 
              className={`filter-btn ${filterType === 'pdf' ? 'active' : ''}`}
              onClick={() =e setFilterType('pdf')}
            >
              PDFs
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="loading">
            <p>Loading resources...</p>
          </div>
        ) : error ? (
          <div className="error">
            <p>Error loading resources: {error}</p>
          </div>
        ) : (
          <div className="resources-grid">
            {filteredContent().length === 0 ? (
            <div className="no-resources">
              <div className="no-resources-icon">📚</div>
              <h3>No resources found</h3>
              <p>There are no resources available matching your search criteria.</p>
            </div>
          ) : (
            filteredContent().map((resource, index) => (
              <div key={index} className="resource-card">
                <div className="resource-type">
                  {resource.type === 'video/mp4' ? '🎥' : '📄'}
                </div>
                <div className="resource-content">
                  <h3>{resource.title}</h3>
                  <p className="resource-subject">{resource.subject}</p>
                  <p className="resource-class">{resource.class}</p>
                  <div className="resource-meta">
                    <span>Uploaded: {new Date(resource.uploadDate).toLocaleDateString()}</span>
                    <span>Size: {Math.round(resource.size / 1024 / 1024 * 100) / 100} MB</span>
                  </div>
                </div>
                <div className="resource-actions">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="view-btn"
                  >
                    {resource.type === 'video/mp4' ? 'Watch' : 'View'}
                  </a>
                  <a 
                    href={resource.url} 
                    download={resource.fileName}
                    className="download-btn"
                  >
                    Download
                  </a>
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

export default Resources; 