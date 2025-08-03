import React, { useState, useEffect } from 'react';
import './Home.css';
import { getStatistics } from '../../services/statisticsService';
import VolunteerCarousel from '../../components/volunteer/VolunteerCarousel';
import Statistics from './Statistics';

const PublicHome = () => {
  const [stats, setStats] = useState({
    schools: 0,
    volunteers: 0,
    children: 0,
    contributions: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getStatistics()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="public-home">
      <VolunteerCarousel />

      {/* Accessibility: aria-live region for loading/error messages */}
      <div aria-live="polite" className="status-messages">
        {loading && <div className="loading-message">Loading statistics...</div>}
        {error && <div className="error-message" role="alert">{error}</div>}
      </div>

      {!loading && !error && (
        <Statistics 
          schoolsCount={stats.schools}
          volunteersCount={stats.volunteers}
          childrenCount={stats.children}
          contributionsCount={stats.contributions}
        />
      )}
    </div>
  );
};

export default PublicHome; 
