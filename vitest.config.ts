import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    pool: "forks",
    testTimeout: 15000,
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "packages/cli/**",         // bun:test
      "tests/expo-native/**",    // React Native
      "apps/**",
    ],
    include: [
      "packages/**/__tests__/**/*.test.ts",
      "packages/**/*.test.ts",
    ],
  },
});
