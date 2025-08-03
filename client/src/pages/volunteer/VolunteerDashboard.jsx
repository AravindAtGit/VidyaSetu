import React from 'react';

const VolunteerDashboard = () => {
  return (
    <div className="volunteer-dashboard">
      <h1>Volunteer Dashboard</h1>
      <p>Welcome to the Volunteer section of VidyaSetu.</p>
      <div className="dashboard-links">
        <a href="/volunteer/applications">My Applications</a>
        <a href="/volunteer/history">History</a>
        <a href="/volunteer/infra/requests">Infrastructure</a>
        <a href="/volunteer/infra/my-applications">My Infra Apps</a>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
