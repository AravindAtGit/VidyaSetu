import React from 'react';
import { render, screen } from '@testing-library/react';
import VolunteerCarousel from './VolunteerCarousel';

// Mock the image imports
jest.mock('../../assets/image1.jpg', () => 'test-image-1.jpg');
jest.mock('../../assets/image2.png', () => 'test-image-2.png');

describe('VolunteerCarousel', () => {
  test('renders carousel component', () => {
    render(<VolunteerCarousel />);
    
    // Check if carousel container is present
    const carousel = screen.getByTestId ? screen.queryByTestId('volunteer-carousel') : document.querySelector('.volunteer-carousel');
    expect(carousel || document.querySelector('.volunteer-carousel')).toBeInTheDocument();
  });

  test('renders navigation buttons', () => {
    render(<VolunteerCarousel />);
    
    // Check for previous and next buttons using aria-labels
    const prevButton = screen.getByLabelText('Previous slide');
    const nextButton = screen.getByLabelText('Next slide');
    
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  test('renders carousel dots', () => {
    render(<VolunteerCarousel />);
    
    // Should have 2 dots for 2 images
    const dots = screen.getAllByLabelText(/Go to slide/);
    expect(dots).toHaveLength(2);
  });
});
