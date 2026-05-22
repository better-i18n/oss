---
"@better-i18n/mcp": patch
---

Fix EADDRINUSE crash when the OAuth loopback port is busy.

The bridge now (a) defaults to port 8989 (distinct from @helpway/mcp so users running both bridges don't collide) and (b) probes the next 16 ports if the preferred one is occupied, reflecting the actual bound port in the OAuth redirect_uri. Set `BETTER_I18N_OAUTH_PORT` to pin a specific port.

Reference incident: stale Node process holding 8976 caused the bridge to crash with `EADDRINUSE` before opening the browser; Claude Code timed out the MCP server connect.
