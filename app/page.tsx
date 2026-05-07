'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SAMPLE_URL = 'https://example.com';
const SAMPLE_TEXT = `【サービス名】LP Scout
【キャッチコピー】AIがあなたのLPを即座に採点
【特徴】10項目の詳細分析・レーダーチャートで可視化・改善アドバイス付き
【実績】累計1,000件以上の採点実績
【料金】無料でご利用いただけます`;

export default function HomePage() {
  const router = useRouter();
  const [tab, setTab] = useState<'url' | 'text'>('url');
  const [urlValue, setUrlValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const value = tab === 'url' ? urlValue : textValue;
    if (!value.trim()) {
      setError(tab === 'url' ? 'URLを入力してください' : 'テキストを入力してください');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: tab, value: value.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'エラーが発生しました');
        return;
      }

      router.push(`/result/${data.id}`);
    } catch {
      setError('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">LP Scout</h1>
        <p className="text-gray-500">AIがランディングページを10項目で採点します</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex gap-2 mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setTab('url')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            URLで採点
          </button>
          <button
            onClick={() => setTab('text')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'text' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            テキストで採点
          </button>
        </div>

        {tab === 'url' ? (
          <div className="mb-4">
            <input
              type="url"
              value={urlValue}
              onChange={e => setUrlValue(e.target.value)}
              placeholder="https://example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setUrlValue(SAMPLE_URL)}
              className="mt-2 text-xs text-blue-500 hover:underline"
            >
              サンプルURLを使う
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <textarea
              value={textValue}
              onChange={e => setTextValue(e.target.value)}
              placeholder="LPのテキストをペーストしてください（最大5000文字）"
              rows={8}
              maxLength={5000}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex justify-between mt-1">
              <button
                onClick={() => setTextValue(SAMPLE_TEXT)}
                className="text-xs text-blue-500 hover:underline"
              >
                サンプルテキストを使う
              </button>
              <span className="text-xs text-gray-400">{textValue.length} / 5000</span>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '採点中...' : '採点する'}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          無料3回/日まで利用可能
        </p>
        <a href="/pro" className="text-blue-500 text-xs hover:underline block text-center mt-1">
          回数制限に達した方は Pro プランへ →
        </a>
      </div>
    </main>
  );
}
