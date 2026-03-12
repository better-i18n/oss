import { vi } from "vitest";
import type { BetterI18nClient } from "../../client.js";

/**
 * Creates a proxy-based mock of BetterI18nClient.
 * Only mocked procedures work — unmocked ones throw descriptive errors.
 */
export function createMockClient(
  overrides: Record<
    string,
    Record<
      string,
      {
        query?: ReturnType<typeof vi.fn>;
        mutate?: ReturnType<typeof vi.fn>;
      }
    >
  > = {},
): BetterI18nClient {
  return new Proxy({} as BetterI18nClient, {
    get(_target, namespace: string) {
      if (namespace in overrides) {
        return new Proxy(
          {},
          {
            get(_, procedure: string) {
              const ns = overrides[namespace];
              if (ns && procedure in ns) return ns[procedure];
              return {
                query: vi.fn().mockRejectedValue(
                  new Error(
                    `[mock] ${namespace}.${procedure}.query not mocked`,
                  ),
                ),
                mutate: vi.fn().mockRejectedValue(
                  new Error(
                    `[mock] ${namespace}.${procedure}.mutate not mocked`,
                  ),
                ),
              };
            },
          },
        );
      }
      return new Proxy(
        {},
        {
          get(_, procedure: string) {
            return {
              query: vi.fn().mockRejectedValue(
                new Error(
                  `[mock] ${namespace}.${procedure}.query not mocked`,
                ),
              ),
              mutate: vi.fn().mockRejectedValue(
                new Error(
                  `[mock] ${namespace}.${procedure}.mutate not mocked`,
                ),
              ),
            };
          },
        },
      );
    },
  });
}
