import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative">
        <div className="loader-orb"></div>
        <div className="mt-4 text-center">
          <p className="text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
      
      <style jsx>{`
        .loader-orb {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: radial-gradient(circle, #8A2BE2, #FF0000);
          animation: pulse-glow 2s ease-in-out infinite;
          box-shadow: 0 0 20px #8A2BE2, 0 0 40px #FF0000;
        }

        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 20px #8A2BE2, 0 0 40px #8A2BE2;
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 30px #FF0000, 0 0 60px #FF0000;
            transform: scale(1.1);
          }
          100% {
            box-shadow: 0 0 20px #8A2BE2, 0 0 40px #8A2BE2;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;