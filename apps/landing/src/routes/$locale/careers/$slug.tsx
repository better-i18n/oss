import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useId, useRef, useState } from "react";
import { SpriteIcon } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { PageHero, Section, SectionHeader, Divider } from "@/components/ui/page";
import { getPageHead, getCareersPageStructuredData } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { getJobPosition, type JobPosition } from "@/lib/content";
import { formatSalaryRange, toJobPostingOptions } from "@/lib/job-posting";

const loadPosition = createServerFn({ method: "GET" })
  .validator((data: { slug: string; locale: string }) => data)
  .handler(async ({ data }) => getJobPosition(data.slug, data.locale));

export const Route = createFileRoute("/$locale/careers/$slug")({
  loader: async ({ params, context }) => {
    const position = params.slug === "general"
      ? null
      : await loadPosition({ data: { slug: params.slug, locale: params.locale } });

    if (!position && params.slug !== "general") throw notFound();

    // The three module imports are independent of each other, so they resolve
    // together instead of forming a three-step waterfall before the fetch.
    const [{ getMessages }, { i18nConfig }, { filterMessages }] = await Promise.all([
      import("@better-i18n/use-intl/server"),
      import("@/i18n.config"),
      import("@/lib/page-namespaces"),
    ]);
    const allMessages = await getMessages({ project: i18nConfig.project, locale: context.locale });
    const messages = filterMessages(allMessages, ["careersPage", "meta", "breadcrumbs"]);
    return { position, messages, locale: params.locale };
  },
  head: ({ loaderData }) => {
    const position = loaderData?.position;
    const locale = loaderData?.locale || "en";
    const pathname = `/careers/${position?.slug || "general"}`;

    if (!position) {
      return getPageHead({
        messages: loaderData?.messages || {},
        locale,
        pageKey: "careers",
        pathname,
      });
    }

    const summary = position.summary
      || `Join Better I18N as ${position.title}. ${position.location} · ${position.type}.`;

    return getPageHead({
      messages: loaderData?.messages || {},
      locale,
      pageKey: "careers",
      pathname,
      metaFallback: {
        title: `${position.title} — Better I18N Careers`,
        description: summary,
        ogTitle: `${position.title} — Better I18N`,
        ogDescription: summary,
      },
      customStructuredData: getCareersPageStructuredData(
        [toJobPostingOptions(position)],
        locale,
      ),
    });
  },
  component: CareerDetailPage,
  notFoundComponent: CareerNotFound,
});

type T = ReturnType<typeof useT>;

function CareerDetailPage() {
  const { position, locale } = Route.useLoaderData();
  const t = useT("careersPage");

  return (
    <MarketingLayout showCTA={false}>
      {position ? (
        <PositionDetail position={position} locale={locale} t={t} />
      ) : (
        <GeneralApplication locale={locale} t={t} />
      )}
    </MarketingLayout>
  );
}

function PositionDetail({
  position,
  locale,
  t,
}: {
  position: JobPosition;
  locale: string;
  t: T;
}) {
  const salary = formatSalaryRange(position);

  return (
    <>
      <PageHero
        title={position.title}
        subtitle={position.summary || position.about}
        // The ask sits at the top as well as the bottom: the requirement lists
        // in between are long enough that a reader who has already decided
        // should not have to scroll past them to find the form.
        primary={{ label: t("form.title"), href: "#apply" }}
        secondary={{ label: t("detail.back"), href: `/${locale}/careers/` }}
        visual={
          <dl className="flex flex-wrap gap-x-16 gap-y-6 border-t border-black/[0.07] pt-6">
            <Fact label={t("detail.meta.department")} value={t(`department.${position.department}`)} />
            <Fact label={t("detail.meta.location")} value={position.location} />
            <Fact label={t("detail.meta.type")} value={position.type} />
            {/* The CMS holds the range, so the page prints it. Hiding a number
                the entry already carries only makes a candidate ask for it. */}
            {salary && <Fact label={t("detail.meta.salary")} value={salary} numeric />}
          </dl>
        }
      />

      <Divider />

      <Section labelledBy="role-title">
        <SectionHeader
          id="role-title"
          eyebrow={t("detail.eyebrow.role")}
          title={t("detail.aboutTitle")}
          subtitle={position.about}
          titleMaxWidth="26ch"
        />

        <div className="mt-10 flex flex-col gap-10">
          <RequirementList title={t("detail.whatYoullDo")} items={position.responsibilities} />
          <RequirementList title={t("detail.requirements")} items={position.requirements} />
          <RequirementList title={t("detail.niceToHave")} items={position.niceToHave} muted />
        </div>
      </Section>

      <Divider />

      <Section id="apply" labelledBy="apply-title">
        <SectionHeader
          id="apply-title"
          eyebrow={t("detail.eyebrow.apply")}
          title={t("form.title")}
        />
        <div className="mt-8 max-w-[62ch]">
          <ApplicationForm t={t} defaultRole={position.title} />
        </div>
      </Section>
    </>
  );
}

function GeneralApplication({ locale, t }: { locale: string; t: T }) {
  return (
    <>
      <PageHero
        title={t("general.title")}
        subtitle={t("general.description")}
        primary={{ label: t("form.title"), href: "#apply" }}
        secondary={{ label: t("detail.back"), href: `/${locale}/careers/` }}
      />

      <Divider />

      <Section id="apply" labelledBy="apply-title">
        <SectionHeader
          id="apply-title"
          eyebrow={t("general.eyebrow")}
          title={t("form.title")}
        />
        <div className="mt-8 max-w-[62ch]">
          <ApplicationForm t={t} defaultRole="General" />
        </div>
      </Section>
    </>
  );
}

function Fact({ label, value, numeric }: { label: string; value: string; numeric?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-mist-500">{label}</dt>
      <dd
        className={`mt-1 text-[15px] font-medium tracking-[-0.015em] text-mist-900${numeric ? " tabular-nums" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

/** One heading plus its bullets. Renders nothing when the CMS list is empty. */
function RequirementList({
  title,
  items,
  muted,
}: {
  title: string;
  items: string[];
  muted?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">{title}</h3>
      <ul className="mt-3 flex max-w-[68ch] flex-col gap-2">
        {items.map((item) => (
          <li
            key={item}
            className={`flex items-start gap-2.5 text-sm leading-relaxed ${muted ? "text-mist-500" : "text-mist-700"}`}
          >
            <span
              className={`mt-2 size-1 shrink-0 rounded-full ${muted ? "bg-mist-300" : "bg-mist-400"}`}
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

type FormStatus = "idle" | "submitting" | "success" | "error";

function ApplicationForm({ t, defaultRole }: { t: T; defaultRole: string }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // The button is disabled while submitting, but a form also submits on
    // Enter. The guard is a ref, not `status`: `setStatus` does not apply
    // synchronously, so two fast submits would both read "idle" and post the
    // same application twice.
    if (!formRef.current || submittingRef.current) return;
    submittingRef.current = true;
    setStatus("submitting");
    try {
      const res = await fetch("/api/apply", { method: "POST", body: new FormData(formRef.current) });
      if (!res.ok) throw new Error();
      setStatus("success");
      formRef.current.reset();
      setFileInfo(null);
    } catch {
      // Released only on failure: after a success the form is replaced by the
      // confirmation, so there is nothing left to submit twice.
      submittingRef.current = false;
      setStatus("error");
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && fileRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileRef.current.files = dt.files;
      setFileInfo({ name: file.name, size: file.size, type: file.type });
    }
  };

  if (status === "success") {
    return (
      <div className="border-t border-black/[0.07] pt-8">
        <p className="text-[15px] font-medium text-mist-950">{t("form.success.title")}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-mist-600">{t("form.success.message")}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] opacity-0" aria-hidden="true" />
      <input type="hidden" name="role" value={defaultRole} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("form.name")} required>
          {(id) => <input id={id} type="text" name="name" required className={inputCls} placeholder="Jane Doe" />}
        </Field>
        <Field label={t("form.email")} required>
          {(id) => <input id={id} type="email" name="email" required className={inputCls} placeholder="jane@example.com" />}
        </Field>
      </div>

      <Field label={t("form.cv")}>
        {/* Drag and drop is a shortcut, not the interaction: the zone is
            focusable and answers Enter/Space, so a keyboard can reach the file
            picker the same way a pointer does. */}
        {(id) => (
        <div
          role={fileInfo ? undefined : "button"}
          tabIndex={fileInfo ? undefined : 0}
          className={`rounded-lg border border-dashed bg-white px-4 py-5 transition-colors ${fileInfo ? "border-black/[0.12]" : `cursor-pointer ${dragActive ? "border-mist-400" : "border-black/[0.12] hover:border-mist-400"}`}`}
          onDragOver={(e) => { if (!fileInfo) { e.preventDefault(); setDragActive(true); } }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { if (!fileInfo) handleFileDrop(e); else e.preventDefault(); }}
          onClick={() => { if (!fileInfo) fileRef.current?.click(); }}
          onKeyDown={(e) => {
            if (fileInfo || (e.key !== "Enter" && e.key !== " ")) return;
            e.preventDefault();
            fileRef.current?.click();
          }}
        >
          <input id={id} ref={fileRef} type="file" name="cv" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            setFileInfo(f ? { name: f.name, size: f.size, type: f.type } : null);
          }} />
          {fileInfo ? (
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-black/[0.07] bg-mist-50 font-mono text-[11px] font-medium uppercase text-mist-600">
                {fileInfo.name.split(".").pop()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-mist-800">{fileInfo.name}</p>
                <p className="text-xs tabular-nums text-mist-500">{(fileInfo.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFileInfo(null); if (fileRef.current) fileRef.current.value = ""; }}
                className="ml-auto shrink-0 text-xs text-mist-500 hover:text-mist-800"
              >
                {t("form.removeFile")}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-mist-600">{t("form.dropCV")}</p>
              <p className="mt-0.5 text-xs text-mist-500">PDF, DOCX — max 5MB</p>
            </div>
          )}
        </div>
        )}
      </Field>

      <Field label={t("form.linkedin")}>
        {(id) => <input id={id} type="url" name="linkedin" className={inputCls} placeholder="https://linkedin.com/in/..." />}
      </Field>

      <Field label={t("form.message")}>
        {(id) => <textarea id={id} name="message" rows={4} className={`${inputCls} resize-none`} placeholder={t("form.messagePlaceholder")} />}
      </Field>

      {/* Red is the message here, not decoration — the form failed. */}
      {status === "error" && (
        <p className="text-sm text-red-600" role="alert">{t("form.error")}</p>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn btn-dark btn-lg w-fit disabled:opacity-50">
        {status === "submitting" ? t("form.submitting") : t("form.submit")}
      </button>
    </form>
  );
}

const inputCls = "block w-full rounded-lg border border-black/[0.12] bg-white px-3 py-2 text-sm text-mist-950 placeholder:text-mist-400 focus:border-mist-400 focus:ring-1 focus:ring-mist-400 focus:outline-none";

/**
 * The label is associated by `htmlFor`, not by wrapping — so the field passes
 * its generated id to the control it owns. The placeholders in this form are
 * examples ("Jane Doe"), and an example is not a label.
 */
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-mist-700">
        {label}
        {required && <span className="text-mist-400">*</span>}
      </label>
      <div className="mt-1.5">{children(id)}</div>
    </div>
  );
}

function CareerNotFound() {
  const t = useT("careersPage");
  const { locale } = Route.useParams();
  return (
    <MarketingLayout showCTA={false}>
      <Section>
        <h1 className="section-h2" style={{ maxWidth: "20ch" }}>{t("notFound.title")}</h1>
        <p className="section-p" style={{ marginTop: 12 }}>{t("notFound.description")}</p>
        <Link to="/$locale/careers/" params={{ locale }} className="btn btn-dark btn-lg mt-6 w-fit">
          <SpriteIcon name="arrow-right" className="size-3.5 rotate-180" aria-hidden="true" />
          {t("notFound.back")}
        </Link>
      </Section>
    </MarketingLayout>
  );
}
