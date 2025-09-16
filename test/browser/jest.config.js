// jest.config.js
export default {
  testEnvironment: "jsdom",
  setupFiles: ["./polyfills.js"], // Runs first, in the Node environment
  setupFilesAfterEnv: ["./setupTests.js"], // Runs second, after JSDOM is ready
  testMatch: ["**/*.test.js"],
}
