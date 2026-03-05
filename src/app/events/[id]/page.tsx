import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: { id: string } }) {
    const event = await prisma.event.findUnique({ where: { id: params.id } })
    if (!event) return { title: 'イベントが見つかりません' }
    return {
        title: `${event.title} | I LOVE PICKLEBALL`,
        description: event.description?.substring(0, 100) || 'イベント詳細',
    }
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
    const event = await prisma.event.findUnique({
        where: { id: params.id },
        include: {
            organizer: {
                select: { id: true, nickname: true, profileImageUrl: true }
            },
            participants: true
        }
    })

    if (!event) notFound()

    // 既に終わったイベントかどうか
    const isPastEvent = event.date < new Date()

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* ヒーロー画像 */}
            <div className="w-full h-64 md:h-96 relative bg-gray-200">
                {event.imageUrl ? (
                    <Image src={event.imageUrl} alt={event.title} fill sizes="100vw" className="object-cover" priority />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-bold">EVENT IMAGE</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
                    <div className="container mx-auto max-w-4xl">
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-brand-accent text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                                {event.date.toLocaleDateString('ja-JP')} 開催
                            </span>
                            {isPastEvent && (
                                <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                                    終了しました
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight">
                            {event.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-4xl px-4 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* メインコンテンツ */}
                    <div className="md:col-span-2 space-y-8">
                        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold border-b-2 border-brand-accent pb-2 mb-6 text-brand-dark inline-block">
                                イベント概要
                            </h2>
                            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {event.description || '概要の記載がありません。'}
                            </div>
                        </section>
                    </div>

                    {/* サイドバー（詳細情報・申し込み） */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">詳細情報</h3>

                            <dl className="space-y-4 text-sm">
                                <div>
                                    <dt className="text-gray-500 mb-1 flex items-center gap-1">📍 開催場所</dt>
                                    <dd className="font-medium">{event.location || '未定'}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 mb-1 flex items-center gap-1">📅 開催日時</dt>
                                    <dd className="font-medium">
                                        {event.date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 mb-1 flex items-center gap-1">💴 参加費</dt>
                                    <dd className="font-medium text-brand-dark">
                                        {event.fee ? `¥${event.fee.toLocaleString()}` : '無料'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 mb-1 flex items-center gap-1">👥 定員</dt>
                                    <dd className="font-medium">
                                        {event.participants.length} 人 / {event.maxCapacity ? `${event.maxCapacity} 人` : '無制限'}
                                    </dd>
                                </div>
                            </dl>

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative flex-shrink-0">
                                        {event.organizer.profileImageUrl ? (
                                            <Image src={event.organizer.profileImageUrl} alt="Organizer" fill sizes="40px" className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Org</div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">運営・主催</div>
                                        <div className="font-bold text-gray-900">{event.organizer.nickname || '運営事務局'}</div>
                                    </div>
                                </div>

                                {event.externalLink ? (
                                    <a href={event.externalLink} target="_blank" rel="noopener noreferrer" className="w-full bg-brand-accent hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                                        参加予約ページへ進む <span className="material-symbols-outlined text-sm">open_in_new</span>
                                    </a>
                                ) : (
                                    <button disabled className="w-full bg-gray-200 text-gray-500 font-bold py-3 px-4 rounded-xl cursor-not-allowed text-center">
                                        詳細はお問い合わせください
                                    </button>
                                )}
                            </div>
                        </div>

                        <Link href="/events" className="block text-center text-sm text-gray-500 hover:text-brand-accent transition-colors">
                            &larr; イベント一覧へ戻る
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
