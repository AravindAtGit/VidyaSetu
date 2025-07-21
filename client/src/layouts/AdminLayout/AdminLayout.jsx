import React from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import AdminFooter from './AdminFooter';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="app-container">
      <AdminNavbar />
      <main className="app-main">
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout; 