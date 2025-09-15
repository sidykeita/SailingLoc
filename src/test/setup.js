import '@testing-library/jest-dom';

// Ce setup est aussi référencé par Vitest en mode multi-projets.
// Protéger l'accès à window quand l'environnement n'est pas jsdom.
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = function() {
      return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
      };
    };
  }
}
