import type { BlockDef } from "./_define-block";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BlockRegistry = Map<string, BlockDef<any>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createBlockRegistry(blocks: BlockDef<any>[]): BlockRegistry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = new Map<string, BlockDef<any>>();
  for (const b of blocks) map.set(b.slug, b);
  return map;
}
