import { getLLMText, source } from '@/lib/source';
import { generateVersionHeader } from '@/lib/get-versions';

export const revalidate = false;

export async function GET() {
  const versionHeader = generateVersionHeader();
  const scan = source.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(versionHeader + scanned.join('\n\n'));
}
