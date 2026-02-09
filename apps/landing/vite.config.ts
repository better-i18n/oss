import { defineConfig, loadEnv } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "url";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      "import.meta.env.BETTER_I18N_CONTENT_API_KEY": JSON.stringify(
        env.BETTER_I18N_CONTENT_API_KEY,
      ),
      "import.meta.env.BETTER_I18N_PROJECT": JSON.stringify(
        env.BETTER_I18N_PROJECT,
      ),
    },
    resolve: {
      conditions: [
        "worker",
        "webworker",
        "browser",
        "module",
        "development|production",
      ],
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    plugins: [
      tailwindcss(),
      devtools(),
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tanstackStart(),
      viteReact(),
    ],
  };
});
