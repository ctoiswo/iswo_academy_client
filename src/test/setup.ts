import '@testing-library/jest-dom'

  // Provide a shim for Vite's import.meta.env so source files keep working in Jest.
  // The jest-transform.cjs replaces `import.meta.env` with `globalThis.__VITE_ENV__`.
  ; (globalThis as Record<string, unknown>).__VITE_ENV__ = {
    VITE_API_URL: 'http://localhost:3001/api/v1',
    VITE_CABLE_URL: 'ws://localhost:3001/cable',
    DEV: false,
    PROD: true,
    MODE: 'test',
  }

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
  },
  writable: true,
})

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
})

// Mock ResizeObserver for chart components
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

