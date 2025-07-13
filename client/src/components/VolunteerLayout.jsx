import React from 'react';
import VolunteerNavbar from './VolunteerNavbar.jsx';
import Footer from './Footer.js';
import { Outlet } from 'react-router-dom';

const VolunteerLayout = () => (
  <div className="flex flex-col min-h-screen">
    <VolunteerNavbar />
    <main className="app-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default VolunteerLayout; 