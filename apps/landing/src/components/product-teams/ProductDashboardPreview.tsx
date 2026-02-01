"use client";

import { motion } from "framer-motion";

// Consistent color palette
const colors = {
  complete: "#10b981", // emerald-500
  high: "#3b82f6", // blue-500
  medium: "#f59e0b", // amber-500
  low: "#94a3b8", // slate-400
  accent: "#6366f1", // indigo-500
};

const languages = [
  {
    code: "DE",
    name: "German",
    progress: 94,
    flag: "🇩🇪",
    translated: 277,
    total: 295,
  },
  {
    code: "FR",
    name: "French",
    progress: 87,
    flag: "🇫🇷",
    translated: 257,
    total: 295,
  },
  {
    code: "ES",
    name: "Spanish",
    progress: 82,
    flag: "🇪🇸",
    translated: 242,
    total: 295,
  },
  {
    code: "JA",
    name: "Japanese",
    progress: 45,
    flag: "🇯🇵",
    translated: 133,
    total: 295,
  },
  {
    code: "KO",
    name: "Korean",
    progress: 23,
    flag: "🇰🇷",
    translated: 68,
    total: 295,
  },
];

const namespaces = [
  { name: "auth", keys: 24, progress: 100, icon: "🔐" },
  { name: "dashboard", keys: 156, progress: 92, icon: "📊" },
  { name: "checkout", keys: 48, progress: 78, icon: "🛒" },
  { name: "settings", keys: 67, progress: 65, icon: "⚙️" },
];

const recentActivity = [
  {
    user: "Sarah",
    action: "approved",
    count: 12,
    lang: "German",
    time: "2m ago",
  },
  {
    user: "AI",
    action: "translated",
    count: 24,
    lang: "Japanese",
    time: "5m ago",
  },
  { user: "Mike", action: "edited", count: 3, lang: "French", time: "12m ago" },
];

function getProgressColor(progress: number): string {
  if (progress >= 90) return colors.complete;
  if (progress >= 70) return colors.high;
  if (progress >= 40) return colors.medium;
  return colors.low;
}

export default function ProductDashboardPreview() {
  return (
    <section className="px-2 py-16 lg:py-24">
      <div className="w-full mx-auto max-w-[1400px]">
        <div className="px-6 lg:px-10">
          {/* Section Header */}
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl/[1.2] font-semibold tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.2]">
              Your Localization Command Center
            </h2>
            <p className="mt-4 text-base text-mist-600">
              Real-time visibility into every language, every feature. Know
              exactly what's ready to ship.
            </p>
          </div>

          {/* Dashboard Mockup */}
          <motion.div
            className="bg-white rounded-2xl border border-mist-200 overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Browser Chrome */}
            <div className="flex items-center gap-3 px-4 py-3 bg-mist-50/80 border-b border-mist-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white rounded-lg px-4 py-1.5 text-xs text-mist-600 border border-mist-200 shadow-sm flex items-center gap-2">
                  <svg
                    className="w-3 h-3 text-mist-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  dash.better-i18n.com/acme/translations
                </div>
              </div>
              <div className="w-16" /> {/* Spacer for balance */}
            </div>

            {/* Main Dashboard Layout */}
            <div className="flex">
              {/* Sidebar */}
              <div className="hidden lg:block w-48 border-r border-mist-100 p-4 bg-mist-50/30">
                <div className="space-y-1">
                  {[
                    { name: "Overview", active: false },
                    { name: "Translations", active: true },
                    { name: "Languages", active: false },
                    { name: "Sync", active: false },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        item.active
                          ? "bg-mist-950 text-white font-medium"
                          : "text-mist-600 hover:bg-mist-100"
                      }`}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>

                {/* Mini Stats */}
                <div className="mt-6 pt-6 border-t border-mist-200">
                  <div className="text-xs text-mist-500 mb-3">Quick Stats</div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-lg font-semibold text-mist-950">
                        295
                      </div>
                      <div className="text-xs text-mist-500">Total Keys</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-emerald-600">
                        72%
                      </div>
                      <div className="text-xs text-mist-500">
                        Overall Progress
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 lg:p-8">
                {/* Top Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    {
                      label: "Total Keys",
                      value: "295",
                      change: "+12 this week",
                    },
                    { label: "Languages", value: "5", change: "2 in draft" },
                    {
                      label: "Ready to Publish",
                      value: "12",
                      change: null,
                      highlight: true,
                    },
                    { label: "Pending Review", value: "8", change: null },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      className={`p-4 rounded-xl border ${
                        stat.highlight
                          ? "bg-emerald-50 border-emerald-200"
                          : "bg-mist-50/50 border-mist-100"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="text-xs text-mist-500 mb-1">
                        {stat.label}
                      </div>
                      <div
                        className={`text-2xl font-semibold ${
                          stat.highlight ? "text-emerald-700" : "text-mist-950"
                        }`}
                      >
                        {stat.value}
                      </div>
                      {stat.change && (
                        <div className="text-xs text-mist-400 mt-1">
                          {stat.change}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  {/* Language Progress */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-mist-950">
                        Language Coverage
                      </h3>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colors.complete }}
                          />
                          <span className="text-mist-500">90%+</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colors.high }}
                          />
                          <span className="text-mist-500">70-89%</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colors.medium }}
                          />
                          <span className="text-mist-500">&lt;70%</span>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {languages.map((lang, idx) => (
                        <motion.div
                          key={lang.code}
                          className="group"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.08 }}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-xl w-8">{lang.flag}</span>
                            <div className="w-20">
                              <div className="text-sm font-medium text-mist-900">
                                {lang.name}
                              </div>
                              <div className="text-xs text-mist-400">
                                {lang.code}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="h-3 bg-mist-100 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{
                                    backgroundColor: getProgressColor(
                                      lang.progress,
                                    ),
                                  }}
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${lang.progress}%` }}
                                  viewport={{ once: true }}
                                  transition={{
                                    duration: 0.8,
                                    delay: idx * 0.08,
                                  }}
                                />
                              </div>
                            </div>
                            <div className="w-24 text-right">
                              <span className="text-sm font-semibold text-mist-950">
                                {lang.progress}%
                              </span>
                              <span className="text-xs text-mist-400 ml-2">
                                {lang.translated}/{lang.total}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Namespace Breakdown */}
                    <div>
                      <h3 className="text-sm font-semibold text-mist-950 mb-4">
                        By Feature
                      </h3>
                      <div className="space-y-3">
                        {namespaces.map((ns, idx) => (
                          <motion.div
                            key={ns.name}
                            className="p-3 bg-mist-50/70 rounded-xl border border-mist-100"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.08 }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{ns.icon}</span>
                                <span className="text-sm font-medium text-mist-900">
                                  {ns.name}
                                </span>
                              </div>
                              <span className="text-xs text-mist-500">
                                {ns.keys} keys
                              </span>
                            </div>
                            <div className="h-1.5 bg-mist-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{
                                  backgroundColor: getProgressColor(
                                    ns.progress,
                                  ),
                                }}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${ns.progress}%` }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 0.6,
                                  delay: 0.2 + idx * 0.08,
                                }}
                              />
                            </div>
                            <div className="text-right mt-1">
                              <span
                                className="text-xs font-medium"
                                style={{ color: getProgressColor(ns.progress) }}
                              >
                                {ns.progress}%
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h3 className="text-sm font-semibold text-mist-950 mb-4">
                        Recent Activity
                      </h3>
                      <div className="space-y-3">
                        {recentActivity.map((activity, idx) => (
                          <motion.div
                            key={idx}
                            className="flex items-start gap-3 text-sm"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                activity.user === "AI"
                                  ? "bg-indigo-100 text-indigo-600"
                                  : "bg-mist-200 text-mist-600"
                              }`}
                            >
                              {activity.user === "AI" ? "🤖" : activity.user[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-mist-700">
                                <span className="font-medium">
                                  {activity.user}
                                </span>{" "}
                                {activity.action}{" "}
                                <span className="font-medium">
                                  {activity.count}
                                </span>{" "}
                                keys in {activity.lang}
                              </div>
                              <div className="text-xs text-mist-400">
                                {activity.time}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="mt-8 pt-6 border-t border-mist-100 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: colors.complete }}
                      />
                      <span className="text-sm text-mist-600">
                        12 ready to publish
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: colors.medium }}
                      />
                      <span className="text-sm text-mist-600">
                        8 pending review
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: colors.accent }}
                      />
                      <span className="text-sm text-mist-600">
                        24 AI suggestions
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-mist-700 hover:text-mist-900 hover:bg-mist-100 rounded-lg transition-colors">
                      Review All
                    </button>
                    <button className="px-5 py-2.5 bg-mist-950 text-white text-sm font-medium rounded-lg hover:bg-mist-800 transition-colors flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Publish to CDN
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
