"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";

const NAV_ITEMS = [
    { label: "施設・コート", href: "/facilities" },
    { label: "ギア・用具", href: "/gear" },
    { label: "選手名鑑", href: "/players" },
    { label: "記事・ニュース", href: "/articles" },
    { label: "大会・イベント", href: "/events" },
    { label: "練習メニュー", href: "/drills" },
    { label: "サークル・クラブ", href: "/circles" },
    { label: "コミュニティ", href: "/community" },
    { label: "広告掲載", href: "/advertise" },
    { label: "ログイン / 登録", href: "/login", isAuth: true },
];

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // ページ遷移時にメニューを閉じる
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // モーダルオープン時に背後のスクロールを止める
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <div className="lg:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="text-gray-500 hover:text-brand-dark transition-colors p-2 -ml-2"
                aria-label="メニューを開く"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* バックドロップ */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* ドロワー本体 */}
            <div
                className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-white z-[100] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    } overflow-y-auto`}
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <span className="font-bold tracking-widest text-lg" style={{ fontFamily: "'Noto Serif JP', serif" }}>MENU</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-gray-800 p-2 -mr-2 transition-colors rounded-full hover:bg-gray-100"
                        aria-label="メニューを閉じる"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="p-6">
                    <ul className="space-y-2">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`block py-3 px-4 rounded-xl text-sm font-bold transition-all ${item.isAuth
                                            ? "mt-6 bg-brand-dark text-white text-center hover:bg-black shadow-md hover:shadow-lg"
                                            : pathname === item.href
                                                ? "bg-brand-accent/10 text-brand-dark"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-brand-dark"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}
