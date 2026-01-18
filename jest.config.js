export default {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  extensionsToTreatAsEsm: [".jsx", ".ts", ".tsx"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^common/(.*)$": "<rootDir>/src/common/$1",
    "^hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^features/(.*)$": "<rootDir>/src/features/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironmentOptions: {
    timezone: "UTC",
  },
};
