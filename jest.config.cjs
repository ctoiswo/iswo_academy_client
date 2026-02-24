/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jest-environment-jsdom',

  // Run setup file after jest is installed in the environment
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],

  // Transform TypeScript/TSX via custom wrapper that handles import.meta.env
  transform: {
    '^.+\\.(t|j)sx?$': '<rootDir>/jest-transform.cjs',
  },

  // Don't transform these node_modules (most are already CJS)
  transformIgnorePatterns: [
    '/node_modules/(?!(@tanstack|framer-motion|lucide-react|recharts|cmdk)/)',
  ],

  // Module name mapping: path aliases + static assets
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/test/__mocks__/fileMock.cjs',
    '\\.(jpg|jpeg|png|gif|webp|svg|ico)$': '<rootDir>/src/test/__mocks__/fileMock.cjs',
  },

  // Only run files matching these patterns
  testMatch: [
    '**/__tests__/**/*.{ts,tsx}',
    '**/*.test.{ts,tsx}',
    '**/*.spec.{ts,tsx}',
  ],

  // Collect coverage from src (excluding test files, routes gen, etc.)
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/test/**',
    '!src/routeTree.gen.ts',
    '!src/vite-env.d.ts',
    '!src/main.tsx',
  ],

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],

  // Jest globals are enabled automatically (describe, it, expect, jest, etc.)
  // No need to import them from '@jest/globals' in test files
}
