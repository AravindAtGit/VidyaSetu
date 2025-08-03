import React from 'react';
import { FiHome, FiUsers, FiUser, FiGift } from 'react-icons/fi';
import './Statistics.css';

/**
 * VolunteerProgrammeCards
 * 
 * Props:
 *   - schoolsCount: number
 *   - volunteersCount: number
 *   - childrenCount: number
 *   - contributionsCount: number
 */
export default function Statistics({
  schoolsCount,
  volunteersCount,
  childrenCount,
  contributionsCount,
}) {
  const cards = [
    {
      title: 'Schools',
      subtitle: 'Onboarded Schools',
      icon: <FiHome className="card-icon icon-primary" />,
      count: schoolsCount,
      testId: 'schools-count',
    },
    {
      title: 'Volunteers',
      subtitle: 'Volunteers Registered',
      icon: <FiUsers className="card-icon icon-secondary" />,
      count: volunteersCount,
      testId: 'volunteers-count',
    },
    {
      title: 'Children',
      subtitle: 'Children Impacted',
      icon: <FiUser className="card-icon icon-tertiary" />,
      count: childrenCount,
      testId: 'children-count',
    },
    {
      title: 'Contributions',
      subtitle: 'Total Contributions',
      icon: <FiGift className="card-icon icon-quaternary" />,
      count: contributionsCount,
      testId: 'contributions-count',
    },
  ];

  return (
    <section 
      className="cards-grid-container" 
      aria-labelledby="statistics-heading"
    >
      <h2 id="statistics-heading" className="section-title">A School Volunteer Programme</h2>
      <div className="cards-grid" role="group" aria-label="Programme statistics">
        {cards.map(({ title, subtitle, icon, count, testId }) => (
          <div 
            key={title} 
            className="card" 
            data-testid={testId}
            tabIndex="0"
            role="article"
            aria-labelledby={`${testId}-title`}
            aria-describedby={`${testId}-subtitle ${testId}-count`}
          >
            <div className="card-header">
              <div className="card-icon-wrapper" aria-hidden="true">{icon}</div>
              <h3 id={`${testId}-title`} className="card-title">{title}</h3>
            </div>
            <div className="card-content">
              <div id={`${testId}-count`} className="card-count" aria-label={`${count.toLocaleString()} ${title.toLowerCase()}`}>
                {count.toLocaleString()}
              </div>
              <p id={`${testId}-subtitle`} className="card-subtitle">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
