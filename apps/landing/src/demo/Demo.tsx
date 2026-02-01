import { DemoAIDrawerStandalone } from "./components/DemoAIDrawerStandalone";

/**
 * Interactive AI-first demo showcasing the translation assistant
 * Features:
 * - AI chat interface with context-aware suggestions
 * - Embedded translation previews in messages
 * - Human-in-the-loop approval flow
 * - Real-time translation application
 */
export function Demo() {
  return (
    <div className="relative w-full h-full">
      <DemoAIDrawerStandalone />
    </div>
  );
}
