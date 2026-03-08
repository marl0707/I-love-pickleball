import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Pagination from '@/components/Pagination'
import { MessageSquare, Eye, ChevronRight } from 'lucide-react'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const category = await prisma.communityCategory.findUnique({ where: { slug } })

    if (!category) return { title: 'Not Found' }

    return {
        title: `${category.name} | コミュニティ・掲示板 | I LOVE PICKLEBALL`,
        description: category.description || '',
    }
}

interface PageProps {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
    const { slug } = await params
    const queryParams = await searchParams
    const page = parseInt(queryParams.page as string) || 1
    const limitParams = 10

    const category = await prisma.communityCategory.findUnique({
        where: { slug }
    })

    if (!category) {
        notFound()
    }

    const [posts, totalCount, allCategories] = await Promise.all([
        prisma.communityPost.findMany({
            where: { categoryId: category.id },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limitParams,
            take: limitParams,
            include: {
                user: true,
                _count: {
                    select: { comments: true }
                }
            }
        }),
        prisma.communityPost.count({ where: { categoryId: category.id } }),
        prisma.communityCategory.findMany({
            orderBy: { sortOrder: 'asc' },
            include: { _count: { select: { posts: true } } }
        })
    ])

    const totalPages = Math.ceil(totalCount / limitParams)

    return (
        <div className="bg-white text-gray-900 font-sans min-h-screen pb-20">
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-gray-500 flex items-center gap-2">
                    <Link href="/community" className="hover:text-brand-accent transition">コミュニティ</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="font-bold text-gray-800">{category.name}</span>
                </div>
            </div>

            <section className="bg-brand-dark py-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl text-white font-bold tracking-widest">{category.name}</h1>
                    <p className="text-white/70 text-sm mt-3">{category.description}</p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col lg:flex-row gap-12">
                {/* メイン: 投稿一覧 */}
                <div className="flex-1 lg:w-3/4">
                    <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-2">
                        <h2 className="text-xl font-bold text-gray-800">投稿一覧 ({totalCount}件)</h2>
                        <Link href={`/community/new?category=${category.slug}`} className="bg-brand-accent text-white text-xs px-4 py-2 rounded-full font-bold hover:bg-brand-accent/90 transition flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" /> 新規投稿
                        </Link>
                    </div>

                    {posts.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                            このカテゴリにはまだ投稿がありません。最初の投稿をしてみましょう！
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map(post => (
                                <Link key={post.id} href={`/community/post/${post.id}`} className="block bg-white border border-gray-100 p-5 rounded-xl hover:shadow-md hover:border-brand-accent/30 transition-all group">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-brand-accent transition-colors">{post.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{post.content}</p>

                                    <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-dark font-bold text-[10px] overflow-hidden relative">
                                                {post.user.profileImageUrl ? (
                                                    <Image src={post.user.profileImageUrl} alt="user" fill className="object-cover" sizes="24px" />
                                                ) : (
                                                    (post.user.nickname || 'U').charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <span className="mr-2">{post.user.nickname || '匿名ユーザー'}</span>
                                            <span>{post.createdAt.toLocaleDateString('ja-JP')}</span>
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

                    <div className="mt-8">
                        <Pagination currentPage={page} totalPages={totalPages} basePath={`/community/category/${category.slug}`} />
                    </div>
                </div>

                {/* サイドバー: 他のカテゴリ */}
                <aside className="w-full lg:w-1/3 space-y-8">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">カテゴリー</h2>
                        <ul className="space-y-2">
                            {allCategories.map(cat => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/community/category/${cat.slug}`}
                                        className={`flex items-center justify-between p-3 rounded-lg transition-all group ${cat.slug === slug ? 'bg-brand-accent/10 border border-brand-accent/20' : 'hover:bg-white hover:shadow-sm'}`}
                                    >
                                        <div>
                                            <div className={`font-bold text-sm ${cat.slug === slug ? 'text-brand-accent' : 'text-gray-700 group-hover:text-brand-accent'}`}>{cat.name}</div>
                                            {cat.description && <div className="text-[10px] text-gray-500 mt-0.5">{cat.description}</div>}
                                        </div>
                                        <span className="bg-white border border-gray-200 text-gray-500 text-xs px-2 py-1 rounded-full">{cat._count.posts}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-brand-dark rounded-2xl p-6 text-center">
                        <h3 className="text-white font-bold mb-2">投稿してみよう！</h3>
                        <p className="text-white/70 text-sm mb-4">質問やトピックを投稿して、ピックルボール仲間と交流しましょう。</p>
                        <Link href={`/community/new?category=${category.slug}`} className="inline-flex items-center gap-2 bg-brand-accent text-white font-bold px-6 py-2.5 rounded-full hover:bg-white hover:text-brand-dark transition-colors text-sm">
                            <MessageSquare className="w-4 h-4" /> 新規投稿
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    )
}
