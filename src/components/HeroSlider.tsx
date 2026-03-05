"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

export default function HeroSlider() {
    const slides = [
        {
            tag: "BEGINNER",
            title: "ピックルボールの始め方",
            subtitle: "ルールから必要な道具まで",
            desc: "アメリカ発祥の急速に成長しているスポーツ「ピックルボール」。テニス、バドミントン、卓球の要素を併せ持ち、初心者でもすぐに楽しめます。",
            image: "/images/slider/pickleball_beginner.png",
            href: "/articles"
        },
        {
            tag: "GEAR",
            title: "最強のパドルはどれだ？",
            subtitle: "2026年最新パドル比較",
            desc: "カーボンファイバーからグラスファイバーまで、プレースタイルに合わせた最適なパドルの選び方をご紹介します。",
            image: "/images/slider/pickleball_paddles.png",
            href: "/gears/paddles"
        },
        {
            tag: "COURTS",
            title: "日本全国コートガイド",
            subtitle: "近くのコートを見つけよう",
            desc: "専用コートから、テニスコートを兼用できる施設まで、日本全国のピックルボールができる場所を網羅しました。",
            image: "/images/slider/pickleball_court.png",
            href: "/facilities"
        },
        {
            tag: "RULES",
            title: "ノンボレーゾーンの戦い方",
            subtitle: "キッチンでの攻防を制する",
            desc: "ピックルボールの醍醐味であるネット際の攻防「ディンク」。上級者への第一歩となる戦術を解説します。",
            image: "/images/slider/pickleball_kitchen.png",
            href: "/articles"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 7000);
    }, [slides.length]);

    useEffect(() => {
        resetTimer();
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [resetTimer]);

    const goTo = (i: number) => { setCurrentIndex(i); resetTimer(); };
    const goPrev = () => { setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length); resetTimer(); };
    const goNext = () => { setCurrentIndex((prev) => (prev + 1) % slides.length); resetTimer(); };

    const touchStartX = useRef(0);
    const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e: React.TouchEvent) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev(); }
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div
                className="relative group overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="flex transition-transform duration-700 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentIndex * (100 / slides.length)}%)`, width: `${slides.length * 100}%` }}
                >
                    {slides.map((s, i) => (
                        <div key={i} className="w-full flex-shrink-0 flex flex-col md:flex-row gap-8 md:gap-12 items-center" style={{ width: `${100 / slides.length}%` }}>
                            {/* Vol番号 */}
                            <div className="hidden md:flex flex-col items-center justify-center w-24 shrink-0 border-r border-gray-200 pr-8 h-full self-stretch">
                                <span className="italic text-lg text-gray-500 mb-1">Vol.</span>
                                <span className="text-5xl font-thin text-gray-900 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>{1 + i}</span>
                                <div className="h-20 w-px bg-gray-300 my-4" />
                                <span className="text-gray-400 text-sm tracking-widest" style={{ writingMode: 'vertical-rl' as const }}>Latest Issue</span>
                            </div>

                            {/* コンテンツ */}
                            <div className="flex-1 w-full grid md:grid-cols-2 gap-8 items-center bg-[#f9f9f9] p-6 md:p-10 rounded-sm shadow-sm h-full">
                                <div className="order-2 md:order-1 space-y-6">
                                    <span className="inline-block border-b border-brand-accent pb-1 text-brand-accent text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        {s.tag}
                                    </span>
                                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed text-gray-800">
                                        {s.title}<br />
                                        <span className="text-xl md:text-2xl text-gray-500 mt-2 block">{s.subtitle}</span>
                                    </h2>
                                    <p className="text-gray-500 text-sm leading-loose" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        {s.desc}
                                    </p>
                                    <div className="pt-4">
                                        <Link href={s.href} className="group/btn flex items-center gap-2 text-sm text-gray-900 font-medium hover:text-brand-accent transition-colors">
                                            詳しく見る <span className="w-8 h-px bg-gray-400 group-hover/btn:bg-brand-accent transition-colors" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="order-1 md:order-2 relative aspect-[4/5] md:aspect-square overflow-hidden shadow-xl">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-110" style={{ backgroundImage: `url('${s.image}')` }} />
                                    <div className="absolute inset-0 border-[12px] border-white/90 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 前後ナビゲーションボタン */}
                <button
                    onClick={goPrev}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center text-gray-600 hover:bg-white hover:text-brand-accent transition-all opacity-0 group-hover:opacity-100 z-10"
                    aria-label="前へ"
                >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button
                    onClick={goNext}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center text-gray-600 hover:bg-white hover:text-brand-accent transition-all opacity-0 group-hover:opacity-100 z-10"
                    aria-label="次へ"
                >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>

                {/* スライド指示器 */}
                <div className="flex justify-center gap-3 mt-6">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={`スライド ${i + 1}`}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-gray-800 w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
