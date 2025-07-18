import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative flex flex-col items-center">
        <svg className="animate-spin h-14 w-14 text-purple-500" viewBox="0 0 50 50">
          <circle
            className="opacity-20"
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
          />
          <circle
            className="opacity-80"
            cx="25"
            cy="25"
            r="20"
            stroke="#FF0000"
            strokeWidth="6"
            fill="none"
            strokeDasharray="90 150"
            strokeLinecap="round"
          />
        </svg>
        <div className="mt-4 text-center">
          <p className="text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;