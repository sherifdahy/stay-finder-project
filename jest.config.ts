import type { Config } from "jest";
import nextJest from "next/jest.js";

// next/jest sets up SWC transforms and loads next.config and .env files.
const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
    testEnvironment: "node",
    // tsconfig maps "@/*" to "./*"; Jest doesn't read tsconfig paths.
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
    },
    testMatch: ["<rootDir>/src/**/*.test.ts?(x)"],
};

export default createJestConfig(config);
