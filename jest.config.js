export default {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  extensionsToTreatAsEsm: [".jsx"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^common/(.*)$": "<rootDir>/src/common/$1",
    "^hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^features/(.*)$": "<rootDir>/src/features/$1",
  },
};
