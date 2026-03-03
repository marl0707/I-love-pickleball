'use client'

import { useState, useTransition } from 'react'
import { Bookmark } from 'lucide-react'
import { toggleBookmark } from '@/app/actions/bookmark'
import { useRouter } from 'next/navigation'

export default function BookmarkButton({
    itemType,
    itemId,
    initialBookmarked,
    isLoggedIn
}: {
    itemType: string
    itemId: string
    initialBookmarked: boolean
    isLoggedIn: boolean
}) {
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleToggle = () => {
        if (!isLoggedIn) {
            router.push('/login')
            return
        }

        // 楽観的UI更新
        setIsBookmarked(!isBookmarked)

        startTransition(async () => {
            const result = await toggleBookmark(itemType, itemId)
            if (result && result.success !== undefined && result.bookmarked !== undefined) {
                setIsBookmarked(result.bookmarked)
            } else {
                // エラー時はロールバック
                setIsBookmarked(isBookmarked)
            }
        })
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isBookmarked
                    ? 'bg-brand-accent text-white hover:bg-brand-accent/90'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>{isBookmarked ? '保存済み' : '保存する'}</span>
        </button>
    )
}
