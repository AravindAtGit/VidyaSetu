import React from 'react';
import './Home.css';
import VolunteerCarousel from '../../components/volunteer/VolunteerCarousel';

const PublicHome = () => {
  return (
    <div className="public-home">
      <VolunteerCarousel />
    </div>
  );
};

export default PublicHome; 
