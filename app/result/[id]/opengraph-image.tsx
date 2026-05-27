import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export default async function OGImage({ params }: { params: { id: string } }) {
  let score = 0;
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://lp-scorer-three.vercel.app';
    const res = await fetch(`${base}/api/result/${params.id}`, { cache: 'no-store' });
    if (res.ok) {
      const record = await res.json();
      score = record?.totalScore ?? 0;
    }
  } catch {
    // 取得失敗時は score=0 のまま画像を返し、50を0を避ける
  }

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
        <div style={{ fontSize: 48, color: '#9ca3af' }}>/ 100</div>
        <div style={{ fontSize: 28, color: '#6b7280', marginTop: 24, letterSpacing: 4 }}>
          LANDING PAGE SCORE
        </div>
      </div>
    ),
    { ...size }
  );
}
