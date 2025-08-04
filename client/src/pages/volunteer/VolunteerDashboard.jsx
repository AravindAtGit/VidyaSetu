import React from 'react';
import { Carousel } from '../../components/common';

// Import carousel images explicitly
import image1 from '../../assets/volunteer/carousel/image1.png';
import image2 from '../../assets/volunteer/carousel/image2.jpg';
import educationSupport from '../../assets/volunteer/carousel/education-support.png';
import elderlyCare from '../../assets/volunteer/carousel/elderly-care-volunteers.jpg';
import environmental from '../../assets/volunteer/carousel/environmental-volunteers.jpg';
import foodDrive from '../../assets/volunteer/carousel/food-drive-volunteers.png';
import communityHelp from '../../assets/volunteer/carousel/volunteers-helping-community.jpg';

const VolunteerDashboard = () => {
  // Define carousel images with all available images
  const carouselImages = [
    image1,
    image2,
    educationSupport,
    elderlyCare,
    environmental,
    foodDrive,
    communityHelp
  ];

  return (
    <div className="volunteer-dashboard">
      <Carousel images={carouselImages} />
      <div className="dashboard-links">
        <a href="/volunteer/applications">My Applications</a>
        <a href="/volunteer/history">History</a>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
