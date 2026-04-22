export default {
  testEnvironment: 'jsdom',
  setupFiles: ['./polyfills.js'],
  setupFilesAfterEnv: ['./setupTests.js'],
  testMatch: ['**/*.test.js'],

  moduleNameMapper: {
    'b4a': 'b4a/browser.js'
  }
};