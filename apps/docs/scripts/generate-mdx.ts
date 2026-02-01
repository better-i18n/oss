import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const contentDir = 'content';
const outDir = 'out';

async function main() {
  const entries = await fs.readdir(contentDir, { recursive: true });
  let count = 0;

  for (const entry of entries) {
    const entryStr = entry.toString();
    if (!entryStr.endsWith('.mdx')) continue;

    const sourcePath = path.join(contentDir, entryStr);
    const content = await fs.readFile(sourcePath, 'utf-8');

    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) continue;

    const [, frontmatter, body] = frontmatterMatch;

    // Parse title from frontmatter
    const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
    const title = titleMatch ? titleMatch[1] : 'Untitled';

    // Parse description from frontmatter
    const descMatch = frontmatter.match(/description:\s*["']?([^"'\n]+)["']?/);
    const description = descMatch ? descMatch[1] : '';

    // Create output path: cli/index.mdx -> /cli.mdx, cli/scan.mdx -> /cli/scan.mdx
    const relativePath = entryStr.replace(/\\/g, '/');
    let outputPath: string;

    if (relativePath.endsWith('/index.mdx') || relativePath === 'index.mdx') {
      // cli/index.mdx -> cli.mdx
      outputPath = relativePath.replace(/\/index\.mdx$/, '.mdx').replace(/^index\.mdx$/, 'index.mdx');
    } else {
      // cli/scan.mdx -> cli/scan.mdx
      outputPath = relativePath;
    }

    const fullOutputPath = path.join(outDir, outputPath);
    const outputDirPath = path.dirname(fullOutputPath);

    // Ensure output directory exists
    await fs.mkdir(outputDirPath, { recursive: true });

    // Write markdown content with title and description
    const markdown = `# ${title}

${description ? `${description}\n\n` : ''}${body.trim()}`;
    await fs.writeFile(fullOutputPath, markdown);

    count++;
  }

  console.log(`Generated ${count} MDX files for LLM copy feature`);
}

void main();
