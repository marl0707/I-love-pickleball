import type { Metadata } from 'next'
import Link from "next/link";
import { login, signup } from "./actions";

export const metadata: Metadata = {
    title: 'ログイン・新規登録',
    description: 'I LOVE PICKLEBALLにログインまたは新規登録して、コミュニティや各種機能をご利用ください。',
}

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message: string; error: string; success: string };
}) {
    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen">
            <Link
                href="/"
                className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm font-bold text-gray-600 transition"
            >
                <span className="material-symbols-outlined text-sm mr-2 transition-transform group-hover:-translate-x-1">
                    arrow_back
                </span>
                ホームへ戻る
            </Link>

            <div className="flex flex-col items-center mb-10 w-full animate-in fade-in slide-in-bottom-4 duration-500">
                <div className="w-16 h-16 bg-brand-dark rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-brand-dark/20">
                    <span className="material-symbols-outlined text-white text-3xl">sports_tennis</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
                <p className="text-gray-500 text-sm mt-3">アカウントにログインまたは新規登録してください</p>
            </div>

            <form className="animate-in fade-in slide-in-bottom-8 duration-500 delay-150 flex-1 flex flex-col w-full justify-center gap-2 text-foreground">

                <div className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="rounded-lg px-4 py-3 bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all shadow-sm"
                            name="email"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="rounded-lg px-4 py-3 bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all shadow-sm"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                {searchParams?.error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-start gap-2 animate-in fade-in">
                        <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
                        <p className="font-medium mt-0.5">{searchParams.error}</p>
                    </div>
                )}

                {searchParams?.message && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 text-blue-600 text-sm rounded-lg flex items-start gap-2 animate-in fade-in">
                        <span className="material-symbols-outlined text-[20px] shrink-0">info</span>
                        <p className="font-medium mt-0.5">{searchParams.message}</p>
                    </div>
                )}

                <div className="flex flex-col gap-3 mt-10">
                    <button
                        formAction={login}
                        className="bg-brand-dark hover:bg-gray-800 text-white rounded-lg px-4 py-3.5 font-bold shadow-lg shadow-gray-900/20 transition-all hover:-translate-y-0.5"
                    >
                        ログイン
                    </button>
                    <button
                        formAction={signup}
                        className="bg-white border-2 border-brand-dark hover:bg-gray-50 text-brand-dark rounded-lg px-4 py-3 font-bold transition-all"
                    >
                        新規登録
                    </button>
                </div>
            </form>
        </div>
    );
}
