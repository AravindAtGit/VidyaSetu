import React, { useState, useEffect } from 'react';
import './VolunteerCarousel.css';

// Import carousel images
import image1 from '../../assets/image1.jpg';
import image2 from '../../assets/image2.png';

const VolunteerCarousel = () => {
  // State for current slide
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Array of imported images
  const carouselImages = [
    image1,
    image2,
  ];

  // Auto-advance functionality
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
      }, 4000); // Change slide every 4 seconds

      return () => clearInterval(interval);
    }
  }, [carouselImages.length, isPaused]);

  // Navigation functions
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div 
      className="volunteer-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="carousel-container">
        {/* Previous button */}
        <button 
          className="carousel-btn carousel-btn-prev" 
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          ‹
        </button>

        {/* Carousel images */}
        <div className="carousel-images">
          {carouselImages.map((image, index) => (
            <img 
              key={index}
              src={image} 
              alt={`Volunteer slide ${index + 1}`} 
              className={`carousel-image ${index === currentSlide ? 'active' : ''}`}
              style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
            />
          ))}
        </div>

        {/* Next button */}
        <button 
          className="carousel-btn carousel-btn-next" 
          onClick={nextSlide}
          aria-label="Next slide"
        >
          ›
        </button>

        {/* Dot indicators */}
        <div className="carousel-dots">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VolunteerCarousel;
