// OGP切り分け用デバッグエンドポイント。
// edgeランタイムから raw.githubusercontent のttfを取得できるかをJSONで返す（描画を介さない）。
export const runtime = 'edge';

const FONT_URL =
  'https://raw.githubusercontent.com/vercel/satori/main/test/assets/Roboto-Regular.ttf';

export async function GET() {
  let status = 'init';
  let len = -1;
  let err = '';
  try {
    const r = await fetch(FONT_URL, { cache: 'force-cache' });
    status = String(r.status);
    if (r.ok) {
      const b = await r.arrayBuffer();
      len = b.byteLength;
    }
  } catch (e) {
    err = e instanceof Error ? e.message : String(e);
  }
  return new Response(JSON.stringify({ status, len, err }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
