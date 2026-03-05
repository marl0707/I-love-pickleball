import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const metadata = {
    title: 'Management Console | I LOVE PICKLEBALL',
}

export default async function AdminDashboardPage() {
    // 統計情報の取得
    const [
        userCount,
        facilityCount,
        eventCount,
        gearCount,
        circleCount,
        recentBids
    ] = await Promise.all([
        prisma.user.count(),
        prisma.facility.count(),
        prisma.event.count(),
        prisma.gearPaddle.count(),
        prisma.community.count(),
        prisma.adBid.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { bidderUser: { select: { nickname: true, email: true } } }
        })
    ])

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">総括ダッシュボード</h1>
                <p className="text-gray-500">プラットフォームの全体状況と最新の広告入札を確認できます。</p>
            </div>

            {/* KPI カード */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined">group</span>
                    </div>
                    <div>
                        <div className="text-gray-500 text-sm font-medium">登録ユーザー</div>
                        <div className="text-2xl font-bold text-gray-900">{userCount}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined">sports_tennis</span>
                    </div>
                    <div>
                        <div className="text-gray-500 text-sm font-medium">登録施設</div>
                        <div className="text-2xl font-bold text-gray-900">{facilityCount}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined">event</span>
                    </div>
                    <div>
                        <div className="text-gray-500 text-sm font-medium">イベント</div>
                        <div className="text-2xl font-bold text-gray-900">{eventCount}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined">shopping_bag</span>
                    </div>
                    <div>
                        <div className="text-gray-500 text-sm font-medium">ギア (パドル)</div>
                        <div className="text-2xl font-bold text-gray-900">{gearCount}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined">groups</span>
                    </div>
                    <div>
                        <div className="text-gray-500 text-sm font-medium">サークル</div>
                        <div className="text-2xl font-bold text-gray-900">{circleCount}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 最新の入札状況 */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-bold text-gray-800">最新の広告入札 (Bids)</h2>
                        <span className="text-sm text-gray-400 cursor-not-allowed" title="広告機能は準備中です">すべて見る</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentBids.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">最近の入札はありません</div>
                        ) : (
                            recentBids.map(bid => (
                                <div key={bid.id} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-200 rounded object-cover overflow-hidden flex-shrink-0">
                                            {bid.imageUrl ? (
                                                <img src={bid.imageUrl} alt="AD" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-gray-400 m-2">image</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{bid.advertiserName}</div>
                                            <div className="text-xs text-gray-500">
                                                By {bid.bidderUser.nickname || bid.bidderUser.email} / Category: {bid.category}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-brand-dark">¥{bid.bidAmount.toLocaleString()}</div>
                                        <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${bid.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {bid.status}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* クイックアクション */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-bold text-gray-800 mb-4">クイックアクション</h2>
                    <div className="space-y-3">
                        <Link href="#" className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-lg text-sm font-medium transition-colors border border-gray-100 cursor-not-allowed">
                            + 新しいイベントを作成（準備中）
                        </Link>
                        <Link href="#" className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-lg text-sm font-medium transition-colors border border-gray-100 cursor-not-allowed">
                            + 新しい記事を執筆（準備中）
                        </Link>
                        <Link href="#" className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-lg text-sm font-medium transition-colors border border-gray-100 cursor-not-allowed">
                            + 施設情報を登録（準備中）
                        </Link>
                        <Link href="#" className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-lg text-sm font-medium transition-colors border border-gray-100 cursor-not-allowed">
                            + 新しいサークルを登録（準備中）
                        </Link>
                    </div>
                </div>
            </div>
        </div >
    )
}
