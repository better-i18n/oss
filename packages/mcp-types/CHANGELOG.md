# @better-i18n/mcp-types

## 0.0.1

### Patch Changes

- 98dccd3: Add path collision detection to createKeys MCP tool. When creating keys that would cause leaf↔object conflicts in JSON output (e.g., "step.workspace.title" when "step.workspace" exists as a leaf), the tool now throws a CONFLICT error with detailed explanation. Also detects intra-batch collisions. Use `force: true` to override when intentional.
