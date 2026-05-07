import { NextRequest, NextResponse } from 'next/server';
import { getScore } from '@/lib/dynamo';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const record = await getScore(params.id);
  if (!record) {
    return NextResponse.json({ error: '結果が見つかりません' }, { status: 404 });
  }
  return NextResponse.json(record);
}
