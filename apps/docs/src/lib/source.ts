import { type InferPageType, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docs } from 'fumadocs-mdx:collections/server';
import { frameworkIconsPlugin } from './framework-icons-plugin';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
  plugins: [frameworkIconsPlugin(), lucideIconsPlugin()], // brand icons resolved first
});

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title}

${processed}`;
}
