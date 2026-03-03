import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const metadata = {
    title: 'サークル・クラブ管理 | Management Console',
}

export default async function AdminCirclesPage() {
    const communities = await prisma.community.findMany({
        orderBy: { createdAt: 'desc' }
    })

    const mediaCount = await prisma.mediaItem.count()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">サークル・クラブ管理</h1>
                    <p className="text-gray-500 mt-1">登録されたサークル・クラブの情報を管理します。メディア総数: {mediaCount}件</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                                <th className="p-4 font-semibold">画像</th>
                                <th className="p-4 font-semibold">サークル名</th>
                                <th className="p-4 font-semibold">エリア</th>
                                <th className="p-4 font-semibold">スタイル</th>
                                <th className="p-4 font-semibold">初心者</th>
                                <th className="p-4 font-semibold">活動頻度</th>
                                <th className="p-4 font-semibold text-right">アクション</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {communities.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        サークルデータがありません
                                    </td>
                                </tr>
                            ) : (
                                communities.map(circle => (
                                    <tr key={circle.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            {circle.mainPhotoUrl ? (
                                                <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden">
                                                    <img src={circle.mainPhotoUrl} alt={circle.name} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <span className="material-symbols-outlined text-lg">groups</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900 line-clamp-1">{circle.name}</div>
                                            {circle.locationText && (
                                                <div className="text-xs text-gray-400 mt-1">{circle.locationText}</div>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {circle.targetArea ? (
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">{circle.targetArea}</span>
                                            ) : (
                                                <span className="text-gray-400">未設定</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {circle.playStyle ? (
                                                <span className="bg-brand-accent/10 text-brand-accent px-2 py-1 rounded text-xs font-bold">{circle.playStyle}</span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">未設定</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {circle.beginnerFriendly ? (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">歓迎</span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-600 text-xs">
                                            {circle.activityFrequency || '-'}
                                        </td>
                                        <td className="p-4 text-right flex items-center justify-end gap-2 mt-2">
                                            <Link href={`/circles/${circle.id}`} target="_blank" className="text-gray-400 hover:text-brand-accent transition-colors" title="ページを確認">
                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                            </Link>
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
