import { useState, useEffect, useRef } from "react";
import { trackBlogReadProgress } from "@/lib/analytics-events";

const READ_THRESHOLDS = [25, 50, 75, 100] as const;

interface ReadingProgressProps {
  slug?: string;
}

export default function ReadingProgress({ slug }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const firedRef = useRef(new Set<number>());

  useEffect(() => {
    firedRef.current = new Set<number>();
  }, [slug]);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      const clamped = Math.min(100, Math.max(0, scrolled));
      setProgress(clamped);

      // Fire read progress events at thresholds
      if (slug) {
        for (const t of READ_THRESHOLDS) {
          if (clamped >= t && !firedRef.current.has(t)) {
            firedRef.current.add(t);
            trackBlogReadProgress({ slug, percent: t });
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
      className="fixed top-0 left-0 z-[100] h-0.5 w-full"
    >
      <div
        className="h-full bg-mist-950 will-change-[width] transition-[width] duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
