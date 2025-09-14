import '@testing-library/jest-dom';

// Configuration globale pour les tests
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};
