import React from 'react';
import './CubeLoader.css';

/**
 * Jumping square loader with website teal colors.
 * Used on PublicRoute and ProtectedRoute loading states.
 */
const CubeLoader = ({ size = 48 }) => {
  return (
    <div
      className="loader loader-teal"
      style={{ '--loader-size': `${size}px` }}
      aria-hidden
    />
  );
};

export default CubeLoader;
