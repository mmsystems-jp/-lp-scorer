import * as cheerio from 'cheerio';

export async function scrapeUrl(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LPScout/1.0)' },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}にアクセスできませんでした`);

  const html = await res.text();
  const $ = cheerio.load(html);

  $('script, style, nav, footer, head').remove();

  const title = $('title').text().trim();
  const h1 = $('h1').map((_, el) => $(el).text().trim()).get().join('\n');
  const h2 = $('h2').map((_, el) => $(el).text().trim()).get().join('\n');
  const body = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 3000);

  return `【タイトル】\n${title}\n\n【H1】\n${h1}\n\n【H2見出し】\n${h2}\n\n【本文】\n${body}`;
}
