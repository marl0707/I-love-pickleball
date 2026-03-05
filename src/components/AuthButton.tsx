import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { signout } from '@/app/login/actions'

export default async function AuthButton() {
    const supabase = createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    return user ? (
        <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:inline-block">
                {user.email}
            </span>
            <span className="text-sm font-bold text-white/50 cursor-not-allowed" title="準備中">
                お気に入り
            </span>
            <form action={signout}>
                <button className="text-sm font-bold border border-gray-600 hover:border-brand-accent hover:text-brand-accent transition px-4 py-1.5 rounded">
                    ログアウト
                </button>
            </form>
        </div>
    ) : (
        <Link
            href="/login"
            className="bg-brand-accent text-brand-dark px-4 py-1.5 rounded font-bold text-sm tracking-widest hover:bg-white transition"
        >
            ログイン
        </Link>
    )
}
