import React from 'react';
import './StatisticsCard.css';

/**
 * A reusable statistics card component that displays an icon, label, and count.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.icon - Icon to display (can be emoji, JSX element, or string)
 * @param {string} props.label - Text label describing the statistic
 * @param {number|string} props.count - The numerical value or count to display
 * @param {string} [props.className=''] - Additional CSS classes to apply to the card
 * @param {Object} [props.style={}] - Inline styles to apply to the card
 * @returns {JSX.Element} The statistics card component
 * 
 * @example
 * // Basic usage with emoji icon
 * <StatisticsCard 
 *   icon="👥" 
 *   label="Users" 
 *   count={1250} 
 * />
 * 
 * @example
 * // With custom styling and JSX icon
 * <StatisticsCard 
 *   icon={<UserIcon />} 
 *   label="Active Members" 
 *   count="2.5K" 
 *   className="custom-card"
 *   style={{ backgroundColor: '#f0f0f0' }}
 * />
 */
const StatisticsCard = ({ 
  icon, 
  label, 
  count, 
  className = '', 
  style = {} 
}) => {
  return (
    <div 
      className={`statistics-card ${className}`}
      style={style}
    >
      <div className="icon">{icon}</div>
      <div className="content">
        <span className="label">{label}</span>
        <span className="count" data-value={count}>{count}</span>
      </div>
    </div>
  );
};

export default StatisticsCard;
