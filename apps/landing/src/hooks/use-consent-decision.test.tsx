// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { revokeConsent, setConsent } from "@/lib/cookie-consent";
import { useConsentDecision } from "./use-consent-decision";

// Rendered through react-dom directly: the hook's own React instance must be
// the one that renders it, and a separately resolved testing-library copy
// left the dispatcher null ("Cannot read properties of null (reading
// 'useState')") on this workspace layout.
let root: Root;
let container: HTMLDivElement;
let latest: boolean | undefined;

function Probe() {
  latest = useConsentDecision();
  return null;
}

beforeEach(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  latest = undefined;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  localStorage.clear();
});

const mount = () => act(() => root.render(<Probe />));

describe("useConsentDecision", () => {
  it("is false until the visitor answers the banner", () => {
    mount();
    expect(latest).toBe(false);
  });

  it("is true when a decision was stored before mount", () => {
    setConsent({ analytics: false, marketing: false });
    mount();
    expect(latest).toBe(true);
  });

  it("flips when the banner records a decision, in either direction", () => {
    mount();
    expect(latest).toBe(false);
    act(() => setConsent({ analytics: true, marketing: true }));
    expect(latest).toBe(true);
    act(() => revokeConsent());
    expect(latest).toBe(false);
  });
});
