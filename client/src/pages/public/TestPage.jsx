import React from 'react';
import './TestPage.css';

const TestPage = () => {
  return (
    <div className="test-page">
      <div className="test-card">
        <h1>Test Page</h1>
        <p>This is a test page to verify routing is working correctly.</p>
        <p>If you can see this page, the routing is working!</p>
      </div>
    </div>
  );
};

export default TestPage; 