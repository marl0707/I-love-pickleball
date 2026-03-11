"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
const IS_ADSENSE_ACTIVE = process.env.NEXT_PUBLIC_ADSENSE_ACTIVE === "true";

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

interface Bid {
    id: string;
    targetUrl: string;
    imageUrl: string;
    bidAmount: number;
    advertiserName: string;
    status: string;
    createdAt: string;
}

// クライアントサイドでのキャッシュ
const bidsCache: Record<string, { bids: Bid[], timestamp: number }> = {};

async function fetchBids(category: string): Promise<Bid[]> {
    const now = Date.now();
    if (bidsCache[category] && now - bidsCache[category].timestamp < 60000) {
        return bidsCache[category].bids;
    }

    try {
        const res = await fetch(`/pickleball/api/ad-bids?category=${category}`);
        if (res.ok) {
            const data = await res.json();
            if (data.success) {
                bidsCache[category] = { bids: data.data.bids || [], timestamp: now };
                return data.data.bids || [];
            }
        }
    } catch (e) {
        console.error("Failed to fetch bids", e);
    }
    return [];
}

function getCategoryFromPath(pathname: string): string {
    if (pathname.includes('/facilities') || pathname.includes('/courts')) return "Facility";
    if (pathname.includes('/gear') || pathname.includes('/paddles') || pathname.includes('/shoes')) return "Gear";
    if (pathname.includes('/players')) return "Player";
    if (pathname.includes('/community') || pathname.includes('/events') || pathname.includes('/drills')) return "Community";
    return "All";
}

let sidebarInstanceCount = 0;

export default function AdSlot({
    slot,
    adSlotId,
    className = "",
    isPremium = false,
    category,
    rankIndex,
}: AdSlotProps) {
    const pathname = usePathname();
    const config = SLOT_CONFIG[slot];

    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);
    const [autoRank, setAutoRank] = useState<number | null>(null);

    const actualCategory = category || getCategoryFromPath(pathname || "");

    useEffect(() => {
        if (rankIndex !== undefined) {
            setAutoRank(rankIndex);
        } else {
            if (slot === "header-banner") {
                setAutoRank(0); // 1st Place (Global Top)
            } else if (slot === "sidebar-rectangle") {
                sidebarInstanceCount++;
                // 1(2位)から9(10位)まで設定
                setAutoRank(Math.min(sidebarInstanceCount, 9));
            } else {
                setAutoRank(2); // デフォルト
            }
        }

        let isMounted = true;
        fetchBids(actualCategory).then(fetched => {
            if (isMounted) {
                setBids(fetched);
                setLoading(false);
            }
        });
        return () => { isMounted = false; };
    }, [actualCategory, rankIndex, slot]);

    const activeBid = autoRank !== null ? bids[autoRank] : undefined;

    useEffect(() => {
        if (IS_ADSENSE_ACTIVE && ADSENSE_CLIENT_ID && !activeBid && !loading && autoRank !== null) {
            try {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("AdSense push error:", e);
            }
        }
    }, [activeBid, loading, autoRank]);

    if (isPremium) return null;

    if (loading || autoRank === null) {
        return (
            <div className={`ad-slot animate-pulse bg-gray-100 rounded-sm ${className}`} style={{ ...config.style, height: config.placeholder.height }} />
        );
    }

    if (activeBid && activeBid.imageUrl) {
        return (
            <div className={`ad-slot-custom ${className} relative group`} style={config.style}>
                <a href={activeBid.targetUrl || "#"} target="_blank" rel="noopener noreferrer" className="block w-full h-full rounded-sm overflow-hidden shadow-sm border border-gray-200 absolute inset-0">
                    <Image
                        src={activeBid.imageUrl}
                        alt={activeBid.advertiserName || "Advertisement"}
                        fill
                        className="object-cover transition-transform group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </a>
                <div className={`absolute top-0 right-0 ${autoRank === 0 ? "bg-amber-500" : "bg-black/60"} text-white text-[9px] px-1.5 py-0.5 rounded-bl tracking-wider backdrop-blur-sm z-10`}>
                    {autoRank === 0 ? "🏆 GLOBAL SPONSOR" : "SPONSORED"}
                </div>
            </div>
        );
    }

    // 2. If AdSense is active and no active bid, fallback to AdSense
    if (IS_ADSENSE_ACTIVE && ADSENSE_CLIENT_ID && (!activeBid || !activeBid.imageUrl)) {
        return (
            <div className={`ad-slot-adsense ${className} my-4 flex justify-center w-full overflow-hidden`} style={config.style}>
                <ins className="adsbygoogle"
                    style={{ ...config.style, display: "block" }}
                    data-ad-client={ADSENSE_CLIENT_ID}
                    data-ad-slot={adSlotId || "auto"}
                    data-ad-format={config.format || "auto"}
                    data-full-width-responsive="true"></ins>
            </div>
        );
    }

    return (
        <Link
            href="/advertise"
            className={`group flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50/50 to-teal-50/30 rounded-lg border border-dashed border-emerald-200 hover:border-brand-accent hover:bg-emerald-50/50 transition-all cursor-pointer shadow-sm hover:shadow-md ${className}`}
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
                {autoRank === 0 ? "No.1 GLOBAL BANNER ($30/mo~)" : `Sidebar Rank ${autoRank + 1} Available`}
            </span>
        </Link>
    );
}
