import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: { id: string } }) {
    const drill = await prisma.drill.findUnique({ where: { id: params.id } })
    if (!drill) return { title: 'ドリルが見つかりません' }
    return {
        title: `${drill.title} | 練習メニュー | I LOVE PICKLEBALL`,
        description: drill.description?.substring(0, 100) || 'ピックルボールの練習メニュー詳細',
    }
}

export default async function DrillDetailPage({ params }: { params: { id: string } }) {
    const drill = await prisma.drill.findUnique({
        where: { id: params.id },
        include: {
            bookmarks: true
        }
    })

    if (!drill) notFound()

    // 難易度の表示カラー判定
    let difficultyClass = 'bg-gray-100 text-gray-600'
    let difficultyJa = '未設定'
    if (drill.difficulty === 'Beginner') {
        difficultyClass = 'bg-green-100 text-green-700'
        difficultyJa = '初心者向け'
    } else if (drill.difficulty === 'Intermediate') {
        difficultyClass = 'bg-yellow-100 text-yellow-700'
        difficultyJa = '中級者向け'
    } else if (drill.difficulty === 'Advanced') {
        difficultyClass = 'bg-red-100 text-red-700'
        difficultyJa = '上級者向け'
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="container mx-auto px-4 max-w-4xl py-8 md:py-12">
                {/* パンくずリスト */}
                <nav className="text-sm text-gray-500 mb-6 flex gap-2">
                    <Link href="/" className="hover:text-brand-accent transition-colors">トップ</Link>
                    <span>&gt;</span>
                    <Link href="/drills" className="hover:text-brand-accent transition-colors">練習メニュー</Link>
                    <span>&gt;</span>
                    <span className="text-gray-800 truncate">{drill.title}</span>
                </nav>

                {/* ヘッダーエリア */}
                <div className="mb-8 md:mb-12 text-center max-w-3xl mx-auto">
                    <div className="flex justify-center flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${difficultyClass}`}>
                            {difficultyJa}
                        </span>
                        {drill.minPlayers && (
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                                推奨人数: {drill.minPlayers}人〜
                            </span>
                        )}
                        {drill.durationMin && (
                            <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold border border-purple-100">
                                目安時間: 約{drill.durationMin}分
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-brand-dark leading-tight mb-6">
                        {drill.title}
                    </h1>

                    <button className="flex items-center justify-center gap-2 mx-auto text-sm text-gray-500 hover:text-brand-accent transition-colors border border-gray-200 rounded-lg px-4 py-2 shadow-sm font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                        ブックマークに追加（{drill.bookmarks.length}人が登録）
                    </button>
                </div>

                {/* メディアエリア */}
                {(drill.videoUrl || drill.imageUrl) ? (
                    <div className="w-full aspect-video relative bg-black rounded-2xl overflow-hidden shadow-lg mb-12">
                        {drill.videoUrl ? (
                            // TODO: 実際のYouTube Embedコンポーネント等に置き換え検討
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
                                <svg className="w-16 h-16 text-red-500 mb-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                                <div className="text-xl font-bold mb-2">解説ビデオが登録されています</div>
                                <a href={drill.videoUrl} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">
                                    {drill.videoUrl}
                                </a>
                            </div>
                        ) : (
                            drill.imageUrl && <Image src={drill.imageUrl} alt={drill.title} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" priority />
                        )}
                    </div>
                ) : null}

                {/* 本文エリア */}
                <div className="bg-gray-50 p-6 md:p-10 rounded-2xl border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 text-brand-dark flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-brand-accent rounded-full inline-block"></span>
                        練習の手順とポイント
                    </h2>
                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                        {drill.description}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/drills" className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:text-brand-accent hover:border-brand-accent font-bold py-3 px-8 rounded-xl transition-colors shadow-sm">
                        &larr; 練習メニュー一覧へ
                    </Link>
                </div>
            </div>
        </div>
    )
}
