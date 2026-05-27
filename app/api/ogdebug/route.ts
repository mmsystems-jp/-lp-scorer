// OGP切り分け用デバッグエンドポイント。
// 1) edgeからttfを取得できるか
// 2) ImageResponse を実際に生成して PNG バイト数を返す or 例外を捕捉して返す
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

    const img = new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#2563eb',
            fontFamily: 'Roboto',
            fontSize: 80,
            color: '#ffffff',
          }}
        >
          TEST 88
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [{ name: 'Roboto', data: fontData, style: 'normal' as const, weight: 400 as const }],
      }
    );

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
