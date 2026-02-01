import js from "@eslint/js";
import * as tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
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
    ],
  },

  js.configs.recommended,
  ...ts.configs.recommended,
  prettierConfig,

  {
    plugins: {
      "unused-imports": unusedImports,
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
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
    },
  },

  {
    files: ["**/*.config.{js,ts,mjs}", "**/scripts/**/*"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
);
