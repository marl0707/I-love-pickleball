import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import AdAuctionPreview from '@/components/AdAuctionPreview'
import { getRankedAdBids } from '@/lib/ad-bids'

export const metadata = {
    title: '広告掲載・スポンサー募集 | I LOVE PICKLEBALL',
}

const CATEGORIES = ["Facility", "Gear", "Event", "Instructor", "Other"];

export default async function AdvertisePage() {
    // SSRで初期データとして施設カテゴリのランキングを取得
    const initialFacilityBids = await getRankedAdBids('Facility');

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* ヒーローセクション */}
            <section className="bg-brand-dark text-white py-20 px-4 text-center relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-brand-accent text-xs tracking-[0.3em] uppercase mb-4 font-semibold">SPONSOR & ADVERTISE</p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-widest leading-tight">
                        ピックルボール市場の熱狂を、<br />あなたのビジネスへ。
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        国内最大級のピックルボール専門メディア「I LOVE PICKLEBALL」は、<br className="hidden md:block" />純度の高いプレイヤー層へのダイレクトなリーチを実現します。<br />
                        透明性の高い<span className="text-white font-bold tracking-wider">完全入札制（リアルタイムオークション方式）</span>で、<br className="hidden md:block" />予算に合わせた柔軟で強力なプロモーションが可能です。
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 max-w-5xl mt-12 space-y-16">

                {/* メディアの特徴・メリット */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                            なぜ <span className="text-brand-accent">I LOVE PICKLEBALL</span> なのか？
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-emerald-100 text-brand-accent p-2.5 rounded-xl shadow-sm">
                                    <span className="material-symbols-outlined text-[20px]">target</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-1">極めて高いターゲティング精度</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">コートを探しているユーザー、最新ギアを求めているユーザーが直接アクセスするため、一般的なWeb広告と比較して非常に高いコンバージョン率が期待できます。</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-emerald-100 text-brand-accent p-2.5 rounded-xl shadow-sm">
                                    <span className="material-symbols-outlined text-[20px]">trending_up</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-1">急成長市場のアーリーアダプター</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">日本において爆発的な普及フェーズにあるピックルボール。本サイトのユーザーは、新製品や新施設への投資意欲が高いコアなアーリーアダプター層が中心です。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-100/50 rounded-2xl p-8 border border-gray-100 shadow-inner">
                        <h3 className="font-bold text-gray-800 mb-4 text-center text-sm tracking-wider uppercase">広告表示のイメージ</h3>
                        <div className="bg-white p-4 rounded-xl border border-brand-accent/40 shadow-sm relative">
                            <div className="absolute top-0 right-0 bg-brand-accent text-white text-[9px] font-bold px-3 py-0.5 rounded-bl-lg tracking-wider">PR / SPONSOR</div>
                            <div className="flex items-center gap-4 opacity-100">
                                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center text-brand-accent flex-shrink-0">
                                    <span className="material-symbols-outlined text-2xl">campaign</span>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-xs text-gray-500 mt-5 leading-relaxed">
                            各カテゴリ（施設一覧・ギア特集など）の目立つ検索上部位置に最優先表示され、確実な認知を獲得します。
                        </p>
                    </div>
                </section>

                {/* 仕組みの解説 */}
                <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-brand-accent/20 relative overflow-hidden text-center">
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">シンプルで公平な入札システム</h2>
                    <p className="text-gray-500 text-sm mb-12 relative z-10">最低額 $35/月から。オンラインで即時掲載手続きが完了します。</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                        <div className="space-y-5">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                <span className="material-symbols-outlined text-[28px]">category</span>
                            </div>
                            <h3 className="font-bold text-base text-gray-900">1. ターゲットの選択</h3>
                            <p className="text-gray-600 text-xs leading-relaxed text-left">全国のコート情報を調べるユーザー向けの<span className="font-bold text-brand-dark">「施設・コート枠」</span>、パドル等を探すユーザー向けの<span className="font-bold text-brand-dark">「ギア・用具枠」</span>など、PRしたい商材に合わせたカテゴリを選びます。</p>
                        </div>
                        <div className="space-y-5 relative">
                            <div className="hidden md:block absolute top-8 -left-8 w-16 h-px bg-gray-200"></div>
                            <div className="w-16 h-16 bg-orange-50 text-orange-600 border border-orange-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                <span className="material-symbols-outlined text-[28px]">gavel</span>
                            </div>
                            <h3 className="font-bold text-base text-gray-900">2. 金額を決めて入札</h3>
                            <p className="text-gray-600 text-xs leading-relaxed text-left">各カテゴリの現在の『トップ入札額』はリアルタイムで公開されています。競合の金額を確認しながら、自社の予算や戦略に応じた入札額（月額）を設定してください。</p>
                        </div>
                        <div className="space-y-5 relative">
                            <div className="hidden md:block absolute top-8 -left-8 w-16 h-px bg-gray-200"></div>
                            <div className="w-16 h-16 bg-emerald-50 text-brand-accent border border-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                <span className="material-symbols-outlined text-[28px]">rocket_launch</span>
                            </div>
                            <h3 className="font-bold text-base text-gray-900">3. 即座に掲載開始</h3>
                            <p className="text-gray-600 text-xs leading-relaxed text-left">Stripeを利用した安全なクレジットカード決済完了後、あなたが<span className="font-bold text-brand-accent">最高額入札者（1位〜10位）</span>であれば、すぐに対象一覧ページへと自動掲載されます。</p>
                        </div>
                    </div>
                </section>

                {/* ランキング・プレビュー表示 */}
                <section>
                    <AdAuctionPreview
                        categories={CATEGORIES}
                        initialCategory="Facility"
                        initialBids={initialFacilityBids as any}
                    />
                </section>

            </div>
        </div>
    )
}
