import type { Logger, LogLevel, NormalizedConfig } from "./types";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

const shouldLog = (targetLevel: LogLevel, configLevel: LogLevel): boolean =>
  LOG_LEVELS[targetLevel] >= LOG_LEVELS[configLevel];

/**
 * Create a logger instance with namespace prefix
 */
export const createLogger = (
  config: NormalizedConfig,
  namespace: string
): Logger => {
  const prefix = `[better-i18n:${namespace}]`;
  const level = config.logLevel ?? (config.debug ? "debug" : "warn");

  const noop = () => {};

  return {
    debug: shouldLog("debug", level)
      ? (...args: unknown[]) => console.debug(prefix, ...args)
      : noop,
    info: shouldLog("info", level)
      ? (...args: unknown[]) => console.info(prefix, ...args)
      : noop,
    warn: shouldLog("warn", level)
      ? (...args: unknown[]) => console.warn(prefix, ...args)
      : noop,
    error: shouldLog("error", level)
      ? (...args: unknown[]) => console.error(prefix, ...args)
      : noop,
  };
};
