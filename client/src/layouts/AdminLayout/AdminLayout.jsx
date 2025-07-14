import React from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import AdminFooter from './AdminFooter';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <main className="app-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout; 