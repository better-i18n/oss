/**
 * Lightweight ICU message format parser and formatter.
 * Handles the most common ICU patterns without external dependencies.
 */

export interface ICUParseResult {
  readonly valid: boolean;
  readonly error?: string;
  readonly variables: readonly ICUVariable[];
}

export interface ICUVariable {
  readonly name: string;
  readonly type: "string" | "number" | "date" | "select" | "plural";
  readonly options?: readonly string[];
}

/** Check brace balance in an ICU message */
function checkBraceBalance(message: string): string | null {
  let depth = 0;
  for (let i = 0; i < message.length; i++) {
    const ch = message[i];
    if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth < 0) {
        return `Unexpected closing brace at position ${i}`;
      }
    }
  }
  if (depth !== 0) {
    return `Unbalanced braces: ${depth} unclosed opening brace${depth > 1 ? "s" : ""}`;
  }
  return null;
}

/** Extract content inside outermost braces starting at `start` index */
function extractBraceContent(message: string, start: number): { content: string; end: number } | null {
  if (message[start] !== "{") return null;
  let depth = 0;
  let i = start;
  while (i < message.length) {
    if (message[i] === "{") depth++;
    else if (message[i] === "}") {
      depth--;
      if (depth === 0) {
        return { content: message.slice(start + 1, i), end: i };
      }
    }
    i++;
  }
  return null;
}

/** Extract the branch labels (keys) from a select/plural clause body */
function extractBranchKeys(body: string): readonly string[] {
  const keys: string[] = [];
  let i = 0;
  while (i < body.length) {
    // skip whitespace
    while (i < body.length && /\s/.test(body[i])) i++;
    if (i >= body.length) break;

    // read key token (everything up to the next '{')
    let keyStart = i;
    while (i < body.length && body[i] !== "{") i++;
    const key = body.slice(keyStart, i).trim();
    if (key) keys.push(key);

    // skip the brace-enclosed value
    if (i < body.length && body[i] === "{") {
      const result = extractBraceContent(body, i);
      if (result) {
        i = result.end + 1;
      } else {
        break;
      }
    }
  }
  return keys;
}

/** Extract select option labels (omitting ICU plural keywords) */
function extractSelectOptions(body: string): readonly string[] {
  const PLURAL_KEYWORDS = new Set(["zero", "one", "two", "few", "many", "other"]);
  return extractBranchKeys(body).filter((k) => !PLURAL_KEYWORDS.has(k) && !k.startsWith("="));
}

/** Parse an ICU message and extract variables */
export function parseICUMessage(message: string): ICUParseResult {
  const balanceError = checkBraceBalance(message);
  if (balanceError) {
    return { valid: false, error: balanceError, variables: [] };
  }

  const seen = new Map<string, ICUVariable>();
  const errors: string[] = [];

  let i = 0;
  while (i < message.length) {
    if (message[i] !== "{") {
      i++;
      continue;
    }

    const block = extractBraceContent(message, i);
    if (!block) {
      i++;
      continue;
    }

    const content = block.content.trim();
    const parts = content.split(",").map((p) => p.trim());
    const name = parts[0];

    if (!name) {
      errors.push("Empty variable name found");
      i = block.end + 1;
      continue;
    }

    const typeHint = parts[1]?.toLowerCase();
    let varType: ICUVariable["type"] = "string";
    let options: readonly string[] | undefined;

    if (typeHint === "plural") {
      varType = "plural";
      const bodyStart = content.indexOf(",", content.indexOf(",") + 1);
      const body = bodyStart !== -1 ? content.slice(bodyStart + 1) : "";
      const keys = extractBranchKeys(body);
      if (!keys.includes("other")) {
        errors.push(`Plural variable "${name}" is missing required "other" clause`);
      }
    } else if (typeHint === "select") {
      varType = "select";
      const bodyStart = content.indexOf(",", content.indexOf(",") + 1);
      const body = bodyStart !== -1 ? content.slice(bodyStart + 1) : "";
      const keys = extractBranchKeys(body);
      options = extractSelectOptions(body);
      if (!keys.includes("other")) {
        errors.push(`Select variable "${name}" is missing required "other" clause`);
      }
    } else if (typeHint === "number") {
      varType = "number";
    } else if (typeHint === "date" || typeHint === "time") {
      varType = "date";
    } else if (typeHint === undefined || typeHint === "") {
      varType = "string";
    } else {
      // unknown format — still treat as string, but note it
      varType = "string";
    }

    if (!seen.has(name)) {
      seen.set(name, { name, type: varType, ...(options ? { options } : {}) });
    }

    // Advance past entire block (skip nested content already accounted for)
    i = block.end + 1;
  }

  if (errors.length > 0) {
    return { valid: false, error: errors.join("; "), variables: Array.from(seen.values()) };
  }

  return { valid: true, variables: Array.from(seen.values()) };
}

/** Resolve the correct plural branch for a numeric value */
function resolvePluralBranch(
  value: number,
  locale: string,
  branches: Record<string, string>,
): string {
  // Exact matches first (=0, =1, etc.)
  const exactKey = `=${value}`;
  if (branches[exactKey] !== undefined) return branches[exactKey];

  // Intl.PluralRules category
  let category = "other";
  try {
    const rules = new Intl.PluralRules(locale);
    category = rules.select(value);
  } catch {
    // fall through to "other"
  }

  return branches[category] ?? branches["other"] ?? String(value);
}

/** Parse branch map from plural/select body text */
function parseBranchMap(body: string): Record<string, string> {
  const map: Record<string, string> = {};
  let i = 0;
  while (i < body.length) {
    while (i < body.length && /\s/.test(body[i])) i++;
    if (i >= body.length) break;

    let keyStart = i;
    while (i < body.length && body[i] !== "{") i++;
    const key = body.slice(keyStart, i).trim();

    if (!key || i >= body.length) break;

    const block = extractBraceContent(body, i);
    if (!block) break;

    map[key] = block.content;
    i = block.end + 1;
  }
  return map;
}

/** Format an ICU message with given values */
export function formatICUMessage(
  message: string,
  values: Record<string, string | number>,
  locale: string,
): string {
  const balanceError = checkBraceBalance(message);
  if (balanceError) return `[Error: ${balanceError}]`;

  let result = "";
  let i = 0;

  while (i < message.length) {
    if (message[i] !== "{") {
      result += message[i];
      i++;
      continue;
    }

    const block = extractBraceContent(message, i);
    if (!block) {
      result += message[i];
      i++;
      continue;
    }

    const content = block.content.trim();
    const commaIdx = content.indexOf(",");

    if (commaIdx === -1) {
      // Simple variable: {name}
      const varName = content.trim();
      const val = values[varName];
      result += val !== undefined ? String(val) : `{${varName}}`;
    } else {
      const varName = content.slice(0, commaIdx).trim();
      const rest = content.slice(commaIdx + 1).trim();
      const secondCommaIdx = rest.indexOf(",");
      const typeHint = (secondCommaIdx !== -1 ? rest.slice(0, secondCommaIdx) : rest).trim().toLowerCase();
      const body = secondCommaIdx !== -1 ? rest.slice(secondCommaIdx + 1) : "";
      const rawVal = values[varName];

      if (typeHint === "plural") {
        const numVal = typeof rawVal === "number" ? rawVal : Number(rawVal ?? 0);
        const branches = parseBranchMap(body);
        let branch = resolvePluralBranch(numVal, locale, branches);
        // Replace # with the actual number, then recursively format
        branch = branch.replace(/#/g, String(numVal));
        try {
          result += formatICUMessage(branch, values, locale);
        } catch {
          result += branch;
        }
      } else if (typeHint === "select") {
        const strVal = rawVal !== undefined ? String(rawVal) : "other";
        const branches = parseBranchMap(body);
        const branch = branches[strVal] ?? branches["other"] ?? `{${varName}}`;
        try {
          result += formatICUMessage(branch, values, locale);
        } catch {
          result += branch;
        }
      } else if (typeHint === "number") {
        const numVal = typeof rawVal === "number" ? rawVal : Number(rawVal ?? 0);
        try {
          result += new Intl.NumberFormat(locale).format(numVal);
        } catch {
          result += String(numVal);
        }
      } else if (typeHint === "date" || typeHint === "time") {
        const dateVal = rawVal !== undefined ? new Date(rawVal) : new Date();
        try {
          result += typeHint === "time"
            ? new Intl.DateTimeFormat(locale, { timeStyle: "short" }).format(dateVal)
            : new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(dateVal);
        } catch {
          result += dateVal.toISOString();
        }
      } else {
        // Unknown format — treat as simple replacement
        result += rawVal !== undefined ? String(rawVal) : `{${varName}}`;
      }
    }

    i = block.end + 1;
  }

  return result;
}

export interface ICUExample {
  readonly name: string;
  readonly message: string;
  readonly variables: Record<string, string | number>;
}

/** Get example messages for the playground */
export function getICUExamples(): readonly ICUExample[] {
  return [
    {
      name: "Simple",
      message: "Hello, {name}!",
      variables: { name: "World" },
    },
    {
      name: "Plural",
      message: "{count, plural, one {# item} other {# items}}",
      variables: { count: 5 },
    },
    {
      name: "Select",
      message: "{gender, select, male {He} female {She} other {They}} liked your post",
      variables: { gender: "female" },
    },
    {
      name: "Nested",
      message: "{count, plural, one {{name} has # notification} other {{name} has # notifications}}",
      variables: { count: 3, name: "Alice" },
    },
    {
      name: "Number",
      message: "Your balance is {amount, number}",
      variables: { amount: 1234567 },
    },
    {
      name: "Combined",
      message: "{gender, select, male {He} female {She} other {They}} uploaded {count, plural, one {# photo} other {# photos}}",
      variables: { gender: "male", count: 42 },
    },
  ] as const;
}
