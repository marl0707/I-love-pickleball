import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: '広告・入札管理 | Management Console',
}

export default async function AdminAdsPage() {
    const bids = await prisma.adBid.findMany({
        orderBy: { createdAt: 'desc' },
        include: { bidderUser: { select: { email: true, nickname: true } } }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">広告枠・入札管理</h1>
                    <p className="text-gray-500 mt-1">Stripe決済を経由して入札された広告枠の一覧とステータスを管理します。</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                                <th className="p-4 font-semibold">広告主</th>
                                <th className="p-4 font-semibold">カテゴリ</th>
                                <th className="p-4 font-semibold text-right">入札額 (月額)</th>
                                <th className="p-4 font-semibold">ステータス</th>
                                <th className="p-4 font-semibold">遷移先URL</th>
                                <th className="p-4 font-semibold text-right">アクション</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {bids.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        入札データがありません
                                    </td>
                                </tr>
                            ) : (
                                bids.map(bid => (
                                    <tr key={bid.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{bid.advertiserName}</div>
                                            <div className="text-xs text-gray-500">{bid.bidderUser.nickname || bid.bidderUser.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">
                                                {bid.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-bold text-brand-dark">
                                            ¥{bid.bidAmount.toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${bid.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                bid.status === 'CANCELED' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {bid.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <a href={bid.targetUrl} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline flex items-center gap-1 max-w-[200px] truncate block">
                                                <span className="material-symbols-outlined text-[14px]">link</span>
                                                {bid.targetUrl}
                                            </a>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-sm font-medium text-brand-accent hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded transition-colors">
                                                編集 / 承認
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
