'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'

export async function login(formData: FormData) {
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/login?error=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    redirect('/login?success=ログアウト成功またはダッシュボードへ遷移') // とりあえずトップに
}

export async function signup(formData: FormData) {
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { data: authData, error } = await supabase.auth.signUp(data)

    if (error) {
        redirect('/login?error=' + encodeURIComponent(error.message))
    }

    // サインアップ直後にPrisma側のUserテーブルにもレコードを作成する（すでに存在しない場合）
    // Supabaseトリガーの代用として簡易的に実装
    if (authData.user) {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email },
            })

            if (!existingUser) {
                await prisma.user.create({
                    data: {
                        id: authData.user.id, // AuthのUUIDと揃える
                        email: data.email,
                        nickname: data.email.split('@')[0], // 初期ニックネーム
                    },
                })
            }
        } catch (e) {
            console.error('Prisma ユーザー登録エラー:', e)
        }
    }

    revalidatePath('/', 'layout')
    redirect('/login?message=' + encodeURIComponent('確認メールを送信しました。メールボックスをご確認ください。完了している場合はそのままログインできます。'))
}

export async function signout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
