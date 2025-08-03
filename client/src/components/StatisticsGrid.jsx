import React, { useState, useEffect } from 'react';
import StatisticsCard from './StatisticsCard';
import { getStatistics } from '../services/statisticsService';
import './StatisticsGrid.css';

/**
 * A grid component that displays statistics cards with loading and error states.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Array} [props.statisticsConfig] - Custom configuration for statistics cards
 * @param {Function} [props.dataFetcher] - Custom function to fetch statistics data
 * @param {string} [props.className=''] - Additional CSS classes to apply to the grid container
 * @param {Object} [props.loadingProps={}] - Props to customize loading state
 * @param {Object} [props.errorProps={}] - Props to customize error state
 * @returns {JSX.Element} The statistics grid component
 * 
 * @example
 * // Basic usage (uses default config and data fetcher)
 * <StatisticsGrid />
 * 
 * @example
 * // With custom configuration
 * <StatisticsGrid 
 *   statisticsConfig={[
 *     { icon: '👨‍💼', labelKey: 'employees', label: 'Employees' },
 *     { icon: '🏢', labelKey: 'offices', label: 'Offices' }
 *   ]}
 *   dataFetcher={customDataFetcher}
 *   className="custom-grid"
 * />
 */
const StatisticsGrid = ({ 
  statisticsConfig = null,
  dataFetcher = getStatistics,
  className = '',
  loadingProps = {},
  errorProps = {} 
}) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dataFetcher();
        setStatistics(data);
      } catch (err) {
        setError(errorProps.message || 'Failed to load statistics. Please try again later.');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [dataFetcher, errorProps.message]);

  if (loading) {
    const skeletonCount = loadingProps.skeletonCount || (statisticsConfig ? statisticsConfig.length : 4);
    return (
      <div className={`statistics-grid-container ${className}`}>
        <div className="statistics-grid loading">
          {[...Array(skeletonCount)].map((_, index) => (
            <div key={index} className="statistics-card-skeleton">
              <div className="skeleton-icon"></div>
              <div className="skeleton-content">
                <div className="skeleton-label"></div>
                <div className="skeleton-count"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    const errorIcon = errorProps.icon || '⚠️';
    const errorTitle = errorProps.title || 'Unable to Load Statistics';
    const retryButtonText = errorProps.retryButtonText || 'Try Again';
    const onRetry = errorProps.onRetry || (() => window.location.reload());
    
    return (
      <div className={`statistics-grid-container ${className}`}>
        <div className="error-state">
          <div className="error-icon">{errorIcon}</div>
          <h3>{errorTitle}</h3>
          <p>{error}</p>
          <button 
            onClick={onRetry} 
            className="retry-button"
          >
            {retryButtonText}
          </button>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  // Use custom config if provided, otherwise use default
  const configToUse = statisticsConfig || [
    {
      icon: '👥',
      label: 'Students',
      dataKey: 'students'
    },
    {
      icon: '🏫',
      label: 'Schools',
      dataKey: 'schools'
    },
    {
      icon: '🙋‍♂️',
      label: 'Volunteers',
      dataKey: 'volunteers'
    },
    {
      icon: '📚',
      label: 'Contributions',
      dataKey: 'contributions'
    }
  ];

  const statisticsData = configToUse.map(config => ({
    icon: config.icon,
    label: config.label,
    count: statistics[config.dataKey] || 0
  }));

  return (
    <div className={`statistics-grid-container ${className}`}>
      <div className="statistics-grid">
        {statisticsData.map((stat, index) => (
          <StatisticsCard
            key={index}
            icon={stat.icon}
            label={stat.label}
            count={stat.count}
          />
        ))}
      </div>
    </div>
  );
};

export default StatisticsGrid;
