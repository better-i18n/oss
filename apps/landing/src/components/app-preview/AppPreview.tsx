import { useRef } from "react";
import { DetailPanel } from "./DetailPanel";
import { KeyTable } from "./KeyTable";
import { Sidebar } from "./Sidebar";
import { WORKSPACES } from "./data";
import { useDemoLoop } from "@/components/features/use-demo-loop";

/* Module-level: `useDemoLoop` lists `beats` in its effect deps, so an inline
   array re-runs the effect on every render and pins the loop to beat 0. */
const WORKSPACE_BEATS = WORKSPACES.map(() => ({ durationMs: 3200 }));

/**
 * AppPreview — a static, near-pixel replica of the Better i18n translation
 * editor, drawn for the hero panel.
 *
 * Why a replica and not the interactive demo it replaces: the hero has to answer
 * "what IS this product" in one glance. A chat drawer answers "it has an AI
 * chat"; the editor screen shows namespaces, keys, locales, statuses, the
 * glossary constraint, the AI proposal and the publish/CDN state — the whole
 * loop, at rest. Same intent as the reference implementation's dashboard
 * replica in its own hero.
 *
 * Deliberately NOT like that reference in two respects:
 *   - No fixed design width + ResizeObserver/transform scale. The frame gives
 *     this panel ~1096px, which is enough to draw the three panes at native
 *     size, so the layout is plain flexbox — nothing to measure, nothing to
 *     re-render on resize, and it renders identically during SSR.
 *   - No animation loop and no framer-motion. It sits in the LCP neighbourhood;
 *     it is lazy-loaded by the hero and then costs nothing per frame.
 *
 * Accessibility: the whole thing is `aria-hidden` and contains no focusable
 * element (divs and spans only, no buttons/inputs/links, no tabIndex). A screen
 * reader or keyboard user must never end up navigating a fake application —
 * the hero's real headline, email field and CTA are the accessible surface.
 */
export function AppPreview() {
  const rootRef = useRef<HTMLDivElement>(null);
  // One loop for the whole replica: the rail, the project slug and the table's
  // active namespace advance together. Runs only while on screen and freezes
  // under `prefers-reduced-motion` (see useDemoLoop).
  const { beatIndex } = useDemoLoop({ beats: WORKSPACE_BEATS, ref: rootRef });
  const workspace = WORKSPACES[beatIndex % WORKSPACES.length]!;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="flex h-full w-full select-none bg-white text-left"
    >
      <Sidebar workspace={workspace} />
      <KeyTable workspace={workspace} />
      <DetailPanel />
    </div>
  );
}

export default AppPreview;
