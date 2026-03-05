import Link from "next/link";
import { SearchX, ArrowRight } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <SearchX className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                404
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                お探しのページが見つかりません
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
                申し訳ありません。アクセスしようとしたページは削除されたか、URLが変更されたか、現在利用できない可能性があります。
            </p>
            <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all hover:-translate-y-1 shadow-md hover:shadow-lg"
            >
                ホームへ戻る
                <ArrowRight className="w-5 h-5" />
            </Link>
        </div>
    );
}
