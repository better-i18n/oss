import { createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { ErrorPage } from "./components/ErrorPage";

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {
      locale: undefined!, // Set by root route beforeLoad
      locales: undefined!, // Set by root route beforeLoad
      requestId: undefined!, // Set by root route beforeLoad
    },
    trailingSlash: "always",
    /* Without this, a throwing route renders TanStack's built-in CatchBoundary:
       "Something went wrong! / Show Error" inside a 200 response with no robots
       directive — indexable, and it did get indexed. ErrorPage emits
       `noindex, nofollow`. See src/components/ErrorPage.tsx. */
    defaultErrorComponent: ErrorPage,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultStaleTime: 60_000, // Root loader won't re-run for 60s — prevents nav white flash
  });

  return router;
};
