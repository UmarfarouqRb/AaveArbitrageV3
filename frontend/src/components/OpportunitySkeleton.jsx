import React from 'react';

const OpportunitySkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line title"></div>
      <div className="skeleton-line text"></div>
      <div className="skeleton-line text"></div>
      <div className="skeleton-line text short"></div>
    </div>
  );
};

export default OpportunitySkeleton;
