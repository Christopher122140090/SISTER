import React from 'react';

const DummyWindowIcon = (props) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#e3f2fd"  /* match bg-window background color */
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="#e3f2fd" /> {/* match bg-window background color */}
    <line x1="12" y1="3" x2="12" y2="21" />
  </svg>
);

export default DummyWindowIcon;
