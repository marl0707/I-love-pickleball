import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const metadata = {
    title: 'コート・施設管理 | Management Console',
}

export default async function AdminFacilitiesPage() {
    const facilities = await prisma.facility.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">コート・施設管理</h1>
                    <p className="text-gray-500 mt-1">全国のピックルボールコート・ショップ情報を管理・編集します。</p>
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
                                <th className="p-4 font-semibold">施設名</th>
                                <th className="p-4 font-semibold">住所 (都道府県)</th>
                                <th className="p-4 font-semibold">種別</th>
                                <th className="p-4 font-semibold">いいね数</th>
                                <th className="p-4 font-semibold text-right">アクション</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {facilities.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        施設データがありません
                                    </td>
                                </tr>
                            ) : (
                                facilities.map(facility => (
                                    <tr key={facility.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            {facility.mainPhotoUrl ? (
                                                <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden">
                                                    <img src={facility.mainPhotoUrl} alt={facility.name} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <span className="material-symbols-outlined text-lg">image</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900 line-clamp-1">{facility.name}</div>
                                            <div className="text-xs text-brand-accent mt-1 flex items-center gap-1">
                                                {facility.courtsCount && <span>コート: {facility.courtsCount}面</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            <div className="line-clamp-1">{facility.address || '未設定'}</div>
                                            <div className="text-xs text-gray-400 mt-1">{facility.prefecture || '未設定'}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${facility.typeFlag === 1 ? 'bg-blue-50 text-blue-700' :
                                                facility.typeFlag === 2 ? 'bg-orange-50 text-orange-700' :
                                                    'bg-purple-50 text-purple-700'
                                                }`}>
                                                {facility.typeFlag === 1 ? 'コート' : facility.typeFlag === 2 ? 'ショップ' : 'コート・ショップ'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600 font-bold">
                                            {facility.likeCount}
                                        </td>
                                        <td className="p-4 text-right flex items-center justify-end gap-2 mt-2">
                                            <Link href={`/facilities/${facility.id}`} target="_blank" className="text-gray-400 hover:text-brand-accent transition-colors" title="ページを確認">
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
