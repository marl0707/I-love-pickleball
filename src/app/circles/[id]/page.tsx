import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { MapPin, Zap, Calendar, ExternalLink, Heart, Users, Play } from "lucide-react";

export const revalidate = 3600;

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const community = await prisma.community.findUnique({ where: { id } });

    if (!community) return { title: "Not Found" };

    return {
        title: `${community.name} | サークル・クラブ情報`,
        description: community.description
            ? community.description.slice(0, 160)
            : `${community.name}の活動情報、スケジュール、メンバー募集情報をご確認いただけます。`,
    };
}

export default async function CircleDetailPage({ params }: PageProps) {
    const { id } = await params;

    const community = await prisma.community.findUnique({
        where: { id },
    });

    if (!community) {
        notFound();
    }

    // 関連メディアを取得
    const mediaItems = await prisma.mediaItem.findMany({
        where: {
            targetType: "community",
            targetId: id,
        },
        orderBy: { createdAt: "desc" },
    });

    const youtubeMedia = mediaItems.filter(m => m.mediaType === "youtube");
    const imageMedia = mediaItems.filter(m => m.mediaType === "image");
    const instagramMedia = mediaItems.filter(m => m.mediaType === "instagram");

    // YouTubeのURLからIDを抽出するヘルパー
    function getYouTubeEmbedUrl(url: string): string | null {
        const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    }

    return (
        <div className="bg-white text-gray-900 font-sans">
            {/* ヒーロー */}
            <section className="relative h-[400px] md:h-[500px] bg-brand-dark flex flex-col justify-end">
                {community.mainPhotoUrl && (
                    <div className="absolute inset-0">
                        <Image
                            src={community.mainPhotoUrl}
                            alt={community.name}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover opacity-60 mix-blend-overlay"
                        />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
                    <div className="flex items-center gap-3 mb-4">
                        {community.beginnerFriendly && (
                            <span className="bg-green-500 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 flex items-center gap-1">
                                <Heart className="w-3 h-3" /> 初心者歓迎
                            </span>
                        )}
                        {community.playStyle && (
                            <span className="bg-brand-accent text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1">
                                {community.playStyle}
                            </span>
                        )}
                        {community.targetArea && (
                            <span className="bg-gray-800/80 text-white/80 text-[10px] font-bold tracking-widest uppercase px-3 py-1">
                                {community.targetArea}
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl text-white font-bold leading-tight mb-4">{community.name}</h1>
                    {community.locationText && (
                        <p className="text-white/80 flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4" />
                            {community.locationText}
                        </p>
                    )}
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 mt-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* メイン詳細 */}
                    <div className="flex-1 w-full lg:w-2/3 space-y-16">

                        {/* 紹介文 */}
                        {community.description && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">サークル紹介</h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{community.description}</p>
                            </section>
                        )}

                        {/* 活動情報 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">活動情報</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {community.activityFrequency && (
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex items-start gap-4">
                                        <div className="bg-brand-accent/10 p-3 rounded-lg">
                                            <Zap className="w-5 h-5 text-brand-accent" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">活動頻度</p>
                                            <p className="text-sm font-bold text-gray-800">{community.activityFrequency}</p>
                                        </div>
                                    </div>
                                )}

                                {community.scheduleText && (
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex items-start gap-4">
                                        <div className="bg-brand-accent/10 p-3 rounded-lg">
                                            <Calendar className="w-5 h-5 text-brand-accent" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">定期スケジュール</p>
                                            <p className="text-sm font-bold text-gray-800">{community.scheduleText}</p>
                                        </div>
                                    </div>
                                )}

                                {community.locationText && (
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex items-start gap-4">
                                        <div className="bg-brand-accent/10 p-3 rounded-lg">
                                            <MapPin className="w-5 h-5 text-brand-accent" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">活動場所</p>
                                            <p className="text-sm font-bold text-gray-800">{community.locationText}</p>
                                        </div>
                                    </div>
                                )}

                                {community.playStyle && (
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex items-start gap-4">
                                        <div className="bg-brand-accent/10 p-3 rounded-lg">
                                            <Users className="w-5 h-5 text-brand-accent" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">プレイスタイル</p>
                                            <p className="text-sm font-bold text-gray-800">{community.playStyle}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* YouTube動画 */}
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

                        {/* 画像ギャラリー */}
                        {imageMedia.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">フォトギャラリー</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {imageMedia.map(media => (
                                        <div key={media.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative">
                                            <Image
                                                src={media.url}
                                                alt="サークル活動の様子"
                                                fill
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                                className="object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Instagram埋め込み */}
                        {instagramMedia.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">Instagram</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {instagramMedia.map(media => (
                                        <a
                                            key={media.id}
                                            href={media.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-gray-100 p-4 rounded-xl hover:shadow-md transition-all group"
                                        >
                                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                                                <ExternalLink className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800 group-hover:text-brand-accent transition-colors">Instagramを見る</p>
                                                <p className="text-xs text-gray-400 truncate max-w-[250px]">{media.url}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </section>
                        )}

                        <div className="flex justify-center mt-8">
                            <Link href="/circles" className="text-brand-accent hover:underline text-sm font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                サークル一覧に戻る
                            </Link>
                        </div>
                    </div>

                    {/* サイドバー */}
                    <aside className="w-full lg:w-1/3 space-y-10">
                        {/* アクションボタン */}
                        <div className="bg-brand-dark p-6 rounded-2xl shadow-xl shadow-brand-dark/10 text-center">
                            <h3 className="text-white text-lg font-bold mb-4">このサークルに参加する</h3>
                            {community.externalUrl ? (
                                <a
                                    href={community.externalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-brand-accent text-white font-bold py-4 rounded-xl hover:bg-white hover:text-brand-dark transition-all duration-300 shadow-md flex items-center justify-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    公式ページを見る
                                </a>
                            ) : (
                                <button className="w-full bg-gray-600 text-white/60 font-bold py-4 rounded-xl cursor-not-allowed" disabled>
                                    リンク未登録
                                </button>
                            )}
                            <p className="text-white/50 text-xs mt-4">※ 外部リンクへ遷移します</p>
                        </div>

                        {/* サークルのスペック */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">サークル詳細</h3>
                            <dl className="space-y-4 text-sm">
                                {community.playStyle && (
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">スタイル</dt>
                                        <dd className="font-bold text-gray-800">{community.playStyle}</dd>
                                    </div>
                                )}
                                {community.activityFrequency && (
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">活動頻度</dt>
                                        <dd className="font-bold text-gray-800">{community.activityFrequency}</dd>
                                    </div>
                                )}
                                {community.targetArea && (
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">対象エリア</dt>
                                        <dd className="font-bold text-gray-800">{community.targetArea}</dd>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">初心者</dt>
                                    <dd className="font-bold text-gray-800">
                                        {community.beginnerFriendly ? (
                                            <span className="text-green-600 flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> 歓迎</span>
                                        ) : (
                                            <span className="text-gray-400">情報なし</span>
                                        )}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
