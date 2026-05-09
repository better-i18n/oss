import { createBlockRegistry } from "./_registry";
import { coverPreviewDashboardBlock } from "./cover-preview-dashboard";
import { coverPreviewEditorBlock } from "./cover-preview-editor";
import { coverPreviewAiBlock } from "./cover-preview-ai";
import { coverPreviewCdnBlock } from "./cover-preview-cdn";
import { coverGradientCaptionBlock } from "./cover-gradient-caption";
import { coverBlogBlock } from "./cover-blog";

export const BLOCKS = [
  coverPreviewDashboardBlock,
  coverPreviewEditorBlock,
  coverPreviewAiBlock,
  coverPreviewCdnBlock,
  coverGradientCaptionBlock,
  coverBlogBlock,
];

export const blockRegistry = createBlockRegistry(BLOCKS);

export { BlockRenderer, PageRenderer } from "./_renderer";
export { defineBlock } from "./_define-block";
export type { BlockInstance, BlockDef, BlockRenderContext } from "./_define-block";
