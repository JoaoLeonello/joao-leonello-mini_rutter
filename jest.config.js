module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js"],
  silent: false,
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: [
    "**/src/adapters/input/controllers/tests/**/*.test.ts",
    "**/src/adapters/input/shopify/tests/**/*.test.ts",
    "**/src/adapters/output/db/tests/**/*.test.ts",
    "**/src/domain/entities/tests/**/*.test.ts",
    "**/src/usecases/tests/**/*.test.ts",
  ],
  collectCoverage: true,
  setupFiles: ["reflect-metadata"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};
