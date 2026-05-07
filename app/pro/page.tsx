'use client';

import { useState } from 'react';

export default function ProPage() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">LP Scout Pro</h1>
        <p className="text-gray-500 text-center mb-8">採点回数の制限をなくす</p>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <div className="text-center mb-6">
            <span className="text-5xl font-bold text-gray-900">¥300</span>
            <span className="text-gray-500"> / 月</span>
          </div>

          <ul className="space-y-2 mb-6">
            <li className="text-gray-700 text-sm">✓ 採点回数 月30回（無料3回/日から大幅アップ）</li>
            <li className="text-gray-700 text-sm">✓ 採点履歴の保存</li>
            <li className="text-gray-700 text-sm">✓ 広告なし</li>
          </ul>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="bg-blue-600 text-white w-full py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '処理中...' : 'Proにアップグレード'}
          </button>
        </div>

        <a href="/" className="text-gray-500 text-sm mt-6 block text-center hover:underline">
          ← トップに戻る
        </a>
      </div>
    </main>
  );
}
