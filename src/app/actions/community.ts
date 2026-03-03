'use server'

import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createCommunityPost(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: 'ログインが必要です' }
    }

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const categoryId = formData.get('categoryId') as string

    if (!title || !content || !categoryId) {
        return { success: false, message: '入力項目に不備があります' }
    }

    try {
        const post = await prisma.communityPost.create({
            data: {
                title,
                content,
                categoryId,
                authorId: user.id
            }
        })

        revalidatePath('/community')
        revalidatePath(`/community/category/[slug]`, 'page')

        return { success: true, postId: post.id }
    } catch (error) {
        console.error('Failed to create post:', error)
        return { success: false, message: '投稿の作成に失敗しました' }
    }
}

export async function addCommunityComment(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: 'ログインが必要です' }
    }

    const content = formData.get('content') as string
    const postId = formData.get('postId') as string

    if (!content || !postId) {
        return { success: false, message: 'コメント内容を入力してください' }
    }

    try {
        await prisma.communityComment.create({
            data: {
                content,
                postId,
                userId: user.id
            }
        })

        revalidatePath(`/community/post/${postId}`)

        return { success: true }
    } catch (error) {
        console.error('Failed to add comment:', error)
        return { success: false, message: 'コメントの送信に失敗しました' }
    }
}

export async function incrementPostViewCount(postId: string) {
    try {
        await prisma.communityPost.update({
            where: { id: postId },
            data: {
                viewCount: {
                    increment: 1
                }
            }
        })
    } catch (error) {
        console.error('Failed to increment view count:', error)
    }
}
