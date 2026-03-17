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
    defaultPreload: "intent",
    defaultPreloadStaleTime: 30_000,
    defaultStaleTime: 60_000,
  });

  return router;
};
