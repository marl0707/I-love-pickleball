import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { prisma } from "@/lib/prisma"
import AdBidSettingsClient from "./AdBidSettingsClient"

export const metadata = {
    title: '広告設定ダッシュボード | I LOVE PICKLEBALL',
}

export default async function AdDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login?redirect=/advertise/dashboard")
    }

    // ユーザーに紐づく広告枠（AdBid）を取得
    const adBids = await prisma.adBid.findMany({
        where: {
            bidderId: user.id
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <span className="material-symbols-outlined text-brand-primary mr-3 text-4xl">dashboard</span>
                        広告設定ダッシュボード
                    </h1>
                    <p className="text-gray-600 mt-2">
                        ご入札いただいた広告枠の設定と管理を行えます。設定した内容（画像・リンク先）は即時サイトに反映されます。
                    </p>
                </div>

                <AdBidSettingsClient initialBids={adBids} />
            </div>
        </div>
    )
}
