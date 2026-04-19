import { getPackageVersions } from '@/lib/get-versions';

export const revalidate = false;
export const dynamic = 'force-static';

export async function GET() {
  const versions = getPackageVersions();
  return new Response(JSON.stringify(versions), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
