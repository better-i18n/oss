/**
 * TanStack Router integration for Better i18n.
 *
 * Import from `@better-i18n/use-intl/router` — this entry point
 * requires `@tanstack/react-router` to be installed.
 *
 * For router-agnostic locale utilities, use `useLocalePath` from
 * the main `@better-i18n/use-intl` export instead.
 *
 * @example
 * ```tsx
 * import { useLocaleRouter } from "@better-i18n/use-intl/router";
 *
 * function Navigation() {
 *   const { locale, localePath, navigate } = useLocaleRouter();
 *   return <Link to={localePath("/about")}>About</Link>;
 * }
 * ```
 */
export { useLocaleRouter } from "./hooks/useLocaleRouter.js";
export type { UseLocaleRouterReturn } from "./hooks/useLocaleRouter.js";
