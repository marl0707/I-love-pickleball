import { prisma } from '@/lib/prisma'
import React from 'react'
import Image from 'next/image'

interface SponsorBannerProps {
    category: string // 'Facility', 'Gear', 'ALL' 等
    className?: string
}

export default async function SponsorBanner({ category, className = '' }: SponsorBannerProps) {
    // 該当カテゴリで最も入札額が高いアクティブな広告を1件取得
    const topBid = await prisma.adBid.findFirst({
        where: { category, status: 'ACTIVE' },
        orderBy: { bidAmount: 'desc' },
        include: { bidderUser: { select: { nickname: true } } }
    })

    if (!topBid) return null

    return (
        <div className={`w-full max-w-4xl mx-auto bg-white border border-brand-accent/30 hover:border-brand-accent rounded-xl p-4 shadow-sm relative overflow-hidden transition-colors ${className}`}>
            <div className="absolute top-0 right-0 bg-brand-accent text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg z-10 tracking-wider">
                PR / SPONSOR
            </div>
            <a href={topBid.targetUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                {topBid.imageUrl ? (
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <Image src={topBid.imageUrl} alt={topBid.advertiserName} fill className="object-cover group-hover:scale-105 transition-transform" sizes="(min-width: 768px) 80px, 64px" />
                    </div>
                ) : (
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 text-brand-accent">
                        <span className="material-symbols-outlined text-3xl">campaign</span>
                    </div>
                )}
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-brand-accent transition-colors line-clamp-1">
                        {topBid.advertiserName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        スポンサー提供リンク: クリックして詳細をチェック
                    </p>
                </div>
                <div className="hidden md:flex items-center justify-center text-gray-400 group-hover:text-brand-accent transition-colors pl-4">
                    <span className="material-symbols-outlined text-3xl">chevron_right</span>
                </div>
            </a>
        </div>
    )
}
