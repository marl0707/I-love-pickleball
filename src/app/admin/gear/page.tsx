import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const metadata = {
    title: 'ギア管理 | Management Console',
}

export default async function AdminGearPage() {
    // パドル情報の取得（今回はGearPaddleを主な対象とする）
    const paddles = await prisma.gearPaddle.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">ギア・用具管理</h1>
                    <p className="text-gray-500 mt-1">パドルやシューズなど、ピックルボール用具の情報を管理・編集します。</p>
                </div>
                <Link
                    href="#"
                    className="bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 cursor-not-allowed opacity-70"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    新規作成 (準備中)
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                                <th className="p-4 font-semibold">画像</th>
                                <th className="p-4 font-semibold">製品名</th>
                                <th className="p-4 font-semibold">ブランド</th>
                                <th className="p-4 font-semibold">価格 (円)</th>
                                <th className="p-4 font-semibold">レベル</th>
                                <th className="p-4 font-semibold text-right">アクション</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {paddles.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        ギアデータがありません
                                    </td>
                                </tr>
                            ) : (
                                paddles.map(paddle => (
                                    <tr key={paddle.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            {paddle.imageUrl ? (
                                                <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden">
                                                    <img src={paddle.imageUrl} alt={paddle.productName} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <span className="material-symbols-outlined text-lg">image</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900 line-clamp-1">{paddle.productName}</div>
                                            {(paddle.amazonUrl || paddle.rakutenUrl || paddle.yahooUrl) && (
                                                <div className="text-xs text-brand-accent mt-1 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">link</span>
                                                    アフィリエイト設定あり
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">
                                                {paddle.brandName}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-900 font-bold">
                                            {paddle.price ? `¥${paddle.price.toLocaleString()}` : '-'}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {paddle.targetDemographic || '-'}
                                        </td>
                                        <td className="p-4 text-right flex items-center justify-end gap-2 mt-2">
                                            <Link href={`/gear/${paddle.id}`} target="_blank" className="text-gray-400 hover:text-brand-accent transition-colors" title="ページを確認">
                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                            </Link>
                                            <span className="text-gray-300 cursor-not-allowed opacity-50" title="編集 (準備中)">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </span>
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
