import React from 'react';
import './AdminFooter.css';

const AdminFooter = () => {
  return (
    <footer className="admin-footer">
      <div className="admin-footer-container">
        <div className="admin-footer-content">
          <div className="admin-footer-section">
            <h3>VidyaSetu Admin Panel</h3>
            <p>Managing educational resources and volunteer coordination</p>
          </div>
          
          <div className="admin-footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/admin/dashboard">Dashboard</a></li>
              <li><a href="/admin/students">Students</a></li>
              <li><a href="/admin/volunteers">Volunteers</a></li>
              <li><a href="/admin/reports">Reports</a></li>
            </ul>
          </div>
          
          <div className="admin-footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="/admin/help">Help Center</a></li>
              <li><a href="/admin/contact">Contact Admin</a></li>
              <li><a href="/admin/settings">Settings</a></li>
            </ul>
          </div>
        </div>
        
        <div className="admin-footer-bottom">
          <p>&copy; 2024 VidyaSetu Admin Panel. All rights reserved.</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter; 