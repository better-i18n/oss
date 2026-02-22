import { describe, it, expect } from "vitest";
import { fromNodeHeaders } from "../node.js";

describe("fromNodeHeaders", () => {
  it("converts simple string header values", () => {
    const headers = fromNodeHeaders({
      "accept-language": "tr-TR,tr;q=0.9",
      "content-type": "application/json",
    });

    expect(headers.get("accept-language")).toBe("tr-TR,tr;q=0.9");
    expect(headers.get("content-type")).toBe("application/json");
  });

  it("joins array header values with comma+space", () => {
    const headers = fromNodeHeaders({
      "x-forwarded-for": ["192.168.1.1", "10.0.0.1"],
    });

    expect(headers.get("x-forwarded-for")).toBe("192.168.1.1, 10.0.0.1");
  });

  it("skips undefined values", () => {
    const headers = fromNodeHeaders({
      "accept-language": "en",
      "x-missing": undefined,
    });

    expect(headers.get("accept-language")).toBe("en");
    expect(headers.get("x-missing")).toBeNull();
  });

  it("handles empty headers object", () => {
    const headers = fromNodeHeaders({});
    // Should be a valid Headers instance
    expect(headers instanceof Headers).toBe(true);
  });

  it("preserves header names as-is (case preserved by Headers)", () => {
    const headers = fromNodeHeaders({
      authorization: "Bearer token123",
    });
    // Headers.get() is case-insensitive per spec
    expect(headers.get("authorization")).toBe("Bearer token123");
    expect(headers.get("Authorization")).toBe("Bearer token123");
  });
});
