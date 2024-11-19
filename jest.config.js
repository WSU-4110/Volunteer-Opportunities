const nextJest = require("next/jest.js");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest

{
  import("jest").Config;
}
const config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["./jest.setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleNameMapper: {
    "/actions": "<rootDir>/_mocks_/actions.tsx",
  },
  moduleDirectories: ["node_modules", "src", "_mocks_"],
  modulePathIgnorePatterns: ["/node_modules/", "^.*/lib/"],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config);
