import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatisticsCard from './StatisticsCard';

// Mock CSS file
jest.mock('./StatisticsCard.css', () => ({}));

describe('StatisticsCard Component', () => {
  test('renders with basic props', () => {
    render(
      <StatisticsCard 
        icon="👥" 
        label="Users" 
        count={1250} 
      />
    );
    
    expect(screen.getByText('👥')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('1250')).toBeInTheDocument();
  });

  test('renders with JSX icon', () => {
    const CustomIcon = () => <svg data-testid="custom-icon">Icon</svg>;
    
    render(
      <StatisticsCard 
        icon={<CustomIcon />} 
        label="Custom Stat" 
        count="2.5K" 
      />
    );
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByText('Custom Stat')).toBeInTheDocument();
    expect(screen.getByText('2.5K')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(
      <StatisticsCard 
        icon="📊" 
        label="Analytics" 
        count={500} 
        className="custom-card"
      />
    );
    
    expect(container.firstChild).toHaveClass('statistics-card', 'custom-card');
  });

  test('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0', padding: '20px' };
    
    const { container } = render(
      <StatisticsCard 
        icon="💼" 
        label="Business" 
        count={100} 
        style={customStyle}
      />
    );
    
    expect(container.firstChild).toHaveStyle('background-color: #f0f0f0');
    expect(container.firstChild).toHaveStyle('padding: 20px');
  });

  test('renders with string count', () => {
    render(
      <StatisticsCard 
        icon="⭐" 
        label="Rating" 
        count="4.8/5" 
      />
    );
    
    expect(screen.getByText('4.8/5')).toBeInTheDocument();
  });

  test('renders with zero count', () => {
    render(
      <StatisticsCard 
        icon="🎯" 
        label="Goals" 
        count={0} 
      />
    );
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('has correct data attribute for count', () => {
    render(
      <StatisticsCard 
        icon="📈" 
        label="Growth" 
        count={150} 
      />
    );
    
    const countElement = screen.getByText('150');
    expect(countElement).toHaveAttribute('data-value', '150');
  });

  test('has correct accessibility structure', () => {
    render(
      <StatisticsCard 
        icon="🎨" 
        label="Designs" 
        count={42} 
      />
    );
    
    // Check that the structure is accessible
    const card = screen.getByText('🎨').closest('.statistics-card');
    expect(card).toBeInTheDocument();
    expect(card.querySelector('.icon')).toBeInTheDocument();
    expect(card.querySelector('.content')).toBeInTheDocument();
    expect(card.querySelector('.label')).toBeInTheDocument();
    expect(card.querySelector('.count')).toBeInTheDocument();
  });
});
