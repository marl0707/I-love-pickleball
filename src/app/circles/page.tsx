import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Users, MapPin, Zap, Heart } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "サークル・クラブ一覧 | I LOVE PICKLEBALL",
    description: "全国のピックルボールサークル・クラブ情報を検索。初心者歓迎のサークルから競技志向のクラブまで、あなたにぴったりの仲間を見つけよう。",
};

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CirclesPage({ searchParams }: PageProps) {
    const queryParams = await searchParams;

    const where: any = {};

    // テキスト検索
    if (queryParams.q) {
        const q = String(queryParams.q).toLowerCase();
        where.OR = [
            { name: { contains: q, mode: "insensitive" } },
            { locationText: { contains: q, mode: "insensitive" } },
        ];
    }

    // エリアフィルター
    if (queryParams.area) {
        where.targetArea = String(queryParams.area);
    }

    // プレイスタイルフィルター
    if (queryParams.style) {
        where.playStyle = String(queryParams.style);
    }

    // 初心者歓迎フィルター
    if (queryParams.beginner === "true") {
        where.beginnerFriendly = true;
    }

    const communities = await prisma.community.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });

    // フィルターオプション用のデータ
    const allCommunities = await prisma.community.findMany({
        select: { targetArea: true, playStyle: true },
    });
    const areas = Array.from(new Set(allCommunities.map(c => c.targetArea).filter(Boolean))) as string[];
    const styles = Array.from(new Set(allCommunities.map(c => c.playStyle).filter(Boolean))) as string[];

    return (
        <div className="bg-white text-gray-900 font-sans">
            {/* ヒーロー */}
            <section className="relative h-[300px] md:h-[400px] overflow-hidden">
                <div className="absolute inset-0 bg-brand-dark flex items-center justify-center">
                    <div className="text-white opacity-10 text-9xl font-bold italic tracking-tighter">CIRCLES</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end items-center pb-12 text-center">
                    <p className="text-brand-accent text-xs tracking-[0.3em] uppercase mb-3 font-semibold font-sans">CIRCLES & CLUBS</p>
                    <h1 className="text-4xl md:text-5xl text-white tracking-widest font-bold">サークル・クラブ</h1>
                    <p className="text-white/70 text-sm mt-4 max-w-xl font-sans">
                        ピックルボール仲間を見つけよう。初心者歓迎から競技志向まで。
                    </p>
                </div>
            </section>

            {/* 検索・フィルター */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <form method="GET" className="bg-gray-50 border border-gray-100 p-6 md:p-8">
                    <h2 className="text-center text-xs tracking-[0.3em] uppercase text-gray-500 mb-6 font-semibold font-sans">SEARCH & FILTER</h2>
                    <div className="max-w-4xl mx-auto space-y-4">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                name="q"
                                defaultValue={queryParams.q as string || ""}
                                placeholder="サークル名・活動場所で検索..."
                                className="flex-1 border border-gray-200 bg-white text-sm py-3 px-4 rounded-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition"
                            />
                            <button type="submit" className="bg-brand-accent text-white text-xs tracking-[0.2em] uppercase px-8 py-3 hover:bg-brand-accent/80 transition-colors font-sans">
                                検索
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {/* エリアフィルター */}
                            <select
                                name="area"
                                defaultValue={queryParams.area as string || ""}
                                className="border border-gray-200 bg-white text-sm py-2 px-3 rounded-sm text-gray-600 focus:border-brand-accent"
                            >
                                <option value="">全エリア</option>
                                {areas.map(area => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>

                            {/* プレイスタイルフィルター */}
                            <select
                                name="style"
                                defaultValue={queryParams.style as string || ""}
                                className="border border-gray-200 bg-white text-sm py-2 px-3 rounded-sm text-gray-600 focus:border-brand-accent"
                            >
                                <option value="">全スタイル</option>
                                {styles.map(style => (
                                    <option key={style} value={style}>{style}</option>
                                ))}
                            </select>

                            {/* 初心者歓迎フィルター */}
                            <label className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 bg-white py-2 px-3 rounded-sm cursor-pointer hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    name="beginner"
                                    value="true"
                                    defaultChecked={queryParams.beginner === "true"}
                                    className="accent-brand-accent"
                                />
                                初心者歓迎のみ
                            </label>
                        </div>
                    </div>
                </form>
            </section>

            {/* メインコンテンツ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">サークル・クラブ一覧</h2>
                    <span className="text-xs text-gray-400 font-sans">{communities.length}件</span>
                </div>

                {communities.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-lg">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-bold mb-2">まだ登録されたサークルがありません</p>
                        <p className="text-sm">サークル・クラブ情報は順次追加されます。</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {communities.map((circle) => (
                            <Link key={circle.id} href={`/circles/${circle.id}`} className="group">
                                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-brand-accent/30 transition-all duration-300">
                                    {/* サークル画像 */}
                                    <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-brand-accent/10 to-brand-accent/5 relative">
                                        {circle.mainPhotoUrl ? (
                                            <img
                                                src={circle.mainPhotoUrl}
                                                alt={circle.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Users className="w-16 h-16 text-brand-accent/20" />
                                            </div>
                                        )}

                                        {/* バッジ */}
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            {circle.beginnerFriendly && (
                                                <span className="bg-green-500 text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded flex items-center gap-1">
                                                    <Heart className="w-3 h-3" />
                                                    初心者歓迎
                                                </span>
                                            )}
                                            {circle.playStyle && (
                                                <span className="bg-white/90 text-brand-dark text-[10px] font-bold tracking-wider px-2 py-1 rounded">
                                                    {circle.playStyle}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* 情報 */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-brand-accent transition-colors mb-2 line-clamp-2">
                                            {circle.name}
                                        </h3>

                                        {circle.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">{circle.description}</p>
                                        )}

                                        <div className="space-y-2 text-xs text-gray-500">
                                            {circle.locationText && (
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                                                    <span>{circle.locationText}</span>
                                                </div>
                                            )}
                                            {circle.activityFrequency && (
                                                <div className="flex items-center gap-1.5">
                                                    <Zap className="w-3.5 h-3.5 text-brand-accent" />
                                                    <span>{circle.activityFrequency}</span>
                                                </div>
                                            )}
                                            {circle.targetArea && (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">{circle.targetArea}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
