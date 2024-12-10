import React from 'react';

const SpaceshipAnimation = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="spaceship-path">
        <div className="spaceship">
          <svg viewBox="0 0 24 24" width="32" height="32">
            <path 
              fill="rgba(59, 130, 246, 0.8)" 
              d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SpaceshipAnimation;  