"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // コンソールにエラーを出力（プロダクションではSentry等へ送る）
        console.error("System Error caught by Error Boundary:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                System Error
            </h1>
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                予期せぬシステムエラーが発生しました
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed text-sm">
                ご不便をおかけして申し訳ありません。<br />
                一時的な問題の可能性がありますので、再度お試しいただくか、ホームへ戻ってやり直してください。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={() => reset()}
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-brand-dark text-brand-dark px-8 py-3.5 rounded-full font-bold hover:bg-gray-50 transition-all shadow-sm"
                >
                    <RotateCcw className="w-5 h-5" />
                    再読み込み
                </button>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all hover:-translate-y-1 shadow-md hover:shadow-lg"
                >
                    ホームへ戻る
                </Link>
            </div>
        </div>
    );
}
