import React from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="app-container">
      <AdminNavbar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 