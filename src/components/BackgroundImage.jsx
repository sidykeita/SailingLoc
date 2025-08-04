import React from 'react';

const BackgroundImage = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      backgroundColor: '#f0f8ff', /* Couleur de fond de secours */
    }}>
      <img 
        src="/admin.jpeg" 
        alt="Background" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.8, /* Pour créer un effet d'overlay */
        }} 
      />
    </div>
  );
};

export default BackgroundImage;
