module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/**/*.test.ts"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    "^@shared/(.*)$": "<rootDir>/../shared/src/$1",
    "^@types/(.*)$": "<rootDir>/../types/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
};
