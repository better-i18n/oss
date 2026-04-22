import js from "@eslint/js";
import * as tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import ts from "typescript-eslint";

export default ts.config(
  {
    ignores: [
      ".cache",
      "**/.next",
      "**/out",
      "**/build",
      "**/dist",
      "**/node_modules",
      // Generated bundles & framework artifacts — never hand-written,
      // linting them drowns real errors in ~19K noise (see BETTER-249).
      "**/.wrangler/**",
      "**/.open-next/**",
      "**/.react-router/**",
      "**/.vite/**",
      "apps/docs/.source/**",
      "tests/expo-native/**",
    ],
  },

  js.configs.recommended,
  ...ts.configs.recommended,
  prettierConfig,

  {
    plugins: {
      "unused-imports": unusedImports,
      // `react-hooks/rules-of-hooks` + `react-hooks/exhaustive-deps` are
      // referenced via inline disable comments in `packages/use-intl`. Without
      // the plugin registered, eslint emits "Definition for rule not found"
      // for every comment site. Register once at the root so both rules
      // resolve across the monorepo.
      "react-hooks": reactHooks,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": [
        "error",
        {
          ignoreRestArgs: true,
          fixToUnknown: false,
        },
      ],
    },
  },

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      // TypeScript already resolves identifiers via the compiler — ESLint's
      // `no-undef` re-implements the check poorly for `.ts` files (it doesn't
      // understand ambient declarations, triple-slash refs, or platform
      // globals from `@types/*`). typescript-eslint's own guidance is to
      // disable this rule for TS sources. See:
      //   https://typescript-eslint.io/troubleshooting/faqs/eslint/#eslint-plugin-import
      "no-undef": "off",
    },
  },

  {
    // Node-side files: config files, scripts, and standalone `.mjs` utilities
    // all run under Node with `process`, `console`, etc. globally available.
    files: ["**/*.config.{js,ts,mjs}", "**/scripts/**/*", "**/*.mjs"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  {
    files: ["apps/landing/src/seo/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/*"],
              message:
                "seo/ is loaded by vite.config.ts at config-time, before Vite alias resolution. Use relative imports (e.g., ../lib/content) instead of @/ path aliases.",
            },
          ],
        },
      ],
    },
  },
);
