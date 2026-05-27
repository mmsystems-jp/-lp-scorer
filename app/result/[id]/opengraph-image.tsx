import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

// 静的Roboto（約164KB）をランタイムで直接取得（debugエンドポイントで描画実証済みの構成）。
const FONT_URL =
  'https://raw.githubusercontent.com/vercel/satori/main/test/assets/Roboto-Regular.ttf';

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
    // 取得失敗時は score=0 のまま
  }

  let fontData: ArrayBuffer | null = null;
  try {
    const fr = await fetch(FONT_URL, { cache: 'force-cache' });
    if (fr.ok) fontData = await fr.arrayBuffer();
  } catch {
    fontData = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          fontFamily: 'Roboto',
        }}
      >
        <div style={{ display: 'flex', fontSize: 44, color: '#6b7280', marginBottom: 12 }}>
          LP Scout
        </div>
        <div style={{ display: 'flex', fontSize: 180, color: '#2563eb', lineHeight: 1 }}>
          {score}
        </div>
        <div style={{ display: 'flex', fontSize: 44, color: '#9ca3af', marginTop: 8 }}>/ 100</div>
        <div style={{ display: 'flex', fontSize: 26, color: '#6b7280', marginTop: 28, letterSpacing: 4 }}>
          LANDING PAGE SCORE
        </div>
      </div>
    ),
    {
      ...size,
      headers: { 'cache-control': 'no-store, max-age=0, must-revalidate' },
      ...(fontData
        ? { fonts: [{ name: 'Roboto', data: fontData, style: 'normal' as const, weight: 400 as const }] }
        : {}),
    }
  );
}
