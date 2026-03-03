import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
    title: 'イベント・大会情報 | I LOVE PICKLEBALL',
    description: '全国で開催されるピックルボールのイベント、練習会、大会情報の一覧です。',
}

export default async function EventsPage() {
    const events = await prisma.event.findMany({
        orderBy: { date: 'asc' },
        include: {
            organizer: {
                select: { nickname: true, profileImageUrl: true }
            }
        }
    })

    // 開催前と開催済みで分ける
    const upcomingEvents = events.filter(e => e.date >= new Date())
    const pastEvents = events.filter(e => e.date < new Date())

    return (
        <div className="space-y-12 pb-12">
            {/* ヒーローセクション */}
            <section className="bg-brand-dark text-white py-16 px-4 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 font-heading">
                    イベント・大会情報
                </h1>
                <p className="text-gray-300 max-w-2xl mx-auto">
                    ピックルボール仲間に出会える！全国の交流会、練習会、トーナメント情報をチェックして、どんどんコートへ出かけましょう。
                </p>
            </section>

            <div className="container mx-auto px-4 max-w-6xl">
                <h2 className="text-2xl font-bold mb-6 border-b-2 border-brand-accent pb-2 inline-block">
                    直近のイベント
                </h2>

                {upcomingEvents.length === 0 ? (
                    <p className="text-gray-500">現在予定されているイベントはありません。</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingEvents.map((event) => (
                            <Link href={`/events/${event.id}`} key={event.id} className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                                    {event.imageUrl ? (
                                        <Image
                                            src={event.imageUrl}
                                            alt={event.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                    {/* 日付バッジ */}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-dark px-3 py-2 rounded-lg font-bold shadow-sm text-center min-w-[60px]">
                                        <div className="text-xs text-gray-500 uppercase">{event.date.toLocaleDateString('en-US', { month: 'short' })}</div>
                                        <div className="text-xl leading-none">{event.date.getDate()}</div>
                                    </div>
                                </div>

                                <div className="p-5 flex-grow flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-brand-accent/10 text-brand-accent px-2.5 py-1 rounded-md text-xs font-bold">
                                            {event.location || '場所未定'}
                                        </span>
                                        {event.fee ? (
                                            <span className="text-gray-500 text-sm font-medium">¥{event.fee.toLocaleString()}</span>
                                        ) : (
                                            <span className="text-green-600 text-sm font-medium">無料</span>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-lg mb-2 text-brand-dark line-clamp-2 group-hover:text-brand-accent transition-colors">
                                        {event.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
                                        {event.description}
                                    </p>

                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-auto">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                                            {event.organizer.profileImageUrl ? (
                                                <Image src={event.organizer.profileImageUrl} alt="Organizer" fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">Org</div>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <span className="block text-xs uppercase tracking-wider text-gray-400">主催</span>
                                            {event.organizer.nickname || '運営'}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* 過去のイベント */}
                {pastEvents.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-xl font-bold mb-6 text-gray-500">
                            過去のイベント
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-75">
                            {pastEvents.map((event) => (
                                <Link href={`/events/${event.id}`} key={event.id} className="group flex flex-col bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-4">
                                        <div className="text-sm text-gray-500 mb-1">{event.date.toLocaleDateString('ja-JP')}</div>
                                        <h3 className="font-bold text-gray-700 line-clamp-2 group-hover:text-brand-dark transition-colors">
                                            {event.title}
                                        </h3>
                                        <div className="mt-2 text-xs text-gray-400">{event.location}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
