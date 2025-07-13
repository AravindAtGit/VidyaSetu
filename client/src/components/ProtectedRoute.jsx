import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser, getRole } from '../utils/auth.js';

const ProtectedRoute = ({ children, role }) => {
  // Check if user is authenticated using our auth functions
  const user = getUser();
  const userRole = getRole();
  const isAuthenticated = user && (user.email || user.studentId);
  
  // If no role is specified, just check authentication
  if (!role) {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  }
  
  // If role is specified, check both authentication and role
  const hasCorrectRole = isAuthenticated && userRole === role;
  
  return hasCorrectRole ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute; 