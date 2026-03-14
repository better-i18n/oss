export interface FormatConverter {
  readonly parse: (input: string) => Record<string, string>;
  readonly serialize: (data: Record<string, string>, options?: Record<string, unknown>) => string;
}
