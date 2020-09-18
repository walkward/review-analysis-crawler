/* eslint-disable max-len */

module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  collectCoverageFrom: ['<rootDir>/src/**/*.js'],
  globals: {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50,
  },
};
