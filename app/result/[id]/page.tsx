import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getScore } from '@/lib/dynamo';
import { SCORE_ITEMS } from '@/lib/types';
import { ScoreRadar } from '@/components/ScoreRadar';
import { ScoreCard } from '@/components/ScoreCard';
import { ShareButton } from '@/components/ShareButton';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const record = await getScore(params.id);
  if (!record) return { title: '結果が見つかりません' };
  return {
    title: `LP Scout: ${record.totalScore}点 - あなたのLPの採点結果`,
    description: record.summary,
  };
}

export default async function ResultPage({ params }: Props) {
  const record = await getScore(params.id);
  if (!record) notFound();

  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://lp-scout.vercel.app'}/result/${params.id}`;

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        {record.inputType === 'url' && (
          <div className="mb-4">
            <p className="text-2xl font-bold text-gray-800">
              {(() => { try { return new URL(record.inputValue).hostname.replace(/^www\./, ''); } catch { return record.inputValue; } })()}
            </p>
            <p className="text-sm text-gray-400 mt-1">{record.inputValue}</p>
            <hr className="mt-3 border-gray-200" />
          </div>
        )}
        <div className="text-6xl font-bold text-blue-600 mb-1">
          {record.totalScore}
          <span className="text-2xl text-gray-400"> / 100</span>
        </div>
        <p className="text-gray-600 mt-3 text-sm leading-relaxed">{record.summary}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4 text-center">レーダーチャート</h2>
        <ScoreRadar scores={record.scores} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {SCORE_ITEMS.map(item => (
          <ScoreCard
            key={item.key}
            label={item.label}
            score={record.scores[item.key]}
            comment={record.comments[item.key]}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <ShareButton score={record.totalScore} url={pageUrl} />
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors"
        >
          別のLPを採点する
        </Link>
      </div>
    </main>
  );
}
