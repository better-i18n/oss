import { useTranslations } from "@better-i18n/use-intl";
import {
  IconChevronRight,
  IconCodeBrackets,
  IconConsole,
  IconServer1,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

const resourceKeys = [
  {
    key: "nextjs",
    href: "https://docs.better-i18n.com/frameworks/nextjs",
    icon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.251 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.572 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" />
      </svg>
    ),
  },
  {
    key: "react",
    href: "https://docs.better-i18n.com/frameworks/tanstack-start",
    icon: (
      <svg
        className="size-6"
        viewBox="-11.5 -10.232 23 20.463"
        fill="currentColor"
      >
        <circle r="2.05" />
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    key: "sdk",
    href: "https://docs.better-i18n.com/sdk",
    icon: <IconCodeBrackets className="size-6" />,
  },
  {
    key: "cli",
    href: "https://docs.better-i18n.com/cli",
    icon: <IconConsole className="size-6" />,
  },
  {
    key: "mcp",
    href: "https://docs.better-i18n.com/mcp",
    icon: <IconServer1 className="size-6" />,
  },
];

export default function DeveloperResources() {
  const t = useTranslations("developers");

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-12 lg:mb-16">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("resources.title")}
          </h2>
          <p className="mt-4 text-lg text-mist-600">
            {t("resources.subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {resourceKeys.map((resource) => (
            <a
              key={resource.key}
              href={resource.href}
              className="group relative flex flex-col p-6 rounded-xl bg-white border border-mist-200 hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-center size-12 rounded-lg bg-mist-100 text-mist-700 group-hover:bg-mist-200 group-hover:text-mist-900 transition-colors mb-4">
                {resource.icon}
              </div>
              <h3 className="font-semibold text-mist-950 mb-2">
                {t(`resources.items.${resource.key}.title`)}
              </h3>
              <p className="text-sm text-mist-600 flex-1">
                {t(`resources.items.${resource.key}.description`)}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-mist-700 group-hover:text-mist-900 transition-colors">
                {t("resources.viewDocs")}
                <IconChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
