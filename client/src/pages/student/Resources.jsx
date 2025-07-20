import React, { useState, useEffect } from 'react';
import { load } from '../../utils/storage';
import './StudentPages.css';

const Resources = () => {
  const [videos, setVideos] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setVideos(load('videos', []));
    setPdfs(load('pdfs', []));
  };

  const filteredContent = () => {
    let content = [...videos, ...pdfs];

    if (filterType !== 'all') {
      content = content.filter(item => item.type === filterType);
    }

    if (searchTerm) {
      content = content.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.class.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return content;
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
              className={`filter-btn ${filterType === 'video/mp4' ? 'active' : ''}`}
              onClick={() => setFilterType('video/mp4')}
            >
              Videos
            </button>
            <button 
              className={`filter-btn ${filterType === 'application/pdf' ? 'active' : ''}`}
              onClick={() => setFilterType('application/pdf')}
            >
              PDFs
            </button>
          </div>
        </div>

        {/* Content Grid */}
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
      </div>
    </div>
  );
};

export default Resources; 