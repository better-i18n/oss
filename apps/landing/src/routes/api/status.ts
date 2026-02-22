import { createFileRoute } from "@tanstack/react-router"

const BETTERSTACK_URL = "https://better-i18n.betteruptime.com/index.json"

export const Route = createFileRoute("/api/status")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const res = await fetch(BETTERSTACK_URL)
          const json = await res.json()
          const status = json?.data?.attributes?.aggregate_state ?? "operational"
          return Response.json(
            { status },
            { headers: { "Cache-Control": "public, max-age=60" } },
          )
        } catch {
          return Response.json({ status: "operational" })
        }
      },
    },
  },
})
