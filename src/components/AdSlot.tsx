"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SLOT_CONFIG = {
    "header-banner": {
        format: "horizontal" as const,
        style: { display: "block", width: "100%", maxWidth: "728px", height: "90px", margin: "0 auto" },
        placeholder: { width: "728px", height: "90px", label: "ADVERTISEMENT" },
    },
    "sidebar-rectangle": {
        format: "rectangle" as const,
        style: { display: "block", width: "300px", height: "250px", margin: "0 auto" },
        placeholder: { width: "300px", height: "250px", label: "AD (300×250)" },
    },
    "in-article": {
        format: "fluid" as const,
        style: { display: "block", textAlign: "center" as const },
        placeholder: { width: "100%", height: "250px", label: "ADVERTISEMENT" },
    },
    "in-feed": {
        format: "fluid" as const,
        style: { display: "block" },
        placeholder: { width: "100%", height: "120px", label: "SPONSORED" },
    },
} as const;

type SlotType = keyof typeof SLOT_CONFIG;

interface AdSlotProps {
    slot: SlotType;
    adSlotId?: string;
    className?: string;
    isPremium?: boolean;
    category?: string;
    rankIndex?: number;
}

export default function AdSlot({
    slot,
    className = "",
    isPremium = false,
}: AdSlotProps) {
    const config = SLOT_CONFIG[slot];

    if (isPremium) return null;

    // TODO: API実装後に実際の広告データをフェッチする処理を追加
    // 現在はプレースホルダーのみ表示

    return (
        <Link
            href="/advertise"
            className={`group flex flex-col items-center justify-center bg-gradient-to-br from-blue-50/50 to-emerald-50/30 rounded-lg border border-dashed border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all cursor-pointer shadow-sm hover:shadow-md ${className}`}
            style={{
                width: config.placeholder.width,
                maxWidth: "100%",
                height: config.placeholder.height,
                fontFamily: "'Inter', sans-serif",
                textDecoration: "none",
            }}
        >
            <span className="material-symbols-outlined text-3xl text-emerald-300 group-hover:text-emerald-500 transition-colors mb-2">
                auto_awesome
            </span>
            <span className="text-sm font-bold tracking-widest text-emerald-600/70 group-hover:text-emerald-700 uppercase transition-colors">
                Your Ad Here
            </span>
            <span className="text-[11px] font-medium tracking-wide text-emerald-400/80 group-hover:text-emerald-600 mt-1 transition-colors">
                広告枠の募集について
            </span>
        </Link>
    );
}
