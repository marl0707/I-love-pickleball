import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import AdSlot from "@/components/AdSlot";
import SponsorBanner from "@/components/SponsorBanner";
import { prisma } from "@/lib/prisma";
import DefaultNoImage from "@/components/DefaultNoImage";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "全国ピックルボール施設・コートガイド | I LOVE PICKLEBALL",
    description: "日本全国のピックルボールコートやショップを備えた施設を検索できるガイドページです。",
};

function resolveImageUrl(url: string | null): string {
    if (!url) return 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image';
    return url;
}

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FacilitiesPage({ searchParams }: PageProps) {
    const queryParams = await searchParams;
    const page = parseInt(queryParams.page as string) || 1;
    const limitParams = 9;

    const where: any = {};
    if (queryParams.q) {
        const q = String(queryParams.q).toLowerCase();
        where.name = { contains: q, mode: "insensitive" };
    }

    const [facilities, totalCount] = await Promise.all([
        prisma.facility.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limitParams,
            take: limitParams,
        }),
        prisma.facility.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limitParams);

    // Sidebar: 人気の施設（いいね数順）
    const popularFacilities = await prisma.facility.findMany({
        orderBy: { likeCount: "desc" },
        take: 3,
    });

    return (
        <div className="bg-white text-gray-900 font-sans">
            {/* ヒーロー */}
            <section className="relative h-[300px] md:h-[400px] overflow-hidden">
                <div className="absolute inset-0 bg-brand-dark flex items-center justify-center">
                    {/* 背景画像がない場合のフォールバックカラー */}
                    <div className="text-white opacity-10 text-9xl font-bold italic tracking-tighter">COURTS</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end items-center pb-12 text-center">
                    <p className="text-brand-accent text-xs tracking-[0.3em] uppercase mb-3 font-semibold font-sans">FACILITIES</p>
                    <h1 className="text-4xl md:text-5xl text-white tracking-widest font-bold">全国コートガイド</h1>
                    <p className="text-white/70 text-sm mt-4 max-w-xl font-sans">近くでピックルボールができる場所を見つけよう</p>
                </div>
            </section>

            {/* 広告バナー（スポンサー枠） */}
            <div className="bg-gray-50 py-4 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 flex justify-center">
                    <SponsorBanner category="Facility" />
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
                            placeholder="施設名で検索..."
                            className="flex-1 border border-gray-200 bg-white text-sm py-3 px-4 rounded-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition"
                        />
                        <button type="submit" className="bg-brand-accent text-white text-xs tracking-[0.2em] uppercase px-8 py-3 hover:bg-brand-accent/80 transition-colors font-sans">
                            検索
                        </button>
                    </div>
                </form>
            </section>

            {/* メインコンテンツ + サイドバー */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* メイン: グリッド */}
                    <div className="flex-1 w-full lg:w-3/4">
                        <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
                            <h2 className="text-2xl font-bold text-gray-800">施設一覧</h2>
                            <span className="text-xs text-gray-400 font-sans">{totalCount}件の施設</span>
                        </div>

                        {facilities.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">条件に一致する施設が見つかりませんでした。</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {facilities.map((facility) => (
                                    <Link key={facility.id} href={`/facilities/${facility.id}`} className="block group transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-xl p-2 -m-2 hover:bg-gray-50/50">
                                        <div className="aspect-[4/3] overflow-hidden mb-3 bg-gradient-to-br from-brand-accent/10 to-brand-accent/5 relative rounded-lg">
                                            {facility.mainPhotoUrl ? (
                                                <Image src={resolveImageUrl(facility.mainPhotoUrl)} alt={facility.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                                            ) : (
                                                <DefaultNoImage text="COURT" className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                                            )}
                                            {facility.typeFlag === 1 && <span className="absolute z-20 top-3 left-3 text-[10px] font-semibold tracking-widest uppercase bg-white/90 text-brand-dark px-2 py-1">コート</span>}
                                            {facility.typeFlag === 2 && <span className="absolute z-20 top-3 left-3 text-[10px] font-semibold tracking-widest uppercase bg-white/90 text-brand-accent px-2 py-1">ショップ</span>}
                                            {facility.typeFlag === 3 && <span className="absolute z-20 top-3 left-3 text-[10px] font-semibold tracking-widest uppercase bg-white/90 text-brand-dark px-2 py-1">コート・ショップ</span>}
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-800 leading-relaxed group-hover:text-brand-accent transition-colors line-clamp-2">{facility.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{facility.address || '住所情報なし'}</p>
                                    </Link>
                                ))}
                            </div>
                        )}

                        <Pagination currentPage={page} totalPages={totalPages} basePath="/facilities" />
                    </div>

                    {/* サイドバー */}
                    <aside className="w-full lg:w-1/4 space-y-12">
                        {/* Popular Ranking */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">人気の施設</h3>
                            <div className="space-y-6">
                                {popularFacilities.map((facility, i) => (
                                    <Link key={facility.id} href={`/facilities/${facility.id}`} className="flex gap-4 items-start group transition-all duration-300 hover:-translate-y-1 hover:bg-gray-50 p-2 -m-2 rounded-xl">
                                        <div className="w-20 h-20 bg-gradient-to-br from-brand-accent/10 to-brand-accent/5 shrink-0 flex items-center justify-center overflow-hidden rounded-lg relative">
                                            {facility.mainPhotoUrl ? (
                                                <Image src={resolveImageUrl(facility.mainPhotoUrl)} alt={facility.name} fill className="object-cover" sizes="(min-width: 1024px) 80px, 64px" />
                                            ) : (
                                                <DefaultNoImage text="" className="w-full h-full" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-800 line-clamp-3 leading-relaxed group-hover:text-brand-accent transition-colors">{facility.name}</h4>
                                            <span className="text-[10px] text-gray-400 mt-1 block">♥ {facility.likeCount} Likes</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <AdSlot slot="sidebar-rectangle" />
                        <AdSlot slot="sidebar-rectangle" />
                    </aside>
                </div>
            </div>
        </div>
    );
}
