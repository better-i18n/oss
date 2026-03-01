import { useT } from "@/lib/i18n";

interface BreadcrumbProps {
  locale: string;
  title: string;
}

export default function Breadcrumb({ locale, title }: BreadcrumbProps) {
  const t = useT("blog");

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-sm text-mist-400">
        <li>
          <a
            href={`/${locale}`}
            className="hover:text-mist-700 transition-colors"
          >
            {t("breadcrumb.home", { defaultValue: "Home" })}
          </a>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <a
            href={`/${locale}/blog`}
            className="hover:text-mist-700 transition-colors"
          >
            {t("breadcrumb.blog", { defaultValue: "Blog" })}
          </a>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page">
          <span className="text-mist-600 max-w-[200px] sm:max-w-xs truncate inline-block align-bottom">
            {title}
          </span>
        </li>
      </ol>
    </nav>
  );
}
