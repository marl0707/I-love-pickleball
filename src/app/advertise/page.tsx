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
                        透明性の高い<span className="text-white font-bold tracking-wider">カテゴリ別10枠入札制（オークション方式）</span>で、<br className="hidden md:block" />さらに<strong className="text-brand-accent">総合1位を獲得するとトップページも独占</strong>できる強力なプロモーションが可能です。
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
                        <h3 className="font-bold text-gray-800 mb-4 text-center text-sm tracking-wider uppercase">広告表示の仕組み</h3>
                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-xl border border-brand-accent/40 shadow-sm relative">
                                <div className="absolute top-0 right-0 bg-brand-accent text-white text-[9px] font-bold px-3 py-0.5 rounded-bl-lg tracking-wider">👑 総合1位 (全部門トップ)</div>
                                <p className="text-sm font-bold text-gray-800">トップページ＆全カテゴリ最上位を独占</p>
                                <p className="text-xs text-gray-500 mt-1">全ての入札の中で単独1位になると、サイトの顔であるトップページ最上部に表示されます。</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative">
                                <div className="absolute top-0 right-0 bg-gray-500 text-white text-[9px] font-bold px-3 py-0.5 rounded-bl-lg tracking-wider">🌟 カテゴリ内 2位〜10位</div>
                                <p className="text-sm font-bold text-gray-800">各カテゴリページの上部・サイドバー</p>
                                <p className="text-xs text-gray-500 mt-1">ターゲットに直結する各カテゴリ（施設一覧・ギア特集など）の専用枠（最大10枠）に順位に応じて表示されます。</p>
                            </div>
                        </div>
                        <p className="text-center text-xs text-gray-500 mt-5 leading-relaxed">
                            確実な認知を獲得するため、まずは関連カテゴリでのランクイン（10位以内）を目指してください。
                        </p>
                    </div>
                </section>

                {/* 仕組みの解説 */}
                <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-brand-accent/20 relative overflow-hidden text-center">
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">シンプルで公平な入札システム</h2>
                    <p className="text-gray-500 text-sm mb-12 relative z-10">最低額 $30/月から。オンラインで即時掲載手続きが完了します。</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        <div className="flex items-start gap-4 text-left">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm">
                                <span className="material-symbols-outlined text-[24px]">category</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-gray-900 mb-2">1. ターゲットの選択</h3>
                                <p className="text-gray-600 text-xs leading-relaxed">全国のコート情報を調べるユーザー向けの<span className="font-bold text-brand-dark">「施設・コート枠」</span>、パドル等を探すユーザー向けの<span className="font-bold text-brand-dark">「ギア・用具枠」</span>など、PRしたい商材に合わせたカテゴリを選びます。</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 text-left relative">
                            <div className="hidden md:block absolute top-7 -left-6 w-8 h-px bg-gray-200"></div>
                            <div className="w-14 h-14 bg-orange-50 text-orange-600 border border-orange-100 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm">
                                <span className="material-symbols-outlined text-[24px]">gavel</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-gray-900 mb-2">2. 金額を決めて入札</h3>
                                <p className="text-gray-600 text-xs leading-relaxed">各カテゴリの現在の『トップ入札額』はリアルタイムで公開されています。競合の金額を確認しながら、自社の予算や戦略に応じた入札額（月額）を設定してください。</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 text-left relative">
                            <div className="hidden md:block absolute top-7 -left-6 w-8 h-px bg-gray-200"></div>
                            <div className="w-14 h-14 bg-emerald-50 text-brand-accent border border-emerald-100 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm">
                                <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-gray-900 mb-2">3. 即座に掲載開始</h3>
                                <p className="text-gray-600 text-xs leading-relaxed">Stripeのセキュアなクレジットカード決済が完了すると枠を確保します。その後、専用の<strong className="text-brand-accent text-sm">企業ダッシュボード</strong>から広告画像やリンク先URLを自由に設定・変更できます。ランク内（10位以内）であれば即座にサイト上へ反映されます。</p>
                            </div>
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

                {/* Dashboard CTA */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center justify-center p-6 bg-white rounded-2xl border shadow-sm max-w-2xl mx-auto w-full">
                        <div className="flex flex-col sm:flex-row items-center justify-between w-full">
                            <div className="text-left mb-4 sm:mb-0">
                                <h3 className="text-xl font-bold mb-1 text-gray-900">広告設定ダッシュボード</h3>
                                <p className="text-gray-500">掲載中の広告の管理や、画像のアップロードはこちらから。</p>
                            </div>
                            <Link href="/advertise/dashboard" className="inline-flex items-center justify-center rounded-md font-medium bg-brand-dark text-white hover:bg-emerald-700 h-12 px-6 transition-colors shadow-sm">
                                <span className="material-symbols-outlined mr-2 text-[20px]">bar_chart</span>
                                ダッシュボードへ
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
