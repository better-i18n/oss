---
"@better-i18n/mcp-content": minor
---

Add `scheduleContentEntry` and `unscheduleContentEntry`. An entry can now be scheduled to publish at a future time (ISO 8601 with offset), optionally for some languages only, and the schedule can be cancelled. Entries with a pending schedule report it as `sch_at` (and `sch_langs`).
