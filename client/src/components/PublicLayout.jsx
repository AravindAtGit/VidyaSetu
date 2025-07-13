import React from 'react';
import Navbar from './Navbar.js';
import Footer from './Footer.js';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="app-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout; 