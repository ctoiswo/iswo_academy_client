/**
 * Custom Jest transformer that:
 * 1. Replaces Vite-specific `import.meta.env` with a globalThis.__VITE_ENV__ shim
 *    so source files continue to work inside Jest's CommonJS environment.
 * 2. Delegates the actual TypeScript/TSX compilation to @swc/jest.
 */
'use strict'

const { createTransformer } = require('@swc/jest')

const swcTransform = createTransformer({
  jsc: {
    parser: {
      syntax: 'typescript',
      tsx: true,
      decorators: false,
      dynamicImport: true,
    },
    transform: {
      react: {
        runtime: 'automatic',
      },
    },
    target: 'es2020',
    baseUrl: '.',
    paths: {
      '@/*': ['./src/*'],
    },
  },
  module: {
    type: 'commonjs',
    noInterop: false,
  },
  sourceMaps: 'inline',
})

/**
 * Replace `import.meta.env.X` with `(globalThis.__VITE_ENV__ || {}).X`
 * and plain `import.meta.env` (without property access) with `globalThis.__VITE_ENV__`.
 */
function replaceImportMetaEnv(src) {
  return src
    .replace(/\bimport\.meta\.env\b/g, '(globalThis.__VITE_ENV__ || {})')
    .replace(/\bimport\.meta\.hot\b/g, 'undefined')
}

module.exports = {
  process(src, filename, options) {
    const preprocessed = replaceImportMetaEnv(src)
    return swcTransform.process(preprocessed, filename, options)
  },
  processAsync: undefined,
  getCacheKey(src, filename, options) {
    const preprocessed = replaceImportMetaEnv(src)
    return swcTransform.getCacheKey
      ? swcTransform.getCacheKey(preprocessed, filename, options)
      : preprocessed + filename
  },
}
