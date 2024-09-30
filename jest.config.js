module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    testMatch: ['**/tests/**/*.test.ts'], // Define o padrão de busca dos testes
    collectCoverage: true,
    setupFiles: ['reflect-metadata'],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
  };