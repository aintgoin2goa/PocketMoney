/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'react-native',
  testEnvironment: 'detox/runners/jest/testEnvironment',
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/**/*.test.ts'],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  verbose: true,
};
