/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  reporters: ['default', 'jest-junit'],
  testMatch: ['**/__tests__/**/*.test.*'],
};
