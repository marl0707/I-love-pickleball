import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export const revalidate = 0 // 常に最新を表示するためにキャッシュ無効化

export const metadata: Metadata = {
    title: '保存済みのお気に入り施設 | I LOVE PICKLEBALL',
}

function resolveImageUrl(url: string | null): string {
    if (!url) return '/malaysia/images/placeholder_restaurant.png'
    return url
}

export default async function BookmarksPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // ユーザーのお気に入りを取得
    const bookmarks = await prisma.bookmark.findMany({
        where: {
            userId: user.id,
            itemType: 'facility' // ここでは施設のみ表示
        },
        orderBy: { createdAt: 'desc' }
    })

    const facilityIds = bookmarks.map((b: any) => b.itemId)

    let facilities: any[] = []
    if (facilityIds.length > 0) {
        const fetchedFacilities = await prisma.facility.findMany({
            where: { id: { in: facilityIds } },
        })

        // 保存日時順に並び替え（bookmarksの並びに合わせる）
        facilities = bookmarks.map((b: any) => fetchedFacilities.find(f => f.id === b.itemId)).filter(Boolean)
    }

    return (
        <div className="bg-white text-gray-900 font-sans min-h-screen">
            {/* ヒーロー */}
            <section className="relative py-16 bg-brand-dark flex flex-col justify-center items-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="relative z-10 text-center px-4">
                    <p className="text-brand-accent text-xs tracking-[0.3em] uppercase mb-3 font-semibold font-sans">MYPAGE</p>
                    <h1 className="text-3xl md:text-4xl text-white font-bold tracking-widest">保存済みのお気に入り施設</h1>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">施設一覧</h2>
                    <span className="text-xs text-gray-400 font-sans">{facilities.length}件の保存済み施設</span>
                </div>

                {facilities.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 mb-6">まだ保存された施設はありません。</p>
                        <Link href="/facilities" className="bg-brand-accent text-white px-6 py-3 font-bold rounded hover:bg-brand-accent/90 transition-colors">
                            施設を探す
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {facilities.map((facility) => (
                            <Link key={facility.id} href={`/facilities/${facility.id}`} className="group block bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="aspect-[4/3] bg-gradient-to-br from-brand-accent/10 to-brand-accent/5 relative overflow-hidden">
                                    {facility.mainPhotoUrl ? (
                                        <img src={resolveImageUrl(facility.mainPhotoUrl)} alt={facility.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                                    )}
                                    {facility.typeFlag === 1 && <span className="absolute top-3 left-3 text-[10px] font-semibold tracking-widest uppercase bg-white/90 text-brand-dark px-2 py-1">コート</span>}
                                    {facility.typeFlag === 2 && <span className="absolute top-3 left-3 text-[10px] font-semibold tracking-widest uppercase bg-white/90 text-brand-accent px-2 py-1">ショップ</span>}
                                    {facility.typeFlag === 3 && <span className="absolute top-3 left-3 text-[10px] font-semibold tracking-widest uppercase bg-white/90 text-brand-dark px-2 py-1">コート・ショップ</span>}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-bold text-gray-800 leading-relaxed group-hover:text-brand-accent transition-colors line-clamp-2">{facility.name}</h3>
                                    <p className="text-xs text-gray-500 mt-2 line-clamp-1">{facility.address || '住所情報なし'}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
