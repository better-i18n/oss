/**
 * One reading of a CMS job position, shared by the list and the detail route.
 *
 * Both pages used to format the salary inline and both handed the structured
 * data a hardcoded `employmentType: "FULL_TIME"` and `location: "Remote"` while
 * the page next to it printed the CMS `type` and `location` fields. So the
 * JSON-LD Google reads and the text a human reads came from two different
 * sources and could disagree. There is one source: the entry.
 */

import type { JobPosition } from "@/lib/content";

/** CMS `type` is authored free text; schema.org accepts four values. */
export function toEmploymentType(
  type: string,
): "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN" {
  const normalized = type.toLowerCase().replace(/[\s_]+/g, "-");
  if (normalized.startsWith("part")) return "PART_TIME";
  if (normalized.startsWith("contract") || normalized.startsWith("freelance")) return "CONTRACT";
  if (normalized.startsWith("intern")) return "INTERN";
  return "FULL_TIME";
}

/**
 * `$130K–$180K`, or null when the entry carries no range. Null is the signal to
 * render nothing at all — a "0" or a "Competitive" placeholder would be us
 * inventing a number the CMS does not hold.
 */
export function formatSalaryRange(position: JobPosition): string | null {
  const { salaryMin, salaryMax } = position;
  if (!salaryMin || !salaryMax) return null;
  const k = (value: number) => `$${Math.round(value / 1000)}K`;
  return salaryMin === salaryMax ? k(salaryMin) : `${k(salaryMin)}–${k(salaryMax)}`;
}

/** The one mapping from a CMS entry to `getCareersPageStructuredData` input. */
export function toJobPostingOptions(position: JobPosition) {
  const hasSalary = Boolean(position.salaryMin && position.salaryMax);
  return {
    title: position.title,
    description: position.summary || position.about,
    employmentType: toEmploymentType(position.type),
    location: position.location,
    remote: /remote/i.test(position.location),
    ...(hasSalary && {
      baseSalary: {
        minValue: position.salaryMin,
        maxValue: position.salaryMax,
        currency: "USD",
        unitText: "YEAR" as const,
      },
    }),
  };
}
