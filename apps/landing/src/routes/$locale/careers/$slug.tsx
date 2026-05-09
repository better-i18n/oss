import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState, useRef } from "react";
import { SpriteIcon } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, getCareersPageStructuredData } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { getJobPosition, type JobPosition } from "@/lib/content";

const loadPosition = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; locale: string }) => data)
  .handler(async ({ data }) => getJobPosition(data.slug, data.locale));

export const Route = createFileRoute("/$locale/careers/$slug")({
  loader: async ({ params, context }) => {
    const position = params.slug === "general"
      ? null
      : await loadPosition({ data: { slug: params.slug, locale: params.locale } });

    if (!position && params.slug !== "general") throw notFound();

    const { getMessages } = await import("@better-i18n/use-intl/server");
    const { i18nConfig } = await import("@/i18n.config");
    const { filterMessages } = await import("@/lib/page-namespaces");
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

    return getPageHead({
      messages: loaderData?.messages || {},
      locale,
      pageKey: "careers",
      pathname,
      metaFallback: {
        title: `${position.title} — Better I18N Careers`,
        description: position.summary || `Join Better I18N as ${position.title}. ${position.location} · ${position.type}.`,
        ogTitle: `${position.title} — Better I18N`,
        ogDescription: position.summary || `Join Better I18N as ${position.title}. ${position.location} · ${position.type}.`,
      },
      customStructuredData: getCareersPageStructuredData([{
        title: position.title,
        description: position.summary,
        employmentType: "FULL_TIME",
        location: "Remote",
        remote: true,
        baseSalary: {
          minValue: position.salaryMin,
          maxValue: position.salaryMax,
          currency: "USD",
          unitText: "YEAR",
        },
      }]),
    });
  },
  component: CareerDetailPage,
  notFoundComponent: CareerNotFound,
});

function CareerDetailPage() {
  const { position, locale } = Route.useLoaderData();
  const t = useT("careersPage");

  return (
    <MarketingLayout showCTA={false}>
      <div className="mx-auto max-w-3xl px-6 lg:px-10 pt-10 pb-16">
        <Link
          to="/$locale/careers/"
          params={{ locale }}
          className="inline-flex items-center gap-1.5 text-sm text-mist-500 hover:text-mist-700 transition-colors mb-8"
        >
          <SpriteIcon name="arrow-right" className="size-3 rotate-180" />
          {t("detail.back", "All positions")}
        </Link>

        {!position ? (
          <GeneralApplication t={t} />
        ) : (
          <PositionDetail position={position} t={t} />
        )}
      </div>
    </MarketingLayout>
  );
}

type T = ReturnType<typeof useT>;

function PositionDetail({ position, t }: { position: JobPosition; t: T }) {
  return (
    <>
      <div className="mb-10">
        <span className="text-xs font-medium text-mist-400 uppercase tracking-wider">
          {t(`department.${position.department}`, position.department)}
        </span>
        <h1 className="mt-2 font-display text-3xl/[1.15] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.15]">
          {position.title}
        </h1>
        <p className="mt-3 text-sm text-mist-500">
          {position.location} · {position.type} · ${(position.salaryMin / 1000).toFixed(0)}K–${(position.salaryMax / 1000).toFixed(0)}K
        </p>
      </div>

      <p className="text-sm text-mist-700 leading-relaxed">{position.about}</p>

      {position.responsibilities.length > 0 && (
        <div className="mt-10">
          <h2 className="text-base font-medium text-mist-950 mb-4">
            {t("detail.whatYoullDo", "What you'll do")}
          </h2>
          <ul className="space-y-2">
            {position.responsibilities.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-mist-700 leading-relaxed">
                <span className="mt-2 size-1 rounded-full bg-mist-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {position.requirements.length > 0 && (
        <div className="mt-10">
          <h2 className="text-base font-medium text-mist-950 mb-4">
            {t("detail.requirements", "You may be a fit if")}
          </h2>
          <ul className="space-y-2">
            {position.requirements.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-mist-700 leading-relaxed">
                <span className="mt-2 size-1 rounded-full bg-mist-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {position.niceToHave.length > 0 && (
        <div className="mt-10">
          <h2 className="text-base font-medium text-mist-950 mb-4">
            {t("detail.niceToHave", "Nice to have")}
          </h2>
          <ul className="space-y-2">
            {position.niceToHave.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-mist-500 leading-relaxed">
                <span className="mt-2 size-1 rounded-full bg-mist-300 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <hr className="my-12 border-mist-200" />
      <ApplicationForm t={t} defaultRole={position.title} />
    </>
  );
}

function GeneralApplication({ t }: { t: T }) {
  return (
    <>
      <div className="mb-10">
        <span className="text-xs font-medium text-mist-400 uppercase tracking-wider">General</span>
        <h1 className="mt-2 font-display text-3xl/[1.15] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.15]">
          {t("general.title", "General Application")}
        </h1>
        <p className="mt-3 text-sm text-mist-600 max-w-lg">
          {t("general.description", "Don't see a fit? Tell us what you'd work on.")}
        </p>
      </div>
      <ApplicationForm t={t} defaultRole="General" />
    </>
  );
}

type FormStatus = "idle" | "submitting" | "success" | "error";

function ApplicationForm({ t, defaultRole }: { t: T; defaultRole: string }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/apply", { method: "POST", body: new FormData(formRef.current) });
      if (!res.ok) throw new Error();
      setStatus("success");
      formRef.current.reset();
      setFileInfo(null);
    } catch {
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
      <div className="rounded-xl border border-mist-200 bg-white p-8 text-center">
        <svg viewBox="0 0 24 24" fill="none" className="size-10 mx-auto mb-3" aria-hidden="true">
          <circle cx="12" cy="12" r="11" className="stroke-emerald-200" strokeWidth="2" />
          <path d="M7.5 12.5l3 3 6-6.5" className="stroke-emerald-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className="text-base font-medium text-mist-950">{t("form.success.title", "Application received")}</h3>
        <p className="mt-1.5 text-sm text-mist-500">{t("form.success.message", "We'll review your application and get back to you within a few days.")}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-base font-medium text-mist-950 mb-6">{t("form.title", "Apply for this role")}</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] opacity-0" aria-hidden="true" />
        <input type="hidden" name="role" value={defaultRole} />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("form.name", "Name")} required>
            <input type="text" name="name" required className={inputCls} placeholder="Jane Doe" />
          </Field>
          <Field label={t("form.email", "Email")} required>
            <input type="email" name="email" required className={inputCls} placeholder="jane@example.com" />
          </Field>
        </div>

        <Field label={t("form.cv", "Resume")}>
          <div
            className={`rounded-lg border-2 border-dashed px-4 py-5 transition-colors bg-white ${fileInfo ? "border-mist-200" : `cursor-pointer ${dragActive ? "border-mist-400" : "border-mist-200 hover:border-mist-300"}`}`}
            onDragOver={(e) => { if (!fileInfo) { e.preventDefault(); setDragActive(true); } }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { if (!fileInfo) handleFileDrop(e); else e.preventDefault(); }}
            onClick={() => { if (!fileInfo) fileRef.current?.click(); }}
          >
            <input ref={fileRef} type="file" name="cv" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              setFileInfo(f ? { name: f.name, size: f.size, type: f.type } : null);
            }} />
            {fileInfo ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-mist-100 shrink-0">
                  <span className="text-xs font-mono font-medium text-mist-600 uppercase">
                    {fileInfo.name.split(".").pop()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-mist-800 font-medium truncate">{fileInfo.name}</p>
                  <p className="text-xs text-mist-400">{(fileInfo.size / 1024).toFixed(0)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFileInfo(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="ml-auto text-mist-400 hover:text-mist-600 text-xs shrink-0"
                >
                  {t("form.removeFile", "Remove")}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-mist-500">{t("form.dropCV", "Drop file or click to upload")}</p>
                <p className="text-xs text-mist-400 mt-0.5">PDF, DOCX — max 5MB</p>
              </div>
            )}
          </div>
        </Field>

        <Field label={t("form.linkedin", "LinkedIn URL")}>
          <input type="url" name="linkedin" className={inputCls} placeholder="https://linkedin.com/in/..." />
        </Field>

        <Field label={t("form.message", "Tell us about a project you're proud of")}>
          <textarea name="message" rows={4} className={`${inputCls} resize-none`} placeholder={t("form.messagePlaceholder", "What excites you about this role? Share links to projects, GitHub, portfolio...")} />
        </Field>

        {status === "error" && (
          <p className="text-sm text-red-600">{t("form.error", "Something went wrong. Please try again or email tech@better-i18n.com.")}</p>
        )}

        <button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto rounded-full bg-mist-950 px-8 py-2.5 text-sm font-medium text-white hover:bg-mist-800 transition-colors disabled:opacity-50">
          {status === "submitting" ? t("form.submitting", "Submitting...") : t("form.submit", "Submit application →")}
        </button>
      </form>
    </div>
  );
}

const inputCls = "block w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm text-mist-950 placeholder:text-mist-400 focus:border-mist-400 focus:ring-1 focus:ring-mist-400 focus:outline-none";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-mist-700">{label}{required && <span className="text-mist-400">*</span>}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function CareerNotFound() {
  const t = useT("careersPage");
  const { locale } = Route.useParams();
  return (
    <MarketingLayout showCTA={false}>
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="font-display text-2xl font-medium text-mist-950">{t("notFound.title", "Position not found")}</p>
        <p className="mt-3 text-sm text-mist-600">{t("notFound.description", "This position may have been filled or removed.")}</p>
        <Link to="/$locale/careers/" params={{ locale }} className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-mist-950 px-5 py-2 text-sm font-medium text-white hover:bg-mist-800 transition-colors">
          {t("notFound.back", "View all positions")}
        </Link>
      </div>
    </MarketingLayout>
  );
}
