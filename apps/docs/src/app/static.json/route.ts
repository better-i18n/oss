import { exportSearchIndexes } from '@/lib/export-static-indexes';

export const revalidate = false;

export async function GET() {
  return Response.json(await exportSearchIndexes());
}
