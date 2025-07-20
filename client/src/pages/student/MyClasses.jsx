import React, { useState, useEffect } from 'react';
import { load } from '../../utils/storage';
import './StudentPages.css';

const MyClasses = () => {
  const [virtualClasses, setVirtualClasses] = useState([]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setVirtualClasses(load('virtualClasses', []));
  };

  const filterClasses = () => {
    const now = new Date();
    let filtered = virtualClasses;

    switch (filterType) {
      case 'upcoming':
        filtered = filtered.filter(cls => new Date(cls.date) > now);
        break;
      case 'past':
        filtered = filtered.filter(cls => new Date(cls.date) < now);
        break;
      case 'today':
        filtered = filtered.filter(cls => {
          const classDate = new Date(cls.date);
          return classDate.toDateString() === now.toDateString();
        });
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const isUpcoming = (classDate) => {
    return new Date(classDate) > new Date();
  };

  const isToday = (classDate) => {
    const now = new Date();
    const cls = new Date(classDate);
    return cls.toDateString() === now.toDateString();
  };

  const getClassStatus = (classDate) => {
    const now = new Date();
    const cls = new Date(classDate);
    
    if (cls.toDateString() === now.toDateString()) {
      return 'today';
    } else if (cls > now) {
      return 'upcoming';
    } else {
      return 'past';
    }
  };

  return (
    <div className="student-page">
      <div className="page-header">
        <h1>My Virtual Classes</h1>
        <p>View and join your scheduled virtual classes</p>
      </div>
      
      <div className="page-content">
        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-options">
            <button 
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All Classes
            </button>
            <button 
              className={`filter-btn ${filterType === 'today' ? 'active' : ''}`}
              onClick={() => setFilterType('today')}
            >
              Today
            </button>
            <button 
              className={`filter-btn ${filterType === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilterType('upcoming')}
            >
              Upcoming
            </button>
            <button 
              className={`filter-btn ${filterType === 'past' ? 'active' : ''}`}
              onClick={() => setFilterType('past')}
            >
              Past
            </button>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="classes-grid">
          {filterClasses().length === 0 ? (
            <div className="no-classes">
              <div className="no-classes-icon">💻</div>
              <h3>No classes found</h3>
              <p>There are no virtual classes scheduled for the selected filter.</p>
            </div>
          ) : (
            filterClasses().map((cls, index) => {
              const status = getClassStatus(cls.date);
              return (
                <div key={index} className={`class-card ${status}`}>
                  <div className="class-header">
                    <h3>{cls.name}</h3>
                    <span className={`status-badge ${status}`}>
                      {status === 'today' ? 'Today' : status === 'upcoming' ? 'Upcoming' : 'Past'}
                    </span>
                  </div>
                  
                  <div className="class-details">
                    <div className="class-datetime">
                      <p><strong>Date:</strong> {new Date(cls.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {cls.time}</p>
                    </div>
                    <div className="class-meta">
                      <p><strong>Created:</strong> {new Date(cls.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="class-actions">
                    {status === 'today' || status === 'upcoming' ? (
                      <button 
                        className="join-btn"
                        onClick={() => alert('Virtual class integration coming soon!')}
                      >
                        {status === 'today' ? 'Join Now' : 'Join Class'}
                      </button>
                    ) : (
                      <button 
                        className="view-btn"
                        onClick={() => alert('View recording feature coming soon!')}
                      >
                        View Recording
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MyClasses; 