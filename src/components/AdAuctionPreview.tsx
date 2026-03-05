"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Bid {
    id: string;
    targetUrl: string;
    imageUrl: string;
    bidAmount: number;
    advertiserName: string;
    status: string;
    createdAt: string;
    bidderUser?: { nickname: string | null };
}

interface AdAuctionPreviewProps {
    categories: string[];
    initialCategory?: string;
    initialBids?: Bid[];
}

export default function AdAuctionPreview({
    categories,
    initialCategory,
    initialBids = [],
}: AdAuctionPreviewProps) {
    const [selectedCategory, setSelectedCategory] = useState(
        initialCategory || categories[0] || "All"
    );

    const [bids, setBids] = useState<Bid[]>(initialBids);
    const [loading, setLoading] = useState(initialBids.length === 0);

    useEffect(() => {
        if (selectedCategory === initialCategory && initialBids.length > 0) {
            setBids(initialBids);
            setLoading(false);
            return;
        }

        let isMounted = true;
        setLoading(true);

        const fetchBids = async () => {
            try {
                const res = await fetch(`/api/ad-bids?category=${selectedCategory}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const json = await res.json();
                if (json.success && isMounted) {
                    setBids(json.data.bids || []);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchBids();

        return () => {
            isMounted = false;
        };
    }, [selectedCategory, initialCategory, initialBids]);

    const globalTop = bids.length > 0 ? bids[0] : null;
    const categoryOthers = bids.slice(1, 10);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4">
                    <span className="material-symbols-outlined mr-2 text-brand-primary">analytics</span>
                    現在の入札状況プレビュー
                </h3>

                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat
                                ? "bg-brand-dark text-white shadow-md"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">1位: サイト全体ヘッダー</h4>
                            {globalTop ? (
                                <div className="border-2 border-amber-400 rounded-lg p-3 bg-amber-50 flex flex-col md:flex-row gap-4 items-center">
                                    <div className="w-full md:w-64 h-24 bg-gray-200 rounded relative overflow-hidden flex-shrink-0">
                                        <Image src={globalTop.imageUrl} alt={globalTop.advertiserName || "Ad"} fill className="object-cover" sizes="(max-width: 768px) 100vw, 256px" />
                                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs px-2 py-1 rounded-bl font-bold z-10">👑 Global 1st</div>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="font-bold text-lg">{globalTop.advertiserName || globalTop.bidderUser?.nickname || "Unknown"}</div>
                                        <div className="text-amber-700 font-medium">現在の入札額: ${globalTop.bidAmount.toLocaleString()} / 月</div>
                                    </div>
                                </div>
                            ) : (
                                <EmptySlot rank="1" title="サイト全体ヘッダー（全画面表示）" price="$30" isGlobal />
                            )}
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">2位〜10位: {selectedCategory} カテゴリ内表示</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({ length: 9 }).map((_, index) => {
                                    const rank = index + 2;
                                    const bid = categoryOthers[index];

                                    if (bid) {
                                        return (
                                            <div key={bid.id} className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow">
                                                <div className="font-bold text-brand-primary mb-2">第{rank}位</div>
                                                <div className="aspect-video bg-gray-100 rounded mb-3 overflow-hidden relative">
                                                    <Image src={bid.imageUrl} alt={bid.advertiserName || "Ad"} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                                </div>
                                                <div className="font-bold truncate">{bid.advertiserName || bid.bidderUser?.nickname || "Unknown"}</div>
                                                <div className="text-sm text-gray-600">${bid.bidAmount.toLocaleString()}</div>
                                            </div>
                                        );
                                    }

                                    return <EmptySlot key={`empty-${rank}`} rank={rank.toString()} title={`カテゴリ内枠`} price="$30" />;
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 動的入札フォーム部分 */}
            <div className="p-6 bg-brand-dark border-t border-gray-200 mt-4 rounded-b-xl">
                <h3 className="text-white font-bold tracking-wider text-center mb-1">【{selectedCategory}】カテゴリに入札</h3>
                <p className="text-brand-accent text-xs text-center mb-6">入札額に応じてランキング上位から自動掲載されます。</p>
                <form action="/api/checkoutUser" method="POST" className="w-full max-w-2xl mx-auto bg-white/5 p-6 md:p-8 rounded-xl border border-white/10">
                    <input type="hidden" name="category" value={selectedCategory} />

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">入札額 (USD 月額 / 10ドル単位)</label>
                        <div className="flex items-center">
                            <span className="text-2xl text-white mr-3 font-bold">$</span>
                            <input
                                type="number"
                                name="bidAmount"
                                min={bids.length >= 10 ? Math.ceil((bids[9].bidAmount + 1) / 10) * 10 : 30}
                                step="10"
                                defaultValue={globalTop ? Math.ceil((globalTop.bidAmount + 10) / 10) * 10 : 30}
                                required
                                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white text-xl font-bold focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all placeholder-white/30"
                            />
                        </div>
                        <p className="text-gray-400 text-xs mt-2">
                            ※ 最低入札額: ${bids.length >= 10 ? Math.ceil((bids[9].bidAmount + 1) / 10) * 10 : 30}（空き枠がない場合、ランクインに必要な最低額が表示されます）
                        </p>
                    </div>

                    <div className="bg-brand-primary/20 border border-brand-primary/30 p-4 rounded-lg mb-6 text-sm text-gray-200 leading-relaxed">
                        <p className="mb-2"><strong className="text-white">【重要なお知らせ】</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>入札額に基づくランキングで指定カテゴリの枠（最大10枠）を自動確保します。</li>
                            <li><strong>画像・遷移先URL等の広告設定は、決済完了後に専用ダッシュボードでおこなっていただきます。</strong></li>
                            <li className="text-amber-300">他社のさらなる入札により順位が下落、または10枠から押し出された（Outbidされた）場合でも、<strong>決済済みの料金の返金は行われません</strong>。必ずご理解の上ご入札ください。</li>
                        </ul>
                    </div>

                    <button type="submit" className="w-full bg-brand-accent hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-brand-accent/20 text-lg flex items-center justify-center">
                        <span className="material-symbols-outlined mr-2">payment</span>
                        入札して決済へ進む
                    </button>
                    <p className="text-white/40 text-xs text-center mt-3">※Stripeの安全な決済ページへ遷移します。</p>
                </form>
            </div>
        </div>
    );
}

function EmptySlot({ rank, title, price, isGlobal = false }: { rank: string, title: string, price: string, isGlobal?: boolean }) {
    return (
        <div className={`border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center h-full min-h-[140px] ${isGlobal ? "border-amber-300 bg-amber-50/30 w-full" : "border-gray-300 bg-gray-50"
            }`}>
            <div className={`font-bold text-lg mb-1 ${isGlobal ? "text-amber-600" : "text-gray-400"}`}>
                第{rank}位 空き枠
            </div>
            <div className="text-sm text-gray-500 mb-2">{title}</div>
            <div className="text-xs font-medium text-brand-accent bg-brand-accent/10 px-2 py-1 rounded">最低入札額: {price}〜</div>
        </div>
    );
}
