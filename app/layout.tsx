import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_CAMPAIGN_NAME ?? '光回線「まるっと10ヶ月」無料キャンペーン',
  description: '光回線の無料キャンペーンへのお申込みはこちら',
  robots: 'noindex, nofollow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-white text-gray-800 antialiased">{children}</body>
    </html>
  );
}
