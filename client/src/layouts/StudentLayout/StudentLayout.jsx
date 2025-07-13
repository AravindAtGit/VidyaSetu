import React from 'react';
import StudentNavbar from '../../components/StudentNavbar';
import StudentFooter from './StudentFooter';
import { Outlet } from 'react-router-dom';

const StudentLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <StudentNavbar />
      <main className="app-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      <StudentFooter />
    </div>
  );
};

export default StudentLayout; 