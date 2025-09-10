import React from 'react';

interface ShimmerProps {
  count?: number; // Number of shimmer lines to display
  height?: string; // Height of each shimmer line
  className?: string; // Additional classes for the shimmer container
}

export const Shimmer: React.FC<ShimmerProps> = ({ count = 3, height = 'h-4', className = '' }) => {
  return (
    <div className={`animate-pulse space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`bg-gray-300 rounded ${height}`}></div>
      ))}
    </div>
  );
};