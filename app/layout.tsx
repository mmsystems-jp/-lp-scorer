import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LP Scout - ランディングページ採点ツール',
  description: 'AIがあなたのLPを10項目で採点。改善ポイントを即座にフィードバック。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>{children}<Analytics /></body>
    </html>
  );
}
