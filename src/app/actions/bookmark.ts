'use server'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function toggleBookmark(itemType: string, itemId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'User not authenticated' }
    }

    try {
        // 既存のブックマークを確認
        const existingBookmark = await prisma.bookmark.findUnique({
            where: {
                userId_itemType_itemId: {
                    userId: user.id,
                    itemType,
                    itemId,
                },
            },
        })

        if (existingBookmark) {
            // 存在する場合は削除 (お気に入り解除)
            await prisma.bookmark.delete({
                where: { id: existingBookmark.id },
            })
            revalidatePath(`/${itemType === 'facility' ? 'facilities' : itemType}s/${itemId}`)
            return { success: true, bookmarked: false }
        } else {
            // 存在しない場合は作成 (お気に入り追加)
            await prisma.bookmark.create({
                data: {
                    userId: user.id,
                    itemType,
                    itemId,
                },
            })
            revalidatePath(`/${itemType === 'facility' ? 'facilities' : itemType}s/${itemId}`)
            return { success: true, bookmarked: true }
        }
    } catch (error) {
        console.error('Bookmark toggle error:', error)
        return { success: false, error: 'Failed to toggle bookmark' }
    }
}

export async function checkBookmarkStatus(itemType: string, itemId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { bookmarked: false }
    }

    try {
        const existingBookmark = await prisma.bookmark.findUnique({
            where: {
                userId_itemType_itemId: {
                    userId: user.id,
                    itemType,
                    itemId,
                },
            },
        })

        return { bookmarked: !!existingBookmark }
    } catch (error) {
        console.error('Bookmark check error:', error)
        return { bookmarked: false }
    }
}
