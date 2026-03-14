import { createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {
      locale: undefined!, // Set by root route beforeLoad
      locales: undefined!, // Set by root route beforeLoad
    },
    trailingSlash: "always",
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultStaleTime: 60_000, // Root loader won't re-run for 60s — prevents nav white flash
  });

  return router;
};
