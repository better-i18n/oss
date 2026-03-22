import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { betterI18n } from "@better-i18n/vite";

export default defineConfig({
  plugins: [
    // Single source of truth — provider reads project from here
    betterI18n({ project: "carna/test-platform" }),
    react(),
  ],
});
