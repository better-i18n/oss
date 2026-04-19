import { getLLMText, source } from '@/lib/source';
import { generateVersionHeader } from '@/lib/get-versions';

export const revalidate = false;

export async function GET() {
  const [versionHeader, scanned] = await Promise.all([
    generateVersionHeader(),
    Promise.all(source.getPages().map(getLLMText)),
  ]);

  return new Response(versionHeader + scanned.join('\n\n'));
}
