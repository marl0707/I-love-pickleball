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
            const res = await fetch("/pickleball/api/ad-bids/update", {
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

    return (
        <section className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="bg-brand-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-brand-primary">
                        <span className="material-symbols-outlined">campaign</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">広告入札 管理ダッシュボード</h2>
                        <p className="text-sm text-gray-500 mt-0.5">現在運用中・入札中の広告設定を管理できます</p>
                    </div>
                </div>
                <div className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600">
                    計: <span className="font-bold text-gray-900">{bids.length}</span> 件
                </div>
            </div>

            {bids.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-400 mb-4 shadow-sm">
                        <span className="material-symbols-outlined text-3xl">inbox</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">現在入札中の広告はありません</h3>
                    <p className="text-gray-500 text-sm max-w-sm mb-6">入札を行うと、ここに広告枠の設定が表示されます。</p>
                    <button onClick={() => router.push('/advertise')} className="bg-brand-primary hover:bg-brand-accent text-white font-bold py-2.5 px-6 rounded-full transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                        広告オークションを見る
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bids.map(bid => {
                        const isUnset = !bid.advertiserName || bid.advertiserName === "名称未設定" || !bid.targetUrl || bid.targetUrl === "#" || !bid.imageUrl || bid.imageUrl.includes("placehold.co");

                        return (
                            <div key={bid.id} className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col lg:flex-row group">
                                {/* 左側：プレビューカード */}
                                <div className="w-full lg:w-[320px] bg-slate-50 border-b lg:border-b-0 lg:border-r border-gray-200 p-5 flex flex-col relative overflow-hidden">
                                    {/* 背景の装飾 */}
                                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand-primary/5 rounded-full blur-xl" />

                                    <div className="relative z-10 flex justify-between items-start mb-4">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full text-white shadow-sm flex items-center gap-1
                                        ${bid.status === 'ACTIVE' ? 'bg-emerald-500' : bid.status === 'OUTBID' ? 'bg-rose-500' : 'bg-slate-500'}`}>
                                            <span className="material-symbols-outlined text-[12px]">
                                                {bid.status === 'ACTIVE' ? 'check_circle' : bid.status === 'OUTBID' ? 'warning' : 'block'}
                                            </span>
                                            {bid.status === 'ACTIVE' ? '掲載中（1位）' : bid.status === 'OUTBID' ? 'ランク外（表示なし）' : bid.status}
                                        </span>
                                    </div>

                                    <div className="relative z-10 flex-1 flex flex-col justify-center">
                                        <div className="text-xs text-gray-500 mb-1 font-medium">参加カテゴリ</div>
                                        <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-800 w-fit mb-5 shadow-sm">
                                            <span className="material-symbols-outlined text-[16px] text-brand-primary">category</span>
                                            {bid.category}
                                        </div>

                                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                                            <div className="text-xs text-gray-500 mb-1 font-medium">現在の入札額</div>
                                            <div className="flex items-baseline gap-1 text-brand-primary">
                                                <span className="text-sm font-bold">$</span>
                                                <span className="text-3xl font-black tracking-tight">{bid.bidAmount}</span>
                                                <span className="text-xs text-gray-500 font-medium">/月額</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 右側：詳細・編集フォーム */}
                                <div className="w-full lg:flex-1 p-6 lg:p-8 flex flex-col justify-center bg-white relative">
                                    {editingId === bid.id ? (
                                        <div className="space-y-5 animate-fade-in">
                                            <div className="flex items-center gap-2 mb-2 pb-3 border-b border-gray-100">
                                                <span className="material-symbols-outlined text-brand-primary">edit_document</span>
                                                <h3 className="font-bold text-gray-900">広告内容の編集</h3>
                                            </div>

                                            <div className="grid gap-5">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                                        スポンサー(広告主)名 <span className="text-rose-500">*</span>
                                                    </label>
                                                    <input type="text" name="advertiserName" value={editForm.advertiserName} onChange={(e) => setEditForm(prev => ({ ...prev, advertiserName: e.target.value }))}
                                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary focus:bg-white transition-colors outline-none"
                                                        placeholder="例: ピックルボール東京" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                                        リンク先URL <span className="text-rose-500">*</span>
                                                    </label>
                                                    <input type="url" name="targetUrl" value={editForm.targetUrl} onChange={(e) => setEditForm(prev => ({ ...prev, targetUrl: e.target.value }))}
                                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary focus:bg-white transition-colors outline-none"
                                                        placeholder="https://example.com" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                                        バナー画像URL <span className="text-rose-500">*</span>
                                                    </label>
                                                    <input type="url" name="imageUrl" value={editForm.imageUrl} onChange={(e) => setEditForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary focus:bg-white transition-colors outline-none"
                                                        placeholder="https://... (推奨サイズ 横600px 縦400px以上)" />
                                                    <p className="text-xs text-gray-500 mt-1.5">※画像をお持ちでない場合は画像のURLをご自身でご用意いただくか、サポートへお問い合わせください。</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                                <button onClick={() => handleSave(bid.id)} disabled={isSaving || !editForm.advertiserName || !editForm.targetUrl || !editForm.imageUrl}
                                                    className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-accent disabled:opacity-50 transition-colors flex items-center justify-center min-w-[120px]">
                                                    {isSaving ? (
                                                        <><span className="material-symbols-outlined animate-spin mr-1.5 text-[18px]">sync</span> 保存中...</>
                                                    ) : '設定を保存する'}
                                                </button>
                                                <button onClick={cancelEdit} disabled={isSaving}
                                                    className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-colors">
                                                    キャンセル
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col h-full justify-between">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-5">
                                                    <div>
                                                        <div className="text-xs text-gray-500 mb-1 font-medium">スポンサー(広告主)名</div>
                                                        <div className="font-bold text-gray-900 text-lg">{bid.advertiserName || "未設定"}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 mb-1 font-medium">リンク先URL</div>
                                                        {bid.targetUrl && bid.targetUrl !== "#" ? (
                                                            <a href={bid.targetUrl} target="_blank" rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors group-hover:underline decoration-blue-300 underline-offset-4 break-all">
                                                                <span className="material-symbols-outlined text-[16px]">link</span>
                                                                {bid.targetUrl}
                                                            </a>
                                                        ) : (
                                                            <div className="text-sm font-bold text-gray-400">未設定</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 mb-1.5 font-medium">現在のバナー画像</div>
                                                        <div className="w-full max-w-[200px] aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group/img">
                                                            {bid.imageUrl && !bid.imageUrl.includes("placehold.co") ? (
                                                                <>
                                                                    <img src={bid.imageUrl} alt="Ad Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" />
                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                                        <a href={bid.imageUrl} target="_blank" rel="noopener noreferrer" className="bg-white/90 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-white">
                                                                            <span className="material-symbols-outlined text-[14px]">open_in_new</span> 拡大
                                                                        </a>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                                                    <span className="material-symbols-outlined mb-1">image_not_supported</span>
                                                                    <span className="text-[10px] font-medium">画像未設定</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-5 mt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                {isUnset ? (
                                                    <div className="text-amber-700 text-xs font-bold flex items-center bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                                                        <span className="material-symbols-outlined text-sm mr-1.5">error</span>
                                                        表示に必要な情報が未設定です
                                                    </div>
                                                ) : (
                                                    <div className="text-emerald-700 text-xs font-bold flex items-center bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                                                        <span className="material-symbols-outlined text-sm mr-1.5">check_circle</span>
                                                        設定完了（表示準備OK）
                                                    </div>
                                                )}

                                                <button onClick={() => startEdit(bid)}
                                                    className={`px-5 py-2.5 text-sm font-bold rounded-full transition-colors flex items-center justify-center shadow-sm w-full sm:w-auto ${isUnset ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                                                    <span className="material-symbols-outlined text-sm mr-1.5">edit</span> {isUnset ? '広告素材を設定する (必須)' : '設定を編集する'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
