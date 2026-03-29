import { createClient } from "@better-i18n/sdk";

/**
 * Singleton Better i18n Content client.
 * Instantiated once at module scope — shared across all requests.
 */
export const contentClient = createClient({
  project: "better-i18n/hydrogen-demo",
  apiKey:
    "bi_pub_zwuKcFTbINhlGfzmdAFyElEUIHIIoldqNPiWdAnqGkDajobnYzVjmKiUwYtqpBuj",
});
