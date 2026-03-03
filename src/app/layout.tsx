import type { Metadata } from 'next';
import './globals.css';
import AuthButton from '@/components/AuthButton';
import Link from 'next/link';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: 'I LOVE PICKLEBALL | ピックルボール総合情報メディア',
    template: '%s | I LOVE PICKLEBALL'
  },
  description: '日本最大級のピックルボール総合情報メディア。初心者向けのルールや用具（パドル）の選び方、全国のコート情報、大会情報など、最新トレンドをお届けします。',
  keywords: ['ピックルボール', 'Pickleball', 'パドル', 'コート', 'ルール'],
  openGraph: {
    title: 'I LOVE PICKLEBALL | ピックルボール総合情報メディア',
    description: '日本最大級のピックルボール総合情報メディア。初心者向けのルールやコート情報をお届けします。',
    url: '/',
    siteName: 'I LOVE PICKLEBALL',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'I LOVE PICKLEBALL',
    description: '日本最大級のピックルボール総合情報メディア',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body>
        <div className="min-h-screen flex flex-col pt-[72px]">
          {/* Header */}
          <header className="fixed top-0 left-0 w-full h-[72px] bg-brand-dark text-white z-50 shadow-md">
            <div className="site-container h-full flex justify-between items-center px-4">
              <Link href="/" className="font-display font-bold text-xl md:text-2xl tracking-wider text-brand-accent">
                I LOVE PICKLEBALL
              </Link>

              <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
                <Link href="/facilities" className="hover:text-brand-accent transition-colors">施設一覧</Link>
                <Link href="/gear" className="hover:text-brand-accent transition-colors">ギア</Link>
                <Link href="/events" className="hover:text-brand-accent transition-colors">イベント</Link>
                <Link href="/drills" className="hover:text-brand-accent transition-colors">練習メニュー</Link>
                <Link href="/community" className="hover:text-brand-accent transition-colors">コミュニティ</Link>
              </nav>

              <AuthButton />
            </div>
          </header>

          <main className="flex-grow">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-brand-dark text-white py-12 mt-20">
            <div className="site-container px-4">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 border-b border-gray-700 pb-8 mb-8">
                <div>
                  <h3 className="font-display font-bold text-xl text-brand-accent tracking-widest mb-4">I LOVE PICKLEBALL</h3>
                  <p className="text-sm text-gray-400 max-w-sm">日本最大級のピックルボール総合情報メディア。初心者向けのルールから全国のコート情報まで。</p>
                </div>
                <div className="flex gap-12 text-sm text-gray-300">
                  <div className="flex flex-col gap-3">
                    <Link href="/facilities" className="hover:text-brand-accent transition-colors">施設・コート</Link>
                    <Link href="/gear" className="hover:text-brand-accent transition-colors">ギア・用具</Link>
                    <Link href="/players" className="hover:text-brand-accent transition-colors">選手名鑑</Link>
                    <Link href="/articles" className="hover:text-brand-accent transition-colors">記事・ニュース</Link>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link href="/events" className="hover:text-brand-accent transition-colors">大会・イベント</Link>
                    <Link href="/drills" className="hover:text-brand-accent transition-colors">練習メニュー</Link>
                    <Link href="/community" className="hover:text-brand-accent transition-colors">コミュニティ</Link>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-brand-sub opacity-80">&copy; 2026 I LOVE PICKLEBALL. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
