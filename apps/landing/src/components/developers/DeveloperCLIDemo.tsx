import { useTranslations } from "@better-i18n/use-intl";
import {
  IconTerminal,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export default function DeveloperCLIDemo() {
  const t = useTranslations("developers");

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-mist-200 px-3 py-1.5 text-sm text-mist-700 w-fit mb-6">
              <IconTerminal className="size-4" />
              {t("cliDemo.badge")}
            </span>
            <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
              {t("cliDemo.title")}
            </h2>
            <p className="mt-4 text-lg text-mist-600">
              {t("cliDemo.description")}
            </p>
            <ul className="mt-6 space-y-3">
              {(["autoDetect", "typeSafe", "cdnDeploy"] as const).map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 rounded-full bg-mist-400 flex-shrink-0" />
                  <span className="text-sm text-mist-700">
                    {t(`cliDemo.features.${key}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Terminal */}
          <div className="bg-mist-950 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-mist-800">
              <div className="size-3 rounded-full bg-red-400" />
              <div className="size-3 rounded-full bg-yellow-400" />
              <div className="size-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-mist-400">terminal</span>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed">
              <p className="text-mist-400"># {t("cliDemo.terminal.comment")}</p>
              <p className="mt-2">
                <span className="text-emerald-400">$</span>{" "}
                <span className="text-white">bunx better-i18n init</span>
              </p>
              <p className="mt-3 text-mist-400">
                {t("cliDemo.terminal.output1")}
              </p>
              <p className="text-mist-400">
                {t("cliDemo.terminal.output2")}
              </p>
              <p className="text-mist-400">
                {t("cliDemo.terminal.output3")}
              </p>
              <p className="mt-3 text-emerald-400">
                {t("cliDemo.terminal.success")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
