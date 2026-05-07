import { ImageResponse } from 'next/og';
import { getScore } from '@/lib/dynamo';

export const runtime = 'nodejs';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export default async function OGImage({ params }: { params: { id: string } }) {
  const record = await getScore(params.id);
  const score = record?.totalScore ?? 0;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 48, color: '#6b7280', marginBottom: 16 }}>LP Scout</div>
        <div style={{ fontSize: 160, fontWeight: 'bold', color: '#2563eb', lineHeight: 1 }}>
          {score}
        </div>
        <div style={{ fontSize: 48, color: '#9ca3af' }}>/ 100点</div>
        <div style={{ fontSize: 32, color: '#6b7280', marginTop: 24 }}>
          ランディングページ採点結果
        </div>
      </div>
    ),
    { ...size }
  );
}
