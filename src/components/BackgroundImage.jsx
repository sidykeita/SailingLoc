import React from 'react';
import adminBackground from '../assets/images/admin.jpeg';

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
      backgroundColor: '#ffffff', /* Fond blanc au lieu de bleu clair */
    }}>
      <img 
        src={adminBackground} 
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
