import { createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {
      locale: undefined!, // Set by root route beforeLoad
      messages: undefined!, // Set by root route beforeLoad
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
