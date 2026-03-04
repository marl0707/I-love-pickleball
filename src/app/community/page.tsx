import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MessageSquare, ThumbsUp, Eye } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "コミュニティ・掲示板 | I LOVE PICKLEBALL",
    description: "ピックルボール仲間と情報交換や質問ができるコミュニティ掲示板です。",
};

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CommunityTopPage({ searchParams }: PageProps) {
    const queryParams = await searchParams;
    const where: any = {};
    if (queryParams.q) {
        const q = String(queryParams.q).toLowerCase();
        where.title = { contains: q, mode: "insensitive" };
    }

    // カテゴリとそれぞれの最新投稿数を取得
    const categories = await prisma.communityCategory.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
            _count: {
                select: { posts: true }
            }
        }
    });

    // 全カテゴリの最新投稿を取得
    const recentPosts = await prisma.communityPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
            user: true,
            category: true,
            _count: {
                select: { comments: true }
            }
        }
    });

    return (
        <div className="bg-white text-gray-900 font-sans min-h-screen pb-20">
            {/* ヒーローセクション */}
            <section className="bg-brand-dark py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-brand-accent text-xs tracking-[0.3em] uppercase mb-3 font-semibold font-sans">COMMUNITY</p>
                    <h1 className="text-3xl md:text-5xl text-white font-bold tracking-widest mb-4">コミュニティ・掲示板</h1>
                    <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto">
                        全国のピックルボールプレイヤーと情報交換しよう！<br />初心者からの質問や、おすすめの用具紹介、大会の感想など大歓迎です。
                    </p>
                    <div className="mt-8">
                        <Link href="/community/new" className="bg-brand-accent text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-brand-dark transition-colors inline-flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            <span>新しく投稿する</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 検索フォーム */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
                <form method="GET" className="bg-gray-50 border border-gray-100 p-6 md:p-8">
                    <h2 className="text-center text-xs tracking-[0.3em] uppercase text-gray-500 mb-6 font-semibold font-sans">SEARCH</h2>
                    <div className="max-w-2xl mx-auto flex gap-4">
                        <input
                            type="text"
                            name="q"
                            defaultValue={queryParams.q as string || ""}
                            placeholder="投稿タイトルで検索..."
                            className="flex-1 border border-gray-200 bg-white text-sm py-3 px-4 rounded-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition"
                        />
                        <button type="submit" className="bg-brand-accent text-white text-xs tracking-[0.2em] uppercase px-8 py-3 hover:bg-brand-accent/80 transition-colors font-sans">
                            検索
                        </button>
                    </div>
                </form>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col lg:flex-row gap-12">
                {/* メイン: 最新の投稿 */}
                <div className="flex-1 lg:w-2/3">
                    <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-2">
                        <h2 className="text-2xl font-bold text-gray-800">新着の投稿</h2>
                    </div>

                    {recentPosts.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                            まだ投稿がありません。最初の投稿をしてみましょう！
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentPosts.map(post => (
                                <Link key={post.id} href={`/community/post/${post.id}`} className="block bg-white border border-gray-100 p-5 rounded-xl hover:shadow-md hover:border-brand-accent/30 transition-all group">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded font-bold">{post.category.name}</span>
                                        <span className="text-xs text-gray-400">{post.createdAt.toLocaleDateString('ja-JP')}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-brand-accent transition-colors">{post.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{post.content}</p>

                                    <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-dark font-bold text-[10px] overflow-hidden">
                                                {post.user.profileImageUrl ? (
                                                    <img src={post.user.profileImageUrl} alt="user" className="w-full h-full object-cover" />
                                                ) : (
                                                    (post.user.nickname || 'U').charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <span>{post.user.nickname || '匿名ユーザー'}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.viewCount}</span>
                                            <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{post._count.comments}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* サイドバー: カテゴリ一覧 */}
                <aside className="w-full lg:w-1/3 space-y-8">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">カテゴリー</h2>
                        <ul className="space-y-2">
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <Link href={`/community/category/${cat.slug}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all group">
                                        <div>
                                            <div className="font-bold text-sm text-gray-700 group-hover:text-brand-accent">{cat.name}</div>
                                            <div className="text-[10px] text-gray-500 mt-0.5">{cat.description}</div>
                                        </div>
                                        <span className="bg-white border border-gray-200 text-gray-500 text-xs px-2 py-1 rounded-full">{cat._count.posts}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
