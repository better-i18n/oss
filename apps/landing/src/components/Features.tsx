import { useState, useEffect } from "react";
import { cn } from "@better-i18n/ui/lib/utils";
import { useTranslations } from "@better-i18n/use-intl";
import { Link, useParams } from "@tanstack/react-router";
import {
  IconCircleInfo,
  IconCheckmark1,
  IconPageText,
  IconGithub,
  IconArrowRight,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 1. AI Translation Feature Card (Brand-Aware Intelligence)
function AIFeatureCard() {
  const t = useTranslations("features.ai");
  const [step, setStep] = useState<
    "idle" | "processing" | "review" | "completed"
  >("idle");

  useEffect(() => {
    let isMounted = true;
    const runDemo = async () => {
      if (!isMounted) return;
      setStep("idle");
      await sleep(2000);
      if (!isMounted) return;
      setStep("processing");
      await sleep(2000);
      if (!isMounted) return;
      setStep("review");
      await sleep(2500);
      if (!isMounted) return;
      setStep("completed");
      await sleep(3000);
      if (isMounted) runDemo();
    };
    runDemo();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-sm">
      <div className="h-[320px] bg-mist-50 relative overflow-hidden p-5 flex flex-col shrink-0">
        <div className="flex items-center gap-2 text-xs text-mist-500 mb-4 pb-3 border-b border-mist-200">
          <div className="w-2 h-2 rounded-full bg-mist-400" />
          <span className="font-bold uppercase tracking-tight text-[10px]">
            {t("badge", { defaultValue: "AI Translation Engine" })}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[9px] text-mist-400">
              {t("glossaryLabel", { defaultValue: "Glossary" })}
            </span>
            <span className="text-[9px] bg-white text-mist-600 px-1.5 py-0.5 rounded border border-mist-200 font-medium">
              {t("glossaryStatus", { defaultValue: "Active" })}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          <div className="flex justify-end">
            <div className="bg-white border border-mist-200 text-mist-900 rounded-lg rounded-tr-none px-3 py-2 text-[11px] max-w-[85%] shadow-sm font-medium">
              {t("userMessage", { code: "dashboard.sync", defaultValue: "Translate {code} to Turkish" })}
            </div>
          </div>

          {step !== "idle" && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white border border-mist-200 text-mist-950 rounded-lg rounded-tl-none p-3 text-[11px] w-full shadow-md relative overflow-hidden">
                {step === "processing" ? (
                  <div className="flex items-center gap-2 text-mist-500 font-medium">
                    <svg
                      className="w-3.5 h-3.5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t("processing", { defaultValue: "Translating with context..." })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="size-4 rounded bg-mist-100 flex items-center justify-center text-mist-600">
                        <IconCircleInfo className="size-3" />
                      </div>
                      <span className="text-[10px] text-mist-500 font-medium italic">
                        {t("glossaryMatch", { defaultValue: "Glossary match applied" })}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-mist-50/50 border border-mist-100 space-y-1">
                      <div className="text-[9px] font-mono text-mist-400">
                        {t("sourceLabel", { defaultValue: "SOURCE" })}
                      </div>
                      <div className="text-[11px] font-semibold text-mist-900 flex items-center gap-1.5">
                        {t.rich("targetLabel", {
                          term: (chunks) => (
                            <span className="text-mist-950 bg-mist-200 px-1 rounded transition-all">
                              {chunks}
                            </span>
                          ),
                        })}
                      </div>
                    </div>
                    {step === "review" ? (
                      <div className="flex gap-2">
                        <div className="flex-1 bg-mist-900 text-white py-1.5 rounded text-[10px] font-semibold text-center cursor-default">
                          {t("approve", { defaultValue: "Approve" })}
                        </div>
                        <div className="px-2 py-1.5 rounded border border-mist-200 bg-white text-mist-600 text-[10px] font-medium text-center cursor-default">
                          {t("edit", { defaultValue: "Edit" })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-mist-900 font-bold py-1.5 bg-mist-100 rounded text-[10px] text-center flex items-center justify-center gap-1.5 border border-mist-200 animate-in zoom-in-95 duration-300">
                        <IconCheckmark1 className="size-3" />
                        {t("brandConsistent", { defaultValue: "Brand-consistent \u2713" })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col border-t border-mist-100">
        <h3 className="text-base font-medium text-mist-950">{t("title", { defaultValue: "AI-Powered, Brand-Aware" })}</h3>
        <p className="mt-2 text-sm text-mist-700 leading-relaxed">
          {t("description", { defaultValue: "Translations that understand your brand voice, glossary, and context. Not just word-for-word." })}
        </p>
      </div>
    </div>
  );
}

// 2. Automated Git/CDN Workflow Feature Card
function PublishFeatureCard() {
  const t = useTranslations("features.publish");
  const [status, setStatus] = useState<"idle" | "publishing" | "published">(
    "idle",
  );
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const runDemo = async () => {
      if (!isMounted) return;
      setStatus("idle");
      setElapsedTime(0);
      await sleep(3000);
      if (!isMounted) return;
      setStatus("publishing");
      const timer = setInterval(() => setElapsedTime((t) => t + 1), 1000);
      await sleep(3000);
      if (!isMounted) {
        clearInterval(timer);
        return;
      }
      setStatus("published");
      clearInterval(timer);
      await sleep(4000);
      if (isMounted) runDemo();
    };
    runDemo();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-white border border-mist-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="h-[320px] bg-mist-50 p-5 flex flex-col shrink-0">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-mist-200">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "size-1.5 rounded-full",
                status === "published"
                  ? "bg-emerald-500"
                  : status === "publishing"
                    ? "bg-amber-400 animate-pulse"
                    : "bg-mist-300",
              )}
            />
            <span className="font-bold uppercase tracking-tight text-[10px] text-mist-600">
              {status === "idle"
                ? t("statusReady", { defaultValue: "Ready" })
                : status === "publishing"
                  ? t("statusSyncing", { defaultValue: "Syncing..." })
                  : t("statusSuccess", { defaultValue: "Published" })}
            </span>
          </div>
          <span className="text-[10px] text-mist-400 font-mono">
            {elapsedTime}s
          </span>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          {/* Artifacts List */}
          <div className="bg-white rounded-xl border border-mist-200 p-2.5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[9px] font-bold text-mist-400 uppercase tracking-widest">
                {t("cdnArtifacts", { defaultValue: "CDN Artifacts" })}
              </span>
              <span className="text-[8px] text-mist-400 font-mono">v1.2.0</span>
            </div>
            <div className="space-y-1">
              {[
                { f: "locales/tr.json", c: "+12" },
                { f: "locales/de.json", c: "+8" },
              ].map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1 px-1.5 rounded bg-mist-50/50 border border-mist-100"
                >
                  <div className="flex items-center gap-2">
                    <IconPageText className="size-3 text-mist-300" />
                    <span className="text-[10px] text-mist-600 font-mono truncate max-w-[100px]">
                      {file.f}
                    </span>
                  </div>
                  <span className="text-[9px] text-mist-900 font-bold">
                    {file.c}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Integration - Compact PR Card */}
          <div
            className={cn(
              "rounded-xl border p-2.5 flex flex-col gap-2 transition-all duration-500 shadow-sm relative overflow-hidden",
              status === "published"
                ? "bg-white border-mist-200 ring-1 ring-mist-900/5"
                : "bg-white border-mist-200 opacity-40 grayscale",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconGithub className="size-3.5 text-mist-900" />
                <span className="text-[10px] font-bold text-mist-950">
                  {t("pullRequest", { defaultValue: "Pull Request" })}
                </span>
              </div>
              <span
                className={cn(
                  "text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider",
                  status === "published"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-mist-100 text-mist-50",
                )}
              >
                {status === "published"
                  ? t("prStatusOpen", { defaultValue: "Open" })
                  : t("prStatusQueued", { defaultValue: "Queued" })}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] text-mist-600 font-medium line-clamp-1">
                {t("prMessage", { defaultValue: "chore(i18n): sync translations" })}
              </p>
              <div className="flex items-center gap-1.5">
                <div className="size-3 rounded-full bg-mist-200 border border-white" />
                <span className="text-[8px] text-mist-400 font-medium">
                  {t("botPushed", { branch: "i18n-sync", defaultValue: "bot pushed to {branch}" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col border-t border-mist-100">
        <h3 className="text-base font-medium text-mist-950">{t("title", { defaultValue: "Git-Native Workflow" })}</h3>
        <p className="mt-2 text-sm text-mist-700 leading-relaxed">
          {t("description", { defaultValue: "Automatic sync to your repository via pull requests, plus instant CDN delivery for production." })}
        </p>
      </div>
    </div>
  );
}

// 3. Crawler Engine Feature Card (UI-based logs & terminology)
function AIContextCard() {
  const t = useTranslations("features.crawler");
  const [step, setStep] = useState<"scanning" | "extracting" | "syncing">(
    "scanning",
  );

  useEffect(() => {
    let isMounted = true;
    const runDemo = async () => {
      if (!isMounted) return;
      setStep("scanning");
      await sleep(2500);
      if (!isMounted) return;
      setStep("extracting");
      await sleep(2500);
      if (!isMounted) return;
      setStep("syncing");
      await sleep(4000);
      if (isMounted) runDemo();
    };
    runDemo();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-white border border-mist-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="h-[320px] bg-mist-50 p-5 flex flex-col shrink-0 relative">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-mist-200">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-mist-900 animate-pulse" />
            <span className="text-[10px] font-bold text-mist-500 uppercase tracking-tight">
              {t("badge", { defaultValue: "Context Crawler" })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-mist-400 font-medium">
              {t("pagesLabel", { defaultValue: "Pages" })}
            </span>
            <span className="text-[9px] font-bold text-mist-900 font-mono">
              12/12
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-mist-200 shadow-lg overflow-hidden flex-1 flex flex-col">
          <div className="p-3 bg-mist-50/50 border-b border-mist-100 flex-1 overflow-hidden">
            <div className="text-[9px] font-bold text-mist-400 uppercase tracking-widest mb-3">
              {t("activityLog", { defaultValue: "Activity Log" })}
            </div>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <div className="size-4 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-mist-900 leading-none">
                    {t("syncStarted", { defaultValue: "Sync Started" })}
                  </p>
                  <p className="text-[9px] text-mist-500 leading-normal">
                    {t("syncMessage", { defaultValue: "Crawling your website for translation context..." })}
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  "flex items-start gap-2.5 transition-all duration-500",
                  step === "extracting" || step === "syncing"
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2",
                )}
              >
                <div className="size-4 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="size-1.5 rounded-full bg-blue-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-mist-900 leading-none">
                    {t("extractingTerms", { defaultValue: "Extracting Terms" })}
                  </p>
                  <p className="text-[9px] text-mist-500 leading-normal">
                    {t("extractingMessage", { defaultValue: "Building glossary from your content..." })}
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  "flex items-start gap-2.5 transition-all duration-500",
                  step === "syncing"
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2",
                )}
              >
                <div className="size-4 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <IconCheckmark1 className="size-2.5 text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-mist-900 leading-none">
                    {t("manifestUploaded", { defaultValue: "Manifest Uploaded" })}
                  </p>
                  <p className="text-[9px] text-mist-500 leading-normal">
                    {t("manifestMessage", { defaultValue: "Context manifest ready for AI translations" })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold text-mist-900">
                {t("analysisApproved", { defaultValue: "Analysis Approved" })}
              </span>
            </div>
            <span className="text-[9px] text-mist-400 font-mono">
              better-i18n.com
            </span>
          </div>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col border-t border-mist-100">
        <h3 className="text-base font-medium text-mist-950">{t("title", { defaultValue: "Understands Your Product" })}</h3>
        <p className="mt-2 text-sm text-mist-700 leading-relaxed">
          {t("description", { defaultValue: "Our crawler analyzes your website to build context, glossaries, and terminology — so translations are always accurate." })}
        </p>
      </div>
    </div>
  );
}

export default function Features() {
  const t = useTranslations("features");
  const { locale } = useParams({ strict: false });

  return (
    <section id="features" className="py-16 bg-mist-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-10 sm:gap-16">
          <div className="flex flex-col gap-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
                {t("title", { defaultValue: "Everything you need to ship globally" })}
              </h2>
              <p className="mt-4 text-lg/8 text-mist-700">{t("subtitle", { defaultValue: "A complete localization platform built for modern development workflows." })}</p>
            </div>
            <Link
              to="/$locale/features"
              params={{ locale: locale || "en" }}
              className="inline-flex items-center gap-1 text-sm font-medium text-mist-700 hover:text-mist-950 w-fit"
            >
              {t("seeHowItWorks", { defaultValue: "See how it works" })}
              <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
            <AIFeatureCard />
            <PublishFeatureCard />
            <AIContextCard />
          </div>
        </div>
      </div>
    </section>
  );
}
