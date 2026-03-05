import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { prisma } from "@/lib/prisma";

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
    const player = await prisma.proPlayer.findUnique({ where: { id } });

    if (!player) return { title: "Not Found" };

    return {
        title: `${player.nameJa} (${player.nameEn || ''}) | プロピックルボール選手`,
        description: `${player.nameJa}のプロフィール、戦績、使用ギアなどの情報を確認できます。`,
    };
}

export default async function PlayerDetailPage({ params }: PageProps) {
    const { id } = await params;

    const player = await prisma.proPlayer.findUnique({
        where: { id },
    });

    if (!player) {
        notFound();
    }

    const profiles = [
        { label: "国籍", value: player.nationality },
        { label: "生年月日", value: player.birthDate ? new Date(player.birthDate).toLocaleDateString('ja-JP') : null },
        { label: "プレースタイル", value: player.playStyle },
        { label: "所属リーグ", value: player.leagueAffiliation },
        { label: "シングルスランク", value: player.rankingSingles ? `${player.rankingSingles}位` : null },
        { label: "ダブルスランク", value: player.rankingDoubles ? `${player.rankingDoubles}位` : null },
        { label: "スポンサー", value: player.apparelBrandSponsor },
    ].filter(item => item.value);

    return (
        <div className="bg-white text-gray-900 font-sans">
            {/* ヒーロー */}
            <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-brand-dark">
                <div className="absolute inset-0 flex">
                    <div className="w-1/2 bg-brand-dark flex flex-col justify-center px-8 sm:px-16 lg:px-32 relative z-10">
                        <span className="text-brand-accent tracking-[0.3em] font-bold text-xs mb-2">PRO PLAYER</span>
                        <h1 className="text-4xl md:text-6xl text-white font-bold mb-2">{player.nameJa}</h1>
                        <h2 className="text-xl md:text-2xl text-white/50 font-serif italic">{player.nameEn}</h2>

                        <div className="flex gap-4 mt-8">
                            {player.instagramUrl && (
                                <a href={player.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition">
                                    <span className="material-symbols-outlined text-white">photo_camera</span>
                                </a>
                            )}
                            {player.xUrl && (
                                <a href={player.xUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition">
                                    <span className="text-white font-bold">X</span>
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="w-1/2 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/50 to-transparent z-10" />
                        {player.photoUrl ? (
                            <Image src={resolveImageUrl(player.photoUrl)} alt={player.nameJa} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700" />
                        ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <span className="text-gray-600 font-bold text-6xl opacity-20">NO PHOTO</span>
                            </div>
                        )}
                    </div>
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

                        {/* プロフィール表 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-brand-dark">person</span> プロフィール
                            </h2>
                            <div className="responsive-table bg-white border text-sm border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full text-left">
                                    <tbody className="divide-y divide-gray-200">
                                        {profiles.map((profile, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <th className="px-6 py-4 font-medium text-gray-600 w-1/3 bg-gray-50/50" data-label="項目">{profile.label}</th>
                                                <td className="px-6 py-4 text-gray-800 font-bold" data-label="情報">{profile.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <div className="flex justify-center mt-8">
                            <Link href="/players" className="text-brand-accent hover:underline text-sm font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                選手一覧に戻る
                            </Link>
                        </div>
                    </div>

                    {/* サイドバー */}
                    <aside className="w-full lg:w-1/3 space-y-10">
                        <AdSlot slot="sidebar-rectangle" />
                        <AdSlot slot="sidebar-rectangle" />
                    </aside>
                </div>
            </div>
        </div>
    );
}
