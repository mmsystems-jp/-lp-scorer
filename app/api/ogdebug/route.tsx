// OGP切り分け用デバッグエンドポイント（JSXを使わずオブジェクト要素で記述＝.tsのままコンパイル可）。
// 1) edgeからttfを取得できるか 2) ImageResponseを実生成してPNGバイト数 or 例外を返す
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const FONT_URL =
  'https://raw.githubusercontent.com/vercel/satori/main/test/assets/Roboto-Regular.ttf';

export async function GET() {
  const log: Record<string, unknown> = {};
  try {
    const fr = await fetch(FONT_URL, { cache: 'force-cache' });
    log.fontStatus = fr.status;
    const fontData = await fr.arrayBuffer();
    log.fontLen = fontData.byteLength;

    const element = {
      type: 'div',
      key: null,
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#2563eb',
          color: '#ffffff',
          fontSize: 80,
          fontFamily: 'Roboto',
        },
        children: 'TEST 88',
      },
    };

    const img = new ImageResponse(element as unknown as React.ReactElement, {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Roboto', data: fontData, style: 'normal' as const, weight: 400 as const }],
    });

    const buf = await img.arrayBuffer();
    log.pngLen = buf.byteLength;
    log.ok = true;
  } catch (e) {
    log.ok = false;
    log.err = e instanceof Error ? `${e.message} :: ${e.stack ?? ''}` : String(e);
  }
  return new Response(JSON.stringify(log), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
