module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(./__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  testEnvironment: 'node',
  coverageReporters: ['json', 'lcov', 'text', 'clover'], // "text-summary"
  clearMocks: true,
  setupFilesAfterEnv: ['./singleton.ts'],
  testPathIgnorePatterns: ['/dist/'],
};
