import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CONFIG_DIR = join(homedir(), ".better-i18n");
const AUTH_FILE = join(CONFIG_DIR, "auth.json");

export interface StoredCredentials {
  apiKey: string;
  email: string;
  userId: string;
  organizationId?: string;
  organizationName?: string;
  apiUrl: string;
  createdAt: string;
}

function ensureConfigDir(): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function saveCredentials(creds: StoredCredentials): void {
  ensureConfigDir();
  writeFileSync(AUTH_FILE, JSON.stringify(creds, null, 2) + "\n", "utf-8");
}

export function loadCredentials(): StoredCredentials | null {
  if (!existsSync(AUTH_FILE)) return null;
  try {
    return JSON.parse(readFileSync(AUTH_FILE, "utf-8")) as StoredCredentials;
  } catch {
    return null;
  }
}

export function clearCredentials(): boolean {
  if (!existsSync(AUTH_FILE)) return false;
  unlinkSync(AUTH_FILE);
  return true;
}

export function getAuthFilePath(): string {
  return AUTH_FILE;
}

export interface ResolvedAuth {
  apiKey: string;
  apiUrl: string;
  source: "flag" | "env" | "credentials" | "config";
}

export function resolveAuth(options: {
  apiKey?: string;
  apiUrl?: string;
}): ResolvedAuth | null {
  if (options.apiKey) {
    return {
      apiKey: options.apiKey,
      apiUrl: options.apiUrl || "https://dash.better-i18n.com",
      source: "flag",
    };
  }

  if (process.env.BETTER_I18N_API_KEY) {
    return {
      apiKey: process.env.BETTER_I18N_API_KEY,
      apiUrl: options.apiUrl || process.env.BETTER_I18N_API_URL || "https://dash.better-i18n.com",
      source: "env",
    };
  }

  const creds = loadCredentials();
  if (creds?.apiKey) {
    return {
      apiKey: creds.apiKey,
      apiUrl: options.apiUrl || creds.apiUrl,
      source: "credentials",
    };
  }

  return null;
}
