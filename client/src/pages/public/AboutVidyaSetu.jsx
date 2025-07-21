import React from 'react';
import './AboutVidyaSetu.css';

const AboutVidyaSetu = () => {
  return (
    <div className="about-page">
      <div className="about-card">
        <h1>About VidyaSetu</h1>
        <p>
          VidyaSetu is a platform dedicated to connecting students with passionate volunteer educators, providing access to quality learning resources and support. Our mission is to bridge educational gaps and empower learners everywhere.
        </p>
        <div className="about-section">
          <h2>Our Vision</h2>
          <p>
            To create an inclusive, accessible, and supportive learning environment for every student, regardless of background or location.
          </p>
        </div>
        <div className="about-section">
          <h2>How It Works</h2>
          <ul>
            <li>Students register and access free learning resources.</li>
            <li>Volunteers sign up to teach, mentor, or contribute content.</li>
            <li>Schools and organizations can manage and track student progress.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutVidyaSetu; 