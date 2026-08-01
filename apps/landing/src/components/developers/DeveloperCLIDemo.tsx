import { useTranslations } from "@better-i18n/use-intl";
import {
  IconFilterTimeline
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { CodeBlock } from "@/components/CodeBlock";

export default function DeveloperCLIDemo() {
  const t = useTranslations("developers");

  return (
    <section>
      <div className="section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-mist-200 px-3 py-1.5 text-sm text-mist-700 w-fit mb-6">
              <IconFilterTimeline className="size-4" />
              {t("cliDemo.badge")}
            </span>
            <h2 className="section-h2">
              {t("cliDemo.title")}
            </h2>
            <p className="section-p mt-3">
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

          {/* Terminal — light, like every other code block on the site.
              It was `bg-mist-950` with three macOS traffic-light dots and
              emerald/white ink: a second theme living on a white page, and the
              one place a reader had to re-learn what a code block looks like.
              The shared highlighter renders the same session on the standard
              hairline figure, with the three-hue token palette
              (rule/code-blocks-carry-three-hues) doing the work the dark
              background used to pretend to do. */}
          <CodeBlock
            lang="bash"
            filename="terminal"
            code={[
              `# ${t("cliDemo.terminal.comment")}`,
              "$ bunx better-i18n init",
              "",
              t("cliDemo.terminal.output1"),
              t("cliDemo.terminal.output2"),
              t("cliDemo.terminal.output3"),
              "",
              t("cliDemo.terminal.success"),
            ].join("\n")}
          />
        </div>
      </div>
    </section>
  );
}
