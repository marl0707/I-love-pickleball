import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createCommunityPost } from '@/app/actions/community'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
    title: '新規投稿 | コミュニティ | I LOVE PICKLEBALL',
}

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function NewPostPage({ searchParams }: PageProps) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const queryParams = await searchParams
    const defaultCategorySlug = queryParams.category as string

    const categories = await prisma.communityCategory.findMany({
        orderBy: { sortOrder: 'asc' }
    })

    return (
        <div className="bg-white text-gray-900 font-sans min-h-screen pb-20">
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-gray-500 flex items-center gap-2">
                    <Link href="/community" className="hover:text-brand-accent transition">コミュニティ</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="font-bold text-gray-800">新規投稿</span>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8 border-b border-gray-100 pb-4">新しく投稿する</h1>

                    <form action={createCommunityPost} className="space-y-6">
                        <div>
                            <label htmlFor="categoryId" className="block text-sm font-bold text-gray-700 mb-2">カテゴリー <span className="text-red-500">*</span></label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                required
                                defaultValue={categories.find(c => c.slug === defaultCategorySlug)?.id || ''}
                                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-accent focus:border-brand-accent block p-3"
                            >
                                <option value="" disabled>カテゴリーを選択してください</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">タイトル <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                placeholder="質問やトピックのタイトル"
                                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-accent focus:border-brand-accent block p-3"
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-bold text-gray-700 mb-2">本文 <span className="text-red-500">*</span></label>
                            <textarea
                                id="content"
                                name="content"
                                rows={8}
                                required
                                placeholder="投稿の内容を詳しく書いてみましょう"
                                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-accent focus:border-brand-accent block p-3 resize-y"
                            ></textarea>
                        </div>

                        <div className="pt-6 flex justify-end gap-4">
                            <Link href="/community" className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                キャンセル
                            </Link>
                            <button type="submit" className="px-8 py-3 text-sm font-bold text-white bg-brand-accent hover:bg-brand-accent/90 rounded-lg shadow-sm transition-colors">
                                投稿する
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
