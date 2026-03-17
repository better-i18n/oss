import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {
      locale: undefined!,
      locales: undefined!,
      requestId: undefined!,
    },
    trailingSlash: "always",
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultStaleTime: 60_000,
  });

  return router;
};
