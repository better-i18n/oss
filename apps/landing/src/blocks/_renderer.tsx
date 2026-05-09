import { Fragment } from "react";
import type { BlockInstance, BlockRenderContext } from "./_define-block";
import type { BlockRegistry } from "./_registry";

type BlockRendererProps = {
  block: BlockInstance;
  registry: BlockRegistry;
  context?: BlockRenderContext;
};

export function BlockRenderer({ block, registry, context }: BlockRendererProps) {
  const def = registry.get(block.type);
  if (!def) return null;
  const parsed = def.schema.safeParse(block.params);
  if (!parsed.success) return null;
  return <>{def.render(parsed.data, context)}</>;
}

export function PageRenderer({
  blocks,
  registry,
  context,
}: {
  blocks: ReadonlyArray<BlockInstance>;
  registry: BlockRegistry;
  context?: BlockRenderContext;
}) {
  return (
    <>
      {blocks.map((b, i) => (
        <Fragment key={i}>
          <BlockRenderer block={b} registry={registry} context={context} />
        </Fragment>
      ))}
    </>
  );
}
