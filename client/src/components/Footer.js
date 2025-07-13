import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>VidyaSetu</h3>
            <p>Bridging the gap in education through volunteer-driven learning and community support.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/how-to-participate">How to Participate</a></li>
              <li><a href="/contribute">Contribute</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Get Involved</h4>
            <ul>
              <li><a href="/register">Register as Volunteer</a></li>
              <li><a href="/register">Register as Student</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/contribute">Donate</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>Email: info@vidyasetu.org</li>
              <li>Phone: +91 98765 43210</li>
              <li>Address: Mumbai, Maharashtra</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 VidyaSetu. All rights reserved.</p>
          <p>Empowering education through community collaboration</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 