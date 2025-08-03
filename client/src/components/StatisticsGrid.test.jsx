import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatisticsGrid from './StatisticsGrid';

// Mock CSS file
jest.mock('./StatisticsGrid.css', () => ({}));

// Mock StatisticsCard component
jest.mock('./StatisticsCard', () => {
  return function MockStatisticsCard({ icon, label, count }) {
    return (
      <div data-testid="statistics-card">
        <span data-testid="icon">{icon}</span>
        <span data-testid="label">{label}</span>
        <span data-testid="count">{count}</span>
      </div>
    );
  };
});

// Mock the statistics service
jest.mock('../services/statisticsService', () => ({
  getStatistics: jest.fn()
}));

describe('StatisticsGrid Component', () => {
  const mockStatisticsData = {
    students: 1250,
    schools: 25,
    volunteers: 150,
    contributions: 500
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    const { getStatistics } = require('../services/statisticsService');
    getStatistics.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<StatisticsGrid />);
    
    expect(screen.getByText(text => text.includes('loading'))).toBeInTheDocument;
    expect(screen.getAllByClassName('statistics-card-skeleton')).toHaveLength(4);
  });

  test('renders statistics cards after successful data fetch', async () => {
    const { getStatistics } = require('../services/statisticsService');
    getStatistics.mockResolvedValue(mockStatisticsData);
    
    render(<StatisticsGrid />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('statistics-card')).toHaveLength(4);
    });
    
    expect(screen.getByText('👥')).toBeInTheDocument();
    expect(screen.getByText('Students')).toBeInTheDocument();
    expect(screen.getByText('1250')).toBeInTheDocument();
    
    expect(screen.getByText('🏫')).toBeInTheDocument();
    expect(screen.getByText('Schools')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  test('renders error state when data fetch fails', async () => {
    const { getStatistics } = require('../services/statisticsService');
    getStatistics.mockRejectedValue(new Error('Network error'));
    
    render(<StatisticsGrid />);
    
    await waitFor(() => {
      expect(screen.getByText('Unable to Load Statistics')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Failed to load statistics. Please try again later.')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  test('uses custom data fetcher when provided', async () => {
    const customDataFetcher = jest.fn().mockResolvedValue(mockStatisticsData);
    
    render(<StatisticsGrid dataFetcher={customDataFetcher} />);
    
    await waitFor(() => {
      expect(customDataFetcher).toHaveBeenCalled();
    });
  });

  test('uses custom error props', async () => {
    const { getStatistics } = require('../services/statisticsService');
    getStatistics.mockRejectedValue(new Error('Test error'));
    
    const errorProps = {
      message: 'Custom error message',
      title: 'Custom Error Title',
      retryButtonText: 'Retry Now',
      icon: '❌'
    };
    
    render(<StatisticsGrid errorProps={errorProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.getByText('Retry Now')).toBeInTheDocument();
    expect(screen.getByText('❌')).toBeInTheDocument();
  });

  test('uses custom statistics configuration', async () => {
    const { getStatistics } = require('../services/statisticsService');
    const customData = { employees: 100, offices: 5 };
    getStatistics.mockResolvedValue(customData);
    
    const customConfig = [
      { icon: '👨‍💼', label: 'Employees', dataKey: 'employees' },
      { icon: '🏢', label: 'Offices', dataKey: 'offices' }
    ];
    
    render(<StatisticsGrid statisticsConfig={customConfig} />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('statistics-card')).toHaveLength(2);
    });
    
    expect(screen.getByText('👨‍💼')).toBeInTheDocument();
    expect(screen.getByText('Employees')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    
    expect(screen.getByText('🏢')).toBeInTheDocument();
    expect(screen.getByText('Offices')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('applies custom className', async () => {
    const { getStatistics } = require('../services/statisticsService');
    getStatistics.mockResolvedValue(mockStatisticsData);
    
    const { container } = render(
      <StatisticsGrid className="custom-grid" />
    );
    
    await waitFor(() => {
      expect(container.querySelector('.statistics-grid-container')).toHaveClass('custom-grid');
    });
  });

  test('handles missing data keys gracefully', async () => {
    const { getStatistics } = require('../services/statisticsService');
    getStatistics.mockResolvedValue({ students: 100 }); // Missing other keys
    
    render(<StatisticsGrid />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('statistics-card')).toHaveLength(4);
    });
    
    // Should show 0 for missing data
    expect(screen.getAllByText('0')).toHaveLength(3);
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
