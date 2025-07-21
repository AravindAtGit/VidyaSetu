import React from 'react';
import Navbar from './Navbar';
import VolunteerNavbar from './VolunteerNavbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { getUser, getRole } from '../utils/auth';

const PublicLayout = () => {
  const user = getUser();
  const userRole = getRole();
  
  // Choose navbar based on user role
  const getNavbar = () => {
    if (user && userRole === 'volunteer') {
      return <VolunteerNavbar />;
    }
    return <Navbar />;
  };

  return (
    <div className="app-container">
      {getNavbar()}
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout; 