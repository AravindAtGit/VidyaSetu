import React from 'react';
import StudentNavbar from '../../components/StudentNavbar';
import { Outlet } from 'react-router-dom';

const StudentLayout = () => {
  return (
    <div className="app-container">
      <StudentNavbar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout; 