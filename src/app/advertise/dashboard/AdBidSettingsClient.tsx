"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdBid {
    id: string;
    category: string;
    bidAmount: number;
    advertiserName: string | null;
    targetUrl: string | null;
    imageUrl: string | null;
    status: string;
    createdAt: Date;
}

export default function AdBidSettingsClient({ initialBids }: { initialBids: AdBid[] }) {
    const [bids, setBids] = useState<AdBid[]>(initialBids);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const [editForm, setEditForm] = useState({
        advertiserName: "",
        targetUrl: "",
        imageUrl: ""
    });

    const startEdit = (bid: AdBid) => {
        setEditingId(bid.id);
        setEditForm({
            advertiserName: bid.advertiserName && bid.advertiserName !== "名称未設定" ? bid.advertiserName : "",
            targetUrl: bid.targetUrl && bid.targetUrl !== "#" ? bid.targetUrl : "",
            imageUrl: bid.imageUrl && !bid.imageUrl.includes("placehold.co") ? bid.imageUrl : ""
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const handleSave = async (id: string) => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/ad-bids/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    advertiserName: editForm.advertiserName || "名称未設定",
                    targetUrl: editForm.targetUrl || "#",
                    imageUrl: editForm.imageUrl || "https://placehold.co/600x400/png?text=Your+Ad+Here",
                }),
            });

            if (res.ok) {
                const updated = await res.json();
                setBids(bids.map(b => b.id === id ? updated.bid : b));
                setEditingId(null);
                router.refresh();
                alert("設定を保存しました。");
            } else {
                alert("保存に失敗しました。");
            }
        } catch (error) {
            console.error(error);
            alert("エラーが発生しました。");
        } finally {
            setIsSaving(false);
        }
    };

    if (bids.length === 0) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <span className="material-symbols-outlined text-3xl">inbox</span>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">現在入札中の広告はありません</h3>
                <p className="text-gray-500 mb-6">入札を行うと、ここに広告枠の設定が表示されます。</p>
                <button
                    onClick={() => router.push('/advertise')}
                    className="bg-brand-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-accent transition-colors"
                >
                    広告オークションを見る
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {bids.map((bid) => {
                const isEditing = editingId === bid.id;
                const isUnset = bid.advertiserName === "名称未設定" || !bid.advertiserName;

                return (
                    <div key={bid.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="flex flex-col md:flex-row border-b border-gray-100 p-4 md:p-6 justify-between items-start md:items-center bg-gray-50/50">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded-full">
                                        カテゴリ: {bid.category}
                                    </span>
                                    <span className={`px-3 py-1 font-bold text-xs rounded-full ${bid.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        ステータス: {bid.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold">
                                    月額入札額: <span className="text-brand-primary text-xl">${bid.bidAmount.toLocaleString()}</span>
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    ご入札日: {new Date(bid.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => startEdit(bid)}
                                    className={`mt-4 md:mt-0 px-6 py-2 rounded-lg font-bold text-sm transition-colors ${isUnset
                                            ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md animate-pulse"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                                        }`}
                                >
                                    {isUnset ? "広告素材を設定する (必須)" : "設定を編集する"}
                                </button>
                            )}
                        </div>

                        <div className="p-4 md:p-6">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">スポンサー(広告主)名 <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={editForm.advertiserName}
                                            onChange={(e) => setEditForm({ ...editForm, advertiserName: e.target.value })}
                                            placeholder="例: ピックルボール東京"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/50 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">リンク先URL <span className="text-red-500">*</span></label>
                                        <input
                                            type="url"
                                            value={editForm.targetUrl}
                                            onChange={(e) => setEditForm({ ...editForm, targetUrl: e.target.value })}
                                            placeholder="https://example.com"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/50 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">バナー画像URL <span className="text-red-500">*</span></label>
                                        <div className="flex gap-2 items-start mb-2">
                                            <input
                                                type="url"
                                                value={editForm.imageUrl}
                                                onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                                                placeholder="https://... (推奨サイズ 横600px 縦400px以上)"
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/50 outline-none"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">※画像をお持ちでない場合は画像のURLをご自身でご用意いただくか、サポートへお問い合わせください。</p>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={cancelEdit}
                                            disabled={isSaving}
                                            className="px-5 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-medium"
                                        >
                                            キャンセル
                                        </button>
                                        <button
                                            onClick={() => handleSave(bid.id)}
                                            disabled={isSaving || !editForm.advertiserName || !editForm.targetUrl || !editForm.imageUrl}
                                            className="px-6 py-2 rounded-lg text-white bg-brand-primary hover:bg-blue-700 font-bold disabled:opacity-50 flex items-center"
                                        >
                                            {isSaving ? (
                                                <><span className="material-symbols-outlined animate-spin mr-2 text-sm">refresh</span> 保存中...</>
                                            ) : (
                                                <><span className="material-symbols-outlined mr-2 text-sm">save</span> 保存する</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-1/3 aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative flex-shrink-0">
                                        {bid.imageUrl && !bid.imageUrl.includes("placehold.co") ? (
                                            <img src={bid.imageUrl} alt="Ad Banner" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                                <span className="material-symbols-outlined text-4xl mb-2">image_not_supported</span>
                                                <span className="text-sm font-medium">画像未設定</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold mb-1">スポンサー(広告主)名</p>
                                            <p className={`text-base font-bold ${isUnset ? 'text-amber-500' : 'text-gray-900'}`}>
                                                {bid.advertiserName || "未設定"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold mb-1">リンク先URL</p>
                                            {bid.targetUrl && bid.targetUrl !== "#" ? (
                                                <a href={bid.targetUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all flex items-center">
                                                    {bid.targetUrl} <span className="material-symbols-outlined text-[14px] ml-1">open_in_new</span>
                                                </a>
                                            ) : (
                                                <p className="text-sm text-amber-500 font-bold">未設定</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
