import { Link, type LinkProps } from "react-router";

interface LocaleLinkProps extends Omit<LinkProps, "to"> {
  to: string;
  locale: string;
  defaultLocale?: string;
  children?: React.ReactNode;
}

/**
 * A locale-aware Link wrapper.
 * Prepends the locale prefix to the path for non-default locales.
 *
 * <LocaleLink to="/products/hat" locale="tr" /> → /tr/products/hat
 * <LocaleLink to="/products/hat" locale="en" /> → /products/hat
 * <LocaleLink to="/#featured"    locale="tr" /> → /tr#featured   (no trailing slash)
 */
export function LocaleLink({
  to,
  locale,
  defaultLocale = "en",
  ...rest
}: LocaleLinkProps) {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;

  let path: string;
  if (to.startsWith("/#")) {
    // Home-page anchor link: /#section → /locale#section (avoid trailing slash before #)
    path = `${prefix}${to.slice(1)}`; // "/#featured" → "#featured" → "/tr#featured"
  } else if (to.startsWith("/")) {
    path = `${prefix}${to}`;
  } else {
    path = to;
  }

  return <Link to={path} {...rest} />;
}
