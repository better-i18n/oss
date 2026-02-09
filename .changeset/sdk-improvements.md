---
"@better-i18n/sdk": minor
---

Add generic custom fields, status filter, sort/order, and pagination metadata to Content SDK

- `ContentEntry<CF>` generic type parameter for typed custom fields
- `status` filter option (`draft`, `published`, `archived`)
- `sort` and `order` options for listing entries
- `PaginatedResponse<T>` wrapper with `items`, `total`, `hasMore`
- New exported types: `ContentEntryStatus`, `ContentEntrySortField`, `PaginatedResponse`
