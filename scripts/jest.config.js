const { defaults } = require("jest-config");

module.exports = {
  rootDir: "..",
  setupFiles: ["<rootDir>/scripts/setup-tests.js"],
  roots: ["<rootDir>/packages"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  collectCoverageFrom: [
    "packages/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!packages/**/*.index",
    "!packages/adam-ui-stories/**"
  ],
  coverageReporters: ["cobertura", "html"],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  }
};
