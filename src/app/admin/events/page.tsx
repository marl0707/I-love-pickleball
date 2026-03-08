import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'イベント管理 | Management Console',
}

export default async function AdminEventsPage() {
    const events = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' },
        include: { organizer: { select: { nickname: true, email: true } } }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">イベント管理</h1>
                    <p className="text-gray-500 mt-1">ピックルボールのイベント一覧を管理・編集します。</p>
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
                                <th className="p-4 font-semibold">タイトル</th>
                                <th className="p-4 font-semibold">開催日時</th>
                                <th className="p-4 font-semibold">開催場所</th>
                                <th className="p-4 font-semibold">主催者</th>
                                <th className="p-4 font-semibold text-right">アクション</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        イベントがありません
                                    </td>
                                </tr>
                            ) : (
                                events.map(event => (
                                    <tr key={event.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900 line-clamp-1">{event.title}</div>
                                            {event.externalLink && (
                                                <div className="text-xs text-brand-accent mt-1 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">link</span>
                                                    外部リンクあり
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {event.date && !isNaN(new Date(event.date).getTime())
                                                ? format(new Date(event.date), 'yyyy/MM/dd HH:mm', { locale: ja })
                                                : '未設定'}
                                        </td>
                                        <td className="p-4 text-gray-600 line-clamp-1">
                                            {event.location}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {event.organizer.nickname || event.organizer.email}
                                        </td>

                                        <td className="p-4 text-right flex items-center justify-end gap-2">
                                            <Link href={`/events/${event.id}`} target="_blank" className="text-gray-400 hover:text-brand-accent transition-colors" title="ページを確認">
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
