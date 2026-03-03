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
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = await prisma.article.findUnique({ where: { slug } });

    if (!article || !["PUBLISHED", "published"].includes(article.status)) return { title: "Not Found" };

    return {
        title: `${article.title} | I LOVE PICKLEBALL`,
        description: article.content.replace(/<[^>]+>/g, '').substring(0, 120) + '...',
    };
}

export default async function ArticleDetailPage({ params }: PageProps) {
    const { slug } = await params;

    const article = await prisma.article.findUnique({
        where: { slug },
    });

    if (!article || !["PUBLISHED", "published"].includes(article.status)) {
        notFound();
    }

    // 関連記事として最新から3件（本記事以外）を取得
    const relatedArticles = await prisma.article.findMany({
        where: {
            status: "PUBLISHED",
            id: { not: article.id },
            category: article.category
        },
        orderBy: { publishedAt: 'desc' },
        take: 3
    });

    return (
        <div className="bg-white text-gray-900 font-sans">
            {/* 広告バナー */}
            <div className="bg-gray-50 py-4 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 flex justify-center">
                    <AdSlot slot="header-banner" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* メイン詳細 */}
                    <div className="flex-1 w-full lg:w-2/3">

                        {/* 記事ヘッダー */}
                        <header className="mb-10">
                            <div className="flex items-center gap-3 mb-6">
                                {article.category && (
                                    <span className="text-white bg-brand-dark px-3 py-1 text-xs font-bold tracking-widest uppercase">
                                        {article.category}
                                    </span>
                                )}
                                <span className="text-gray-400 text-sm">
                                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('ja-JP') : ''}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
                                {article.title}
                            </h1>

                            {article.thumbnailUrl && (
                                <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100 mb-10">
                                    <img src={resolveImageUrl(article.thumbnailUrl)} alt={article.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                        </header>

                        {/* 記事本文 */}
                        <div className="prose prose-lg prose-green max-w-none text-gray-700 leading-loose" dangerouslySetInnerHTML={{ __html: article.content }} />

                        {/* シェア・戻るなど */}
                        <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between items-center">
                            <Link href="/articles" className="text-brand-accent hover:underline text-sm font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                一覧に戻る
                            </Link>

                            <div className="flex gap-4">
                                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition">
                                    <span className="text-sm font-bold">f</span>
                                </button>
                                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white transition">
                                    <span className="text-sm font-bold">X</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* サイドバー */}
                    <aside className="w-full lg:w-1/3 space-y-12">
                        {/* 関連記事 */}
                        {relatedArticles.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">関連記事</h3>
                                <div className="space-y-6">
                                    {relatedArticles.map(rel => (
                                        <Link key={rel.id} href={`/articles/${rel.slug}`} className="flex gap-4 group">
                                            <div className="w-24 h-24 aspect-square shrink-0 bg-gray-100 overflow-hidden">
                                                {rel.thumbnailUrl ? (
                                                    <img src={resolveImageUrl(rel.thumbnailUrl)} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : null}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-gray-800 line-clamp-3 leading-relaxed group-hover:text-brand-accent transition-colors">{rel.title}</h4>
                                                <div className="mt-2 text-[10px] text-gray-400">
                                                    {rel.publishedAt ? new Date(rel.publishedAt).toLocaleDateString('ja-JP') : ''}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        <AdSlot slot="sidebar-rectangle" />
                        <AdSlot slot="sidebar-rectangle" />
                    </aside>
                </div>
            </div>
        </div>
    );
}
