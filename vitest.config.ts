import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    pool: "forks",
    testTimeout: 15000,
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "packages/cli/**",         // bun:test
      "packages/expo/**",        // bun:test
      "packages/content/**",     // own vitest.config.ts (jsdom)
      "tests/expo-native/**",    // React Native
      "apps/**",
    ],
    include: [
      "packages/**/__tests__/**/*.test.ts",
      "packages/**/*.test.ts",
      // Repo-wide policy tests: they assert things about the repo itself
      // (deploy scripts, entrypoints), so they belong to no single package.
      "tests/repo-policy/**/*.test.ts",
    ],
  },
});
