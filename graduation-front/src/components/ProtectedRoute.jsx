import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRoleFromToken } from '../utils/tokenutills.js';

const ProtectedRoute = ({ element, requiredRole, redirectTo }) => {
  // Get token from localStorage
  const token = localStorage.getItem('access_token');
  
  // Debugging: Log the token
  console.log('Token:', token);
  
  // If the token exists, get the role from the token
  let roles = null;
  if (token) {
    roles = getRoleFromToken(token);
  }

  // Debugging: Log the roles extracted from the token
  console.log('Roles:', roles);

  // Check if the token exists and if the requiredRole is in the roles array
  if (!token || !roles || !roles.includes(requiredRole)) {
    console.log('Redirecting to login...');
    return <Navigate to={redirectTo || "/login"} />;
  }

  // Debugging: If access is granted, log that we're rendering the element
  console.log('Access granted. Rendering the element.');
  
  // If access is granted, render the element
  return element;
};

export default ProtectedRoute;
