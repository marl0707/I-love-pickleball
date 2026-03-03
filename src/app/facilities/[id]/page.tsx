import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import AdSlot from "@/components/AdSlot";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import BookmarkButton from "@/components/BookmarkButton";
import { Play } from "lucide-react";

const FacilityMap = dynamic(() => import('@/components/FacilityMap'), {
    ssr: false,
    loading: () => <div className="w-full h-[300px] md:h-[400px] bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400 font-bold">地図を読み込み中...</div>
});

export const revalidate = 3600;

function resolveImageUrl(url: string | null): string {
    if (!url) return '';
    return url;
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const facility = await prisma.facility.findUnique({ where: { id } });

    if (!facility) return { title: "Not Found" };

    return {
        title: `${facility.name} | 全国ピックルボール施設ガイド`,
        description: `${facility.name}の施設情報、コート情報、営業時間などを掲載しています。`,
    };
}

export default async function FacilityDetailPage({ params }: PageProps) {
    const { id } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let isBookmarked = false;
    if (user) {
        const bookmark = await prisma.bookmark.findUnique({
            where: {
                userId_itemType_itemId: {
                    userId: user.id,
                    itemType: 'facility',
                    itemId: id,
                },
            },
        });
        isBookmarked = !!bookmark;
    }

    const facility = await prisma.facility.findUnique({
        where: { id },
        include: {
            courts: true,
            shops: true,
            reviews: {
                include: { user: true },
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    });

    // 施設に紐づくメディアを取得
    const mediaItems = await prisma.mediaItem.findMany({
        where: {
            targetType: "facility",
            targetId: id,
        },
        orderBy: { createdAt: "desc" },
    });

    const youtubeMedia = mediaItems.filter(m => m.mediaType === "youtube");
    const imageMedia = mediaItems.filter(m => m.mediaType === "image");

    function getYouTubeEmbedUrl(url: string): string | null {
        const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    }

    if (!facility) {
        notFound();
    }

    const amenities = [
        { label: "シャワー", available: facility.hasShower, icon: "shower" },
        { label: "ロッカールーム", available: facility.hasLockerRoom, icon: "checkroom" },
        { label: "カフェ・飲食", available: facility.hasCafe, icon: "local_cafe" },
        { label: "キッズスペース", available: facility.hasKidsSpace, icon: "child_friendly" },
        { label: "駐車場", available: facility.hasParking, icon: "local_parking" },
        { label: "Wi-Fi", available: facility.hasWifi, icon: "wifi" },
        { label: "大会開催", available: facility.hostsTournaments, icon: "emoji_events" },
    ];

    const typeLabels = ["", "コート・プレイ可能", "ショップのみ", "コート＆ショップ"];
    const typeLabel = typeLabels[facility.typeFlag] || "不明";

    return (
        <div className="bg-white text-gray-900 font-sans">
            {/* ヒーロー */}
            <section className="relative h-[400px] md:h-[500px] bg-brand-dark flex flex-col justify-end">
                {facility.mainPhotoUrl && (
                    <div className="absolute inset-0">
                        <img src={resolveImageUrl(facility.mainPhotoUrl)} alt={facility.name} className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-brand-accent text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1">
                            {typeLabel}
                        </span>
                        {facility.isPremium && (
                            <span className="bg-yellow-500 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">star</span> Premium
                            </span>
                        )}
                        <span className="bg-gray-800/80 text-white/80 text-[10px] font-bold tracking-widest uppercase px-3 py-1">
                            {facility.operatorType || '民間'}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl text-white font-bold leading-tight mb-4">{facility.name}</h1>
                    <p className="text-white/80 flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {facility.address || '住所情報なし'}
                    </p>
                </div>
            </section>

            {/* 広告バナー */}
            <div className="bg-gray-50 py-4 border-b border-gray-100 mb-12">
                <div className="max-w-7xl mx-auto px-4 flex justify-center">
                    <AdSlot slot="header-banner" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* メイン詳細 */}
                    <div className="flex-1 w-full lg:w-2/3 space-y-16">

                        {/* アクセスマップ */}
                        {(facility.lat && facility.lng) && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">アクセスマップ</h2>
                                <FacilityMap lat={facility.lat} lng={facility.lng} name={facility.name} />
                            </section>
                        )}

                        {/* 設備アイコン */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">ファシリティ・設備</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {amenities.map(item => (
                                    <div key={item.label} className={`flex flex-col items-center justify-center p-4 rounded-xl border ${item.available ? 'border-brand-accent/30 bg-brand-accent/5' : 'border-gray-100 bg-gray-50 opacity-50'}`}>
                                        <span className={`material-symbols-outlined mb-2 text-3xl ${item.available ? 'text-brand-accent' : 'text-gray-300'}`}>{item.icon}</span>
                                        <span className={`text-xs font-bold ${item.available ? 'text-brand-dark' : 'text-gray-400'}`}>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* コート情報 */}
                        {facility.courts.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">コート詳細</h2>
                                <div className="space-y-4">
                                    {facility.courts.map((court, i) => (
                                        <div key={court.id} className="bg-gray-50 p-6 rounded-lg border border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800 mb-1">コート構成 {i + 1}</h3>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="text-xs bg-white border border-gray-200 px-2 py-1 text-gray-600">{court.courtType || 'インドア/アウトドア不明'}</span>
                                                    <span className="text-xs bg-white border border-gray-200 px-2 py-1 text-gray-600">{court.surfaceType || 'サーフェス不明'}</span>
                                                    {court.hasAc && <span className="text-xs bg-blue-50 border border-blue-200 px-2 py-1 text-blue-600">空調あり</span>}
                                                </div>
                                            </div>
                                            <div className="text-center md:text-right shrink-0">
                                                <div className="text-3xl font-bold text-brand-dark">{court.numberOfCourts}<span className="text-sm text-gray-500 font-normal ml-1">面</span></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 営業時間テーブル */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">営業時間</h2>
                            <div className="responsive-table bg-white border text-sm border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full text-left">
                                    <tbody className="divide-y divide-gray-200">
                                        {[
                                            { d: '月曜日', t: facility.hoursMon },
                                            { d: '火曜日', t: facility.hoursTue },
                                            { d: '水曜日', t: facility.hoursWed },
                                            { d: '木曜日', t: facility.hoursThu },
                                            { d: '金曜日', t: facility.hoursFri },
                                            { d: '土曜日', t: facility.hoursSat },
                                            { d: '日/祝日', t: facility.hoursSun },
                                        ].map(row => (
                                            <tr key={row.d} className="hover:bg-gray-50 transition-colors">
                                                <th className="px-6 py-4 font-medium text-gray-600 w-1/3 bg-gray-50/50" data-label="曜日">{row.d}</th>
                                                <td className="px-6 py-4 text-gray-800 font-bold" data-label="営業時間">{row.t || '定休日 / 情報なし'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* メディア: YouTube動画 */}
                        {youtubeMedia.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6 flex items-center gap-2">
                                    <Play className="w-5 h-5 text-red-500" />
                                    関連動画
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {youtubeMedia.map(media => {
                                        const embedUrl = getYouTubeEmbedUrl(media.url);
                                        if (!embedUrl) return null;
                                        return (
                                            <div key={media.id} className="aspect-video rounded-xl overflow-hidden shadow-sm">
                                                <iframe
                                                    src={embedUrl}
                                                    title="YouTube動画"
                                                    className="w-full h-full"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* メディア: 画像ギャラリー */}
                        {imageMedia.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">フォトギャラリー</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {imageMedia.map(media => (
                                        <div key={media.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                                            <img
                                                src={media.url}
                                                alt="施設の様子"
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <div className="flex justify-center mt-8">
                            <Link href="/facilities" className="text-brand-accent hover:underline text-sm font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                施設一覧に戻る
                            </Link>
                        </div>
                    </div>

                    {/* サイドバー */}
                    <aside className="w-full lg:w-1/3 space-y-10">
                        {/* アクションボタン */}
                        <div className="bg-brand-dark p-6 rounded-2xl shadow-xl shadow-brand-dark/10 text-center">
                            <h3 className="text-white text-lg font-bold mb-4">この施設を利用する</h3>
                            <button className="w-full bg-brand-accent text-white font-bold py-4 rounded-xl hover:bg-white hover:text-brand-dark transition-all duration-300 shadow-md">
                                {facility.reservationMethod || '公式サイトを見る'}
                            </button>
                            <p className="text-white/50 text-xs mt-4">※ 外部リンクへ遷移します</p>

                            <div className="mt-6 border-t border-white/20 pt-6 flex justify-center">
                                <BookmarkButton
                                    itemType="facility"
                                    itemId={id}
                                    initialBookmarked={isBookmarked}
                                    isLoggedIn={!!user}
                                />
                            </div>
                        </div>

                        {/* 口コミ（ハイライト） */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">ピックアップ口コミ</h3>
                            {facility.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {facility.reviews.slice(0, 3).map(review => (
                                        <div key={review.id} className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-dark font-bold text-xs shrink-0 aspect-square overflow-hidden">
                                                    {review.user?.profileImageUrl ? (
                                                        <img src={review.user.profileImageUrl} alt="user" className="w-full h-full object-cover" />
                                                    ) : (
                                                        (review.user?.nickname || 'U').charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-gray-800">{review.user?.nickname || '匿名ユーザー'}</div>
                                                    <div className="text-[10px] text-gray-400">{review.createdAt.toLocaleDateString('ja-JP')}</div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed font-serif line-clamp-3">"{review.content}"</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 bg-gray-50 p-6 rounded-xl text-center">まだ口コミがありません</p>
                            )}
                        </div>

                        <AdSlot slot="sidebar-rectangle" />
                    </aside>
                </div>
            </div>
        </div>
    );
}

