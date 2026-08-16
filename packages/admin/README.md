# @better-i18n/admin

Typed admin client for the [Better i18n](https://better-i18n.com) API. Use it to script the things you would otherwise click: creating projects, adding languages, importing keys, writing translations, publishing, and managing CMS content.

```bash
npm install @better-i18n/admin
```

## Quick start

```ts
import { createAdminClient } from "@better-i18n/admin";

const admin = createAdminClient({
  apiKey: process.env.BETTER_I18N_API_KEY!,
  projectId: "acme/website", // "org/project", or a project UUID
});

await admin.languages.add({
  languages: [{ languageCode: "en-gb" }, { languageCode: "en-ca" }],
});

const { k: keys, nss: namespaces } = await admin.keys.list({ limit: 50 });
```

Create an API key from the Better i18n dashboard. Keys are scoped to one
organization, so the project you pass has to belong to it.

## Configuration

| Option | Required | Description |
| --- | --- | --- |
| `apiKey` | yes | Organization-scoped API key |
| `projectId` | yes | `"org/project"` slug pair, or the project UUID |
| `apiUrl` | no | Defaults to the hosted API |
| `debug` | no | Log each request |
| `fetch` | no | Supply your own `fetch`, e.g. in a worker runtime |

Passing a UUID costs one extra request while the client resolves it to a slug
pair. Pass `"org/project"` when you know it.

## Namespaces

| Namespace | Methods |
| --- | --- |
| `projects` | `get`, `list` |
| `keys` | `list`, `create`, `update`, `delete` |
| `translations` | `get`, `set`, `publish`, `context`, `pendingChanges` |
| `languages` | `add`, `update`, `delete` |
| `sync` | `list`, `get`, `cancel` |
| `content` | entries, models, fields: `list`, `get`, `create`, `update`, `publish`, `delete`, `duplicate`, `bulkCreate`, `bulkUpdate`, `bulkPublish`, plus field `add`, `update`, `remove`, `reorder` |
| `analytics` | `views`, `stats` |

Every method is typed from the same schemas the API validates against, so the
arguments you pass and the shape you get back are checked at compile time.

## Compact responses

Read endpoints answer in a compact shape. The same endpoints back the MCP
servers, where short field names cut token use by roughly half, and the admin
client returns them unchanged rather than maintaining a second wire format.

```ts
const res = await admin.keys.list({ limit: 50 });
// { tot, ret, pg, lim, has_more, nss, k }

for (const key of res.k) {
  console.log(res.nss[key.ns], key.k); // namespace, key name
}
```

`nss` is a namespace lookup table and `key.ns` indexes into it, so a namespace
string is stored once per page rather than once per key. Field names are
documented on each response type, and your editor will list them.

## Array parameters

Parameters that take a list also accept a JSON string, because agents calling
through MCP often serialize arrays that way:

```ts
await admin.languages.add({ languages: [{ languageCode: "fr" }] });
await admin.languages.add({ languages: '[{"languageCode":"fr"}]' });
```

## Language codes

Codes are BCP 47 and stored lowercase: `fr`, `pt-br`, `zh-hans`, `en-ca`. They
are normalised on the way in, so `"en-CA"` and `"en-ca"` behave the same.

## Related packages

- [`@better-i18n/sdk`](https://www.npmjs.com/package/@better-i18n/sdk) reads published content at runtime
- [`@better-i18n/cli`](https://www.npmjs.com/package/@better-i18n/cli) scans a repo for keys and syncs them
- [`@better-i18n/mcp`](https://www.npmjs.com/package/@better-i18n/mcp) exposes the same operations to AI agents over MCP

## Links

- [Documentation](https://docs.better-i18n.com)
- [Admin API reference](https://docs.better-i18n.com/admin/api-reference)
- [Issues](https://github.com/better-i18n/oss/issues)

MIT
