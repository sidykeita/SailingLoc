import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Configuration globale pour les tests
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Désactiver le réseau pendant les tests pour éviter des erreurs non déterministes
if (!global.fetch) {
  global.fetch = vi.fn(() => Promise.reject(new Error('network disabled in tests')));
}

// Stub XMLHttpRequest pour les lib qui l'utilisent
if (!global.XMLHttpRequest) {
  global.XMLHttpRequest = class {
    open() {}
    send() {}
    setRequestHeader() {}
    abort() {}
    addEventListener() {}
    removeEventListener() {}
  };
}
