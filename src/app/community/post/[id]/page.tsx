import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { MessageSquare, Eye, ChevronRight, User } from 'lucide-react'
import { incrementPostViewCount, addCommunityComment } from '@/app/actions/community'
import { createClient } from '@/utils/supabase/server'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

export const revalidate = 0 // 常に最新のコメントを表示

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const post = await prisma.communityPost.findUnique({ where: { id } })

    if (!post) return { title: 'Not Found' }

    return {
        title: `${post.title} | コミュニティ | I LOVE PICKLEBALL`,
        description: post.content.substring(0, 100),
    }
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 閲覧数をインクリメント (非同期でバックグラウンド実行)
    incrementPostViewCount(id)

    const post = await prisma.communityPost.findUnique({
        where: { id },
        include: {
            user: true,
            category: true,
            comments: {
                include: {
                    user: true
                },
                orderBy: { createdAt: 'asc' }
            }
        }
    })

    if (!post) {
        notFound()
    }

    // 同じカテゴリの関連投稿を取得
    const relatedPosts = await prisma.communityPost.findMany({
        where: {
            categoryId: post.categoryId,
            id: { not: post.id }
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
            _count: { select: { comments: true } }
        }
    })

    return (
        <div className="bg-white text-gray-900 font-sans min-h-screen pb-20">
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-gray-500 flex flex-wrap items-center gap-2">
                    <Link href="/community" className="hover:text-brand-accent transition">コミュニティ</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link href={`/community/category/${post.category.slug}`} className="hover:text-brand-accent transition">{post.category.name}</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="font-bold text-gray-800 line-clamp-1 break-all">{post.title}</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <article className="bg-white border text-gray-800 border-gray-200 rounded-2xl p-6 md:p-10 mb-8 shadow-sm">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-relaxed">{post.title}</h1>

                    <div className="flex flex-wrap items-center justify-between pb-6 border-b border-gray-100 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex flex-shrink-0 items-center justify-center text-brand-dark font-bold overflow-hidden relative">
                                {post.user.profileImageUrl ? (
                                    <Image src={post.user.profileImageUrl} alt="user" fill className="object-cover" sizes="40px" />
                                ) : (
                                    <User className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <div className="font-bold text-sm text-gray-800">{post.user.nickname || '匿名ユーザー'}</div>
                                <div className="text-xs text-gray-500">{post.createdAt.toLocaleString('ja-JP')}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-4 sm:mt-0">
                            <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full"><Eye className="w-4 h-4" />{post.viewCount} Views</span>
                            <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full"><MessageSquare className="w-4 h-4" />{post.comments.length} Comments</span>
                        </div>
                    </div>

                    <div className="prose prose-sm md:prose-base max-w-none text-gray-700 whitespace-pre-wrap leading-loose">
                        {post.content}
                    </div>
                </article>

                {/* コメントセクション */}
                <section className="mt-12">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-brand-accent" />
                        コメント ({post.comments.length})
                    </h3>

                    <div className="space-y-6 mb-10">
                        {post.comments.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-6 bg-gray-50 rounded-xl">まだコメントはありません。最初のコメントをしてみましょう！</p>
                        ) : (
                            post.comments.map(comment => (
                                <div key={comment.id} className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
                                                {comment.user.profileImageUrl ? (
                                                    <Image src={comment.user.profileImageUrl} alt="user" fill className="object-cover" sizes="32px" />
                                                ) : (
                                                    <User className="w-4 h-4 text-gray-400" />
                                                )}
                                            </div>
                                            <span className="font-bold text-sm text-gray-800">{comment.user.nickname || '匿名ユーザー'}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: ja })}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-700 whitespace-pre-wrap ml-10">
                                        {comment.content}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* コメント入力フォーム */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h4 className="font-bold text-gray-800 mb-4">コメントを書く</h4>
                        {user ? (
                            <form action={async (formData) => {
                                "use server";
                                await addCommunityComment(formData);
                            }}>
                                <input type="hidden" name="postId" value={post.id} />
                                <textarea
                                    name="content"
                                    rows={4}
                                    required
                                    placeholder="ここにコメントを入力してください..."
                                    className="w-full border border-gray-300 rounded-lg p-4 text-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition bg-gray-50 focus:bg-white resize-y"
                                ></textarea>
                                <div className="mt-4 flex justify-end">
                                    <button type="submit" className="bg-brand-dark hover:bg-black text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm">
                                        送信する
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-100">
                                <p className="text-gray-600 text-sm mb-4">コメントを投稿するにはログインが必要です。</p>
                                <Link href="/login" className="inline-block bg-brand-accent hover:bg-brand-accent/90 text-white font-bold px-8 py-2.5 rounded-full transition-colors">
                                    ログイン・新規登録
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* 関連投稿 */}
                {relatedPosts.length > 0 && (
                    <section className="mt-12">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                            「{post.category.name}」の他の投稿
                        </h3>
                        <div className="space-y-3">
                            {relatedPosts.map(related => (
                                <Link key={related.id} href={`/community/post/${related.id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all group">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-gray-800 group-hover:text-brand-accent transition-colors truncate">{related.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{related.createdAt.toLocaleDateString('ja-JP')}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-4 text-xs text-gray-400 shrink-0">
                                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{related.viewCount}</span>
                                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{related._count.comments}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-6 text-center">
                            <Link href={`/community/category/${post.category.slug}`} className="text-sm text-brand-accent hover:underline font-bold">
                                「{post.category.name}」の投稿をすべて見る →
                            </Link>
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
