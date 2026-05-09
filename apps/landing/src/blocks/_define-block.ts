import type { z } from "zod";
import type { ReactNode } from "react";

export type BlockRenderContext = {
  size?: "card" | "featured";
};

export type BlockDef<TParams = unknown> = {
  slug: string;
  displayName: string;
  category?: string;
  description?: string;
  schema: z.ZodType<TParams>;
  render: (params: TParams, ctx?: BlockRenderContext) => ReactNode;
};

export function defineBlock<TParams>(def: BlockDef<TParams>): BlockDef<TParams> {
  return def;
}

export type BlockInstance = {
  type: string;
  params: unknown;
};
