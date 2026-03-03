import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
    title: '練習メニュー（ドリル） | I LOVE PICKLEBALL',
    description: 'ピックルボールの上達に欠かせない練習メニュー（ドリル）をレベル別にご紹介します。',
}

export default async function DrillsPage() {
    const drills = await prisma.drill.findMany({
        orderBy: { createdAt: 'desc' },
    })

    // 難易度別にグループ化するヘルパー
    const beginnerDrills = drills.filter(d => d.difficulty === 'Beginner')
    const intermediateDrills = drills.filter(d => d.difficulty === 'Intermediate')
    const advancedDrills = drills.filter(d => d.difficulty === 'Advanced')

    const DifficultySection = ({ title, drillsList, colorClass }: { title: string, drillsList: typeof drills, colorClass: string }) => {
        if (drillsList.length === 0) return null;
        return (
            <div className="mb-12">
                <h2 className={`text-2xl font-bold mb-6 border-l-4 ${colorClass} pl-3`}>
                    {title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {drillsList.map((drill) => (
                        <Link href={`/drills/${drill.id}`} key={drill.id} className="flex bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 group">
                            <div className="w-1/3 relative bg-gray-100 flex-shrink-0">
                                {drill.imageUrl ? (
                                    <Image src={drill.imageUrl} alt={drill.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                                {drill.videoUrl && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center pl-1">
                                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex-grow">
                                <div className="flex gap-2 mb-2 text-xs font-medium text-gray-500">
                                    {drill.minPlayers && (
                                        <span className="bg-gray-100 px-2 py-1 rounded">👥 {drill.minPlayers}人〜</span>
                                    )}
                                    {drill.durationMin && (
                                        <span className="bg-gray-100 px-2 py-1 rounded">⏱ {drill.durationMin}分</span>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg text-brand-dark mb-2 group-hover:text-brand-accent transition-colors line-clamp-2">
                                    {drill.title}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {drill.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12 pb-12">
            {/* ヒーローセクション */}
            <section className="bg-brand-dark text-white py-16 px-4 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 font-heading">
                    練習メニュー（ドリルの宝庫）
                </h1>
                <p className="text-gray-300 max-w-2xl mx-auto">
                    ピックルボールの上達には「ドリル（反復練習）」が一番の近道。初心者向けから上級者向けの戦術練習まで、日々の練習に取り入れたいメニューを集めました。
                </p>
            </section>

            <div className="container mx-auto px-4 max-w-5xl">
                <DifficultySection title="🔰 初心者向け（基礎固め）" drillsList={beginnerDrills} colorClass="border-green-500" />
                <DifficultySection title="🔥 中級者向け（戦術展開）" drillsList={intermediateDrills} colorClass="border-yellow-500" />
                <DifficultySection title="🏆 上級者向け（実践・競技）" drillsList={advancedDrills} colorClass="border-red-500" />

                {drills.length === 0 && (
                    <p className="text-center text-gray-500 py-10">現在登録されている練習メニューはありません。</p>
                )}
            </div>
        </div>
    )
}
