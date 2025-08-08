import React from 'react';

const LoaderDots = ({ text = 'Chargement en cours...' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '24px 0' }}>
    <span style={{ fontWeight: 600, color: '#4257b2', marginBottom: 8 }}>{text}</span>
    <div style={{ display: 'flex', gap: 8 }}>
      <span className="dot" style={{ width: 12, height: 12, borderRadius: '50%', background: '#4257b2', animation: 'dot-bounce 1.2s infinite 0s' }}></span>
      <span className="dot" style={{ width: 12, height: 12, borderRadius: '50%', background: '#4257b2', animation: 'dot-bounce 1.2s infinite 0.2s' }}></span>
      <span className="dot" style={{ width: 12, height: 12, borderRadius: '50%', background: '#4257b2', animation: 'dot-bounce 1.2s infinite 0.4s' }}></span>
    </div>
    <style>{`
      @keyframes dot-bounce {
        0%, 80%, 100% { transform: scale(1); opacity: 1; }
        40% { transform: scale(1.5); opacity: 0.7; }
      }
    `}</style>
  </div>
);

export default LoaderDots;
