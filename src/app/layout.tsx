import type { Metadata } from 'next';
import './globals.css';
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
  const NAV_ITEMS = [
    { label: '施設一覧', sub: 'Court', href: '/facilities' },
    { label: 'ギア・用具', sub: 'Gear', href: '/gear' },
    { label: '選手名鑑', sub: 'Player', href: '/players' },
    { label: '記事', sub: 'News', href: '/articles' },
    { label: 'イベント', sub: 'Event', href: '/events' },
    { label: '練習メニュー', sub: 'Drill', href: '/drills' },
    { label: 'コミュニティ', sub: 'Forum', href: '/community' },
  ];

  return (
    <html lang="ja">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;700&display=swap"
        />
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          {/* ======== 3段構成ヘッダー（マレーシア生活情報局テンプレート） ======== */}
          <header className="bg-white sticky top-0 z-50" style={{ fontFamily: "'Noto Serif JP', 'Inter', serif" }}>

            {/* 第1段: ユーティリティバー */}
            <div className="border-b border-gray-100">
              <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
                <div className="flex justify-between items-center h-10">
                  {/* モバイル向けハンバーガー（簡易版: CSS only） */}
                  <div className="lg:hidden">
                    <Link href="/community" className="text-gray-500 hover:text-brand-dark transition-colors">
                      <span className="material-symbols-outlined text-[22px]">menu</span>
                    </Link>
                  </div>
                  {/* デスクトップ: 右寄せユーティリティ */}
                  <div className="hidden lg:flex items-center gap-6 text-xs tracking-wider text-gray-500 ml-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Link href="/advertise" className="hover:text-brand-dark transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">campaign</span> 広告掲載
                    </Link>
                    <div className="h-3 w-px bg-gray-300" />
                    <Link href="/login" className="hover:text-brand-dark transition-colors">ログイン / 登録</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 第2段: ブランドロゴ */}
            <div className="text-center py-4 md:py-5">
              <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col items-center">
                <Link href="/">
                  <h1 className="font-medium tracking-[0.15em] md:tracking-[0.2em] text-gray-900 mb-1 text-2xl md:text-5xl">
                    I LOVE PICKLEBALL
                  </h1>
                </Link>
                <p className="text-gray-400 tracking-[0.25em] uppercase text-[10px] md:text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Japan&apos;s Premier Pickleball Media
                </p>
              </div>
            </div>

            {/* 第3段: ナビゲーション（デスクトップのみ） */}
            <div className="border-t border-b border-gray-100 bg-white/95 backdrop-blur-sm hidden lg:block">
              <div className="max-w-4xl mx-auto px-6">
                <nav className="flex justify-center">
                  <ul className="flex items-center gap-4 sm:gap-8 md:gap-12 h-14 md:h-14 whitespace-nowrap">
                    {NAV_ITEMS.map((item) => (
                      <li key={item.href}>
                        <Link
                          className="text-sm text-gray-600 hover:text-brand-dark transition-colors font-medium tracking-[0.1em] text-center block"
                          href={item.href}
                        >
                          {item.label}
                          <span className="text-[10px] text-gray-400 block mt-0.5 font-normal tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {item.sub}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-grow">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-12 mt-20">
            <div className="site-container px-4">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 border-b border-gray-700 pb-8 mb-8">
                <div>
                  <h3 className="font-medium text-xl tracking-widest mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>I LOVE PICKLEBALL</h3>
                  <p className="text-sm text-gray-400 max-w-sm">日本最大級のピックルボール総合情報メディア。初心者向けのルールから全国のコート情報まで。</p>
                </div>
                <div className="flex gap-12 text-sm text-gray-300">
                  <div className="flex flex-col gap-3">
                    <Link href="/facilities" className="hover:text-white transition-colors">施設・コート</Link>
                    <Link href="/gear" className="hover:text-white transition-colors">ギア・用具</Link>
                    <Link href="/players" className="hover:text-white transition-colors">選手名鑑</Link>
                    <Link href="/articles" className="hover:text-white transition-colors">記事・ニュース</Link>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link href="/events" className="hover:text-white transition-colors">大会・イベント</Link>
                    <Link href="/drills" className="hover:text-white transition-colors">練習メニュー</Link>
                    <Link href="/community" className="hover:text-white transition-colors">コミュニティ</Link>
                    <Link href="/advertise" className="hover:text-white transition-colors">広告掲載</Link>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">&copy; 2026 I LOVE PICKLEBALL. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
