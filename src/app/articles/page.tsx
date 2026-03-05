import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import AdSlot from "@/components/AdSlot";
import { prisma } from "@/lib/prisma";
import DefaultNoImage from "@/components/DefaultNoImage";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "ピックルボール記事・読み物 | I LOVE PICKLEBALL",
    description: "初心者向けルールからテクニック解説、イベントレポートまで幅広くお届けします。",
};

function resolveImageUrl(url: string | null): string {
    if (!url) return '';
    return url;
}

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ArticlesPage({ searchParams }: PageProps) {
    const queryParams = await searchParams;
    const page = parseInt(queryParams.page as string) || 1;
    const limitParams = 10;

    const where: any = { status: { in: ["PUBLISHED", "published"] } }; // PUBLISHEDとpublishedの両方に対応
    if (queryParams.q) {
        const q = String(queryParams.q).toLowerCase();
        where.title = { contains: q, mode: "insensitive" };
    }
    if (queryParams.category) {
        where.category = queryParams.category;
    }

    const [articles, totalCount] = await Promise.all([
        prisma.article.findMany({
            where,
            orderBy: { publishedAt: "desc" },
            skip: (page - 1) * limitParams,
            take: limitParams,
        }),
        prisma.article.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limitParams);

    return (
        <div className="bg-white text-gray-900 font-sans">
            <section className="relative h-[300px] md:h-[400px] overflow-hidden">
                <div className="absolute inset-0 bg-brand-dark flex items-center justify-center">
                    <div className="text-white opacity-10 text-9xl font-bold italic tracking-tighter">ARTICLES</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end items-center pb-12 text-center">
                    <p className="text-brand-accent text-xs tracking-[0.3em] uppercase mb-3 font-semibold">ARTICLES & NEWS</p>
                    <h1 className="text-4xl md:text-5xl text-white tracking-widest font-bold">読み物</h1>
                    <p className="text-white/70 text-sm mt-4 max-w-xl">初心者ガイドから攻略法、最新ニュースまで</p>
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
                            placeholder="記事タイトルで検索..."
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
                            <h2 className="text-2xl font-bold text-gray-800">最新記事一覧</h2>
                            <span className="text-xs text-gray-400">{totalCount}件の記事</span>
                        </div>

                        {articles.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">記事が見つかりませんでした。</div>
                        ) : (
                            <div className="space-y-8">
                                {articles.map((article) => (
                                    <article key={article.id} className="flex flex-col md:flex-row gap-6 group transition-all duration-300 hover:-translate-y-1.5 bg-white hover:bg-gray-50 p-4 -m-4 rounded-2xl">
                                        <Link href={`/articles/${article.slug}`} className="block w-full md:w-1/3 aspect-[4/3] shrink-0 overflow-hidden relative bg-gradient-to-br from-brand-accent/10 to-brand-accent/5 rounded-lg">
                                            {article.thumbnailUrl ? (
                                                <Image src={resolveImageUrl(article.thumbnailUrl)} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                                            ) : (
                                                <DefaultNoImage text="ARTICLE" className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                                            )}
                                        </Link>
                                        <div className="flex flex-col justify-center">
                                            {article.category && (
                                                <span className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-2 inline-block">
                                                    {article.category}
                                                </span>
                                            )}
                                            <Link href={`/articles/${article.slug}`}>
                                                <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-normal group-hover:text-brand-accent transition-colors mb-3">
                                                    {article.title}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-gray-600 line-clamp-2 md:line-clamp-3 leading-relaxed">
                                                {/* contentがHTMLタグを含む場合があるため、簡易的にプレーンテキスト化 */}
                                                {article.content.replace(/<[^>]+>/g, '')}
                                            </p>
                                            <div className="mt-4 text-xs text-gray-400">
                                                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('ja-JP') : ''}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        <Pagination currentPage={page} totalPages={totalPages} basePath="/articles" />
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
