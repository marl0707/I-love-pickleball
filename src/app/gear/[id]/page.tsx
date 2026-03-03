import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { prisma } from "@/lib/prisma";
import { generateAffiliateLinks } from "@/lib/affiliate";

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
    const gear = await prisma.gearPaddle.findUnique({ where: { id } });

    if (!gear) return { title: "Not Found" };

    return {
        title: `${gear.brandName} ${gear.productName} | 最新ピックルボールギア`,
        description: `${gear.productName}のスペック、特徴、ユーザーレビューを掲載しています。`,
    };
}

export default async function GearDetailPage({ params }: PageProps) {
    const { id } = await params;

    const gear = await prisma.gearPaddle.findUnique({
        where: { id },
    });

    if (!gear) {
        notFound();
    }

    // もしもアフィリエイト自動リンク生成
    const affiliateLinks = generateAffiliateLinks(gear.productName, gear.brandName);

    // スペック情報をまとめる
    const specs = [
        { label: "ブランド", value: gear.brandName },
        { label: "シェイプ", value: gear.paddleShape },
        { label: "表面素材", value: gear.faceMaterial },
        { label: "コア素材", value: gear.coreMaterial },
        { label: "コア厚み", value: gear.coreThickness ? `${gear.coreThickness}mm` : null },
        { label: "プレースタイル", value: gear.targetDemographic },
    ].filter(item => item.value);

    // 購入リンク（DBに手動設定があればそちらを優先、なければ自動生成リンク）
    const buyLinks = [
        {
            label: 'Amazonで探す',
            url: gear.amazonUrl || affiliateLinks.amazon,
            bgColor: 'bg-[#FF9900]',
            hoverColor: 'hover:bg-[#e68a00]',
            icon: '🛒',
        },
        {
            label: '楽天市場で探す',
            url: gear.rakutenUrl || affiliateLinks.rakuten,
            bgColor: 'bg-[#BF0000]',
            hoverColor: 'hover:bg-[#a00000]',
            icon: '🏪',
        },
        {
            label: 'Yahoo!で探す',
            url: gear.yahooUrl || affiliateLinks.yahoo,
            bgColor: 'bg-[#FF0033]',
            hoverColor: 'hover:bg-[#dd002b]',
            icon: '🛍️',
        },
    ];

    return (
        <div className="bg-white text-gray-900 font-sans">
            {/* 広告バナー */}
            <div className="bg-gray-50 py-4 border-b border-gray-100 mb-8">
                <div className="max-w-7xl mx-auto px-4 flex justify-center">
                    <AdSlot slot="header-banner" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 mt-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* メイン詳細 */}
                    <div className="flex-1 w-full lg:w-2/3">

                        {/* 製品ヘッダー */}
                        <div className="flex flex-col md:flex-row gap-8 mb-12">
                            <div className="w-full md:w-1/2 aspect-square bg-gradient-to-br from-brand-accent/10 to-brand-dark/5 p-4 flex items-center justify-center rounded-2xl overflow-hidden relative">
                                {gear.imageUrl ? (
                                    <img src={resolveImageUrl(gear.imageUrl)} alt={gear.productName} className="w-full h-full object-contain mix-blend-multiply" />
                                ) : (
                                    <span className="text-gray-300 font-bold text-2xl tracking-widest uppercase opacity-20">{gear.brandName}</span>
                                )}
                            </div>
                            <div className="w-full md:w-1/2 flex flex-col justify-center">
                                <span className="text-brand-accent text-xs tracking-widest uppercase font-bold mb-2">{gear.brandName}</span>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">{gear.productName}</h1>
                                <p className="text-3xl font-bold text-gray-900 mb-6 bg-yellow-400 pl-3 border-l-4 border-yellow-500 py-1">
                                    ¥{gear.price?.toLocaleString() || '価格未定'} <span className="text-sm font-normal text-gray-600 block sm:inline mt-1 sm:mt-0 ml-0 sm:ml-2">※参考価格(税込)</span>
                                </p>

                                <div className="space-y-3">
                                    {buyLinks.map((link) => (
                                        <a
                                            key={link.label}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`block w-full text-center ${link.bgColor} ${link.hoverColor} text-white font-bold py-3.5 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2`}
                                        >
                                            <span>{link.icon}</span>
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-3 text-center">※ アフィリエイトリンクを含みます</p>
                            </div>
                        </div>

                        {/* スペック表 */}
                        <section className="mb-16">
                            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">基本スペック</h2>
                            <div className="responsive-table bg-white border text-sm border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full text-left">
                                    <tbody className="divide-y divide-gray-200">
                                        {specs.map((spec, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <th className="px-6 py-4 font-medium text-gray-600 w-1/3 bg-gray-50/50" data-label="項目">{spec.label}</th>
                                                <td className="px-6 py-4 text-gray-800 font-bold" data-label="スペック">{spec.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <div className="flex justify-center mt-8">
                            <Link href="/gear" className="text-brand-accent hover:underline text-sm font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                ギア一覧に戻る
                            </Link>
                        </div>
                    </div>

                    {/* サイドバー */}
                    <aside className="w-full lg:w-1/3 space-y-10">
                        <AdSlot slot="sidebar-rectangle" />

                        <div className="bg-brand-dark p-8 rounded-2xl text-white">
                            <h3 className="text-xl font-bold mb-4">最適なパドル選びを</h3>
                            <p className="text-sm text-brand-accent/80 leading-relaxed mb-6">
                                スピン性能、パワー、コントロール... あなたのプレースタイルに合った一本を見つけましょう。
                            </p>
                            <Link href="/articles" className="inline-block border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white transition px-6 py-2 text-sm font-bold tracking-widest uppercase">
                                ガイドを読む
                            </Link>
                        </div>

                        <AdSlot slot="sidebar-rectangle" />
                    </aside>
                </div>
            </div>
        </div>
    );
}
