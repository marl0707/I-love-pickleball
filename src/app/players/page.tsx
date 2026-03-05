import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import AdSlot from "@/components/AdSlot";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "ピックルボール プロ選手名鑑 | I LOVE PICKLEBALL",
    description: "国内外の様々なプロピックルボールプレーヤーの情報を掲載しています。",
};

function resolveImageUrl(url: string | null): string {
    if (!url) return '';
    return url;
}

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PlayersPage({ searchParams }: PageProps) {
    const queryParams = await searchParams;
    const page = parseInt(queryParams.page as string) || 1;
    const limitParams = 12;

    const where: any = {};
    if (queryParams.q) {
        const q = String(queryParams.q).toLowerCase();
        where.nameJa = { contains: q, mode: "insensitive" };
    }

    const [players, totalCount] = await Promise.all([
        prisma.proPlayer.findMany({
            where,
            orderBy: { rankingSingles: "asc" }, // ランキング順
            skip: (page - 1) * limitParams,
            take: limitParams,
        }),
        prisma.proPlayer.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limitParams);

    return (
        <div className="bg-white text-gray-900 font-sans">
            <section className="relative h-[300px] md:h-[400px] overflow-hidden">
                <div className="absolute inset-0 bg-brand-dark flex items-center justify-center">
                    <div className="text-white opacity-10 text-9xl font-bold italic tracking-tighter">PLAYERS</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end items-center pb-12 text-center">
                    <p className="text-brand-accent text-xs tracking-[0.3em] uppercase mb-3 font-semibold">PRO PLAYERS</p>
                    <h1 className="text-4xl md:text-5xl text-white tracking-widest font-bold">プロ選手名鑑</h1>
                    <p className="text-white/70 text-sm mt-4 max-w-xl">世界のトッププレーヤーの情報をチェック</p>
                </div>
            </section>

            <div className="bg-gray-50 py-4 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 flex justify-center">
                    <AdSlot slot="header-banner" />
                </div>
            </div>

            {/* 検索フォーム */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <form method="GET" className="bg-gray-50 border border-gray-100 p-6 md:p-8">
                    <h2 className="text-center text-xs tracking-[0.3em] uppercase text-gray-500 mb-6 font-semibold font-sans">SEARCH</h2>
                    <div className="max-w-2xl mx-auto flex gap-4">
                        <input
                            type="text"
                            name="q"
                            defaultValue={queryParams.q as string || ""}
                            placeholder="選手名で検索..."
                            className="flex-1 border border-gray-200 bg-white text-sm py-3 px-4 rounded-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition"
                        />
                        <button type="submit" className="bg-brand-accent text-white text-xs tracking-[0.2em] uppercase px-8 py-3 hover:bg-brand-accent/80 transition-colors font-sans">
                            検索
                        </button>
                    </div>
                </form>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="flex-1 w-full lg:w-3/4">
                        <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
                            <h2 className="text-2xl font-bold text-gray-800">選手一覧</h2>
                            <span className="text-xs text-gray-400">{totalCount}名の選手</span>
                        </div>

                        {players.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">条件に一致する選手が見つかりませんでした。</div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {players.map((player) => (
                                    <Link key={player.id} href={`/players/${player.id}`} className="block group transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-xl p-2 -m-2 hover:bg-gray-50/50">
                                        <div className="aspect-[3/4] overflow-hidden mb-3 bg-gradient-to-br from-brand-accent/10 to-brand-accent/5 relative">
                                            {player.photoUrl ? (
                                                <Image src={resolveImageUrl(player.photoUrl)} alt={player.nameJa} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                    No Photo
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-800 leading-relaxed group-hover:text-brand-accent transition-colors line-clamp-1">{player.nameJa}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{player.nationality || '国籍不明'}</p>
                                    </Link>
                                ))}
                            </div>
                        )}

                        <Pagination currentPage={page} totalPages={totalPages} basePath="/players" />
                    </div>

                    <aside className="w-full lg:w-1/4 space-y-12">
                        <AdSlot slot="sidebar-rectangle" />
                        <AdSlot slot="sidebar-rectangle" />
                    </aside>
                </div>
            </div>
        </div>
    );
}
