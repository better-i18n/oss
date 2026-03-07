import { Link, type LinkProps } from "react-router";

interface LocaleLinkProps extends Omit<LinkProps, "to"> {
  to: string;
  locale: string;
  children?: React.ReactNode;
}

/**
 * A locale-aware Link wrapper.
 * Prepends the locale prefix to the path for non-default locales.
 *
 * <LocaleLink to="/products/hat" locale="tr" /> → /tr/products/hat
 * <LocaleLink to="/products/hat" locale="en" /> → /products/hat
 */
export function LocaleLink({ to, locale, ...rest }: LocaleLinkProps) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  const path = to.startsWith("/") ? `${prefix}${to}` : to;

  return <Link to={path} {...rest} />;
}
