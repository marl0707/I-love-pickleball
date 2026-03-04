import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// 簡単な管理者リスト（本来は別のRole管理テーブルやカスタムクレームを使うが、今回は固定アドレスで判定）
const ADMIN_EMAILS = ['sejimakazuki@ronshoal.com', 'girigirishacho@gmail.com']

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen bg-gray-100 pb-0">
            {/* サイドバー */}
            <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden md:flex flex-col h-[calc(100vh-72px)] sticky top-[72px]">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <span className="material-symbols-outlined text-brand-accent text-lg">admin_panel_settings</span>
                        Management Console
                    </h2>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto text-sm font-medium text-gray-600">
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-accent/10 hover:text-brand-accent transition-colors">
                        <span className="material-symbols-outlined text-lg">dashboard</span>
                        ダッシュボード
                    </Link>
                    <Link href="/admin/events" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-accent/10 hover:text-brand-accent transition-colors">
                        <span className="material-symbols-outlined text-lg">event</span>
                        イベント管理
                    </Link>
                    <Link href="/admin/facilities" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-accent/10 hover:text-brand-accent transition-colors">
                        <span className="material-symbols-outlined text-lg">sports_tennis</span>
                        コート・施設管理
                    </Link>
                    <Link href="/admin/gear" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-accent/10 hover:text-brand-accent transition-colors">
                        <span className="material-symbols-outlined text-lg">shopping_bag</span>
                        ギア・用具管理
                    </Link>
                    <Link href="/admin/circles" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-accent/10 hover:text-brand-accent transition-colors">
                        <span className="material-symbols-outlined text-lg">groups</span>
                        サークル管理
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-accent/10 hover:text-brand-accent transition-colors opacity-50">
                        <span className="material-symbols-outlined text-lg">fitness_center</span>
                        練習メニュー管理（準備中）
                    </Link>
                    <Link href="/admin/ads" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-accent/10 hover:text-brand-accent transition-colors">
                        <span className="material-symbols-outlined text-lg">campaign</span>
                        広告枠・入札管理
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-accent/10 hover:text-brand-accent transition-colors opacity-50">
                        <span className="material-symbols-outlined text-lg">group</span>
                        ユーザー管理（準備中）
                    </Link>
                </nav>
            </aside>

            {/* モバイル用サイドバー代替ナビゲーション */}
            <div className="md:hidden w-full bg-white border-b border-gray-200 px-4 py-3 flex overflow-x-auto gap-4 sticky top-[72px] z-40 text-sm font-medium">
                <Link href="/admin" className="whitespace-nowrap flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">dashboard</span> トップ</Link>
                <Link href="/admin/events" className="whitespace-nowrap flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">event</span> イベント</Link>
                <Link href="/admin/facilities" className="whitespace-nowrap flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">sports_tennis</span> 施設</Link>
                <Link href="/admin/circles" className="whitespace-nowrap flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">groups</span> サークル</Link>
                <Link href="/admin/ads" className="whitespace-nowrap flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">campaign</span> 広告</Link>
            </div>

            {/* メインコンテンツ */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
