import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { scrapeUrl } from '@/lib/scraper';
import { scoreLP } from '@/lib/claude';
import { saveScore, isProUser, getAndIncrementProCount } from '@/lib/dynamo';
import { checkRateLimit } from '@/lib/ratelimit';
import { ScoreRecord } from '@/lib/types';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const isPro = await isProUser(ip);

  if (isPro) {
    const count = await getAndIncrementProCount(ip);
    if (count > 30) {
      return NextResponse.json(
        { error: 'Proプランの月間上限（30回）に達しました。翌月1日にリセットされます。' },
        { status: 429 }
      );
    }
  } else {
    const { allowed } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: '1日の採点上限（3回）に達しました。明日またお試しください。' },
        { status: 429 }
      );
    }
  }

  let body: { type: string; value: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'リクエストが不正です' }, { status: 400 });
  }

  const { type, value } = body;
  if (!type || !value?.trim()) {
    return NextResponse.json({ error: 'URLまたはテキストを入力してください' }, { status: 400 });
  }

  if (type === 'text' && value.length > 5000) {
    return NextResponse.json({ error: 'テキストは5000文字以内にしてください' }, { status: 400 });
  }

  try {
    let content: string;
    if (type === 'url') {
      content = await scrapeUrl(value);
    } else {
      content = value;
    }

    const claudeResult = await scoreLP(content);
    const totalScore = Math.round(
      Object.values(claudeResult.scores).reduce((a, b) => a + b, 0)
    );

    const id = randomUUID().replace(/-/g, '').slice(0, 16);
    const record: ScoreRecord = {
      id,
      inputType: type as 'url' | 'text',
      inputValue: type === 'url' ? value : value.slice(0, 200),
      totalScore,
      scores: claudeResult.scores,
      comments: claudeResult.comments,
      summary: claudeResult.summary,
      createdAt: new Date().toISOString(),
    };

    await saveScore(record);
    return NextResponse.json({ id });
  } catch (err) {
    const message = err instanceof Error ? err.message : '採点中にエラーが発生しました';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
