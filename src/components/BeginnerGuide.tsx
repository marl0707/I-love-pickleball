import Link from 'next/link';

export default function BeginnerGuide() {
    const steps = [
        {
            num: "01",
            title: "ピックルボールとは？",
            desc: "3分でわかる基本",
            icon: "help",
            href: "/articles" // TODO: 初心者向け記事へのリンクに差し替え
        },
        {
            num: "02",
            title: "コートを探す",
            desc: "近くの施設を検索",
            icon: "location_on",
            href: "/facilities"
        },
        {
            num: "03",
            title: "道具を選ぶ",
            desc: "初心者向けパドル",
            icon: "sports_tennis",
            href: "/gears"
        },
        {
            num: "04",
            title: "イベントに参加",
            desc: "体験会から始めよう",
            icon: "event",
            href: "/events"
        }
    ];

    return (
        <section className="bg-gradient-to-r from-brand-sub to-brand-dark py-10 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-[0.03] rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-brand-accent opacity-10 rounded-full blur-xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-10">
                    <span className="text-brand-accent text-xs font-bold tracking-[0.2em] uppercase mb-2 block" style={{ fontFamily: "'Inter', sans-serif" }}>Get Started</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">🔰 Pickelball 101</h2>
                    <p className="text-white/80 text-sm">ピックルボールを始めたい方は、まずはここからスタート！</p>
                </div>

                <div className="flex justify-center">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-0 w-full max-w-5xl relative">
                        {/* Desktop Progress Line */}
                        <div className="hidden md:block absolute top-[2.5rem] left-[12%] right-[12%] h-[2px] bg-white/10 -z-10"></div>

                        {steps.map((step, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center group relative">
                                {/* Connector for mobile */}
                                {index !== 0 && (
                                    <div className="md:hidden absolute -top-4 w-px h-4 bg-white/20"></div>
                                )}

                                <Link href={step.href} className="flex flex-col items-center w-full focus:outline-none">
                                    <div className="w-[5rem] h-[5rem] rounded-full bg-black/20 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-brand-accent group-hover:border-brand-accent transition-all duration-300 shadow-xl group-hover:shadow-brand-accent/50 group-hover:-translate-y-1 relative">
                                        <span className="material-symbols-outlined text-white text-3xl group-hover:scale-110 transition-transform">{step.icon}</span>
                                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-dark text-white text-[9px] font-bold flex items-center justify-center border-2 border-brand-sub shadow-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                                            {step.num}
                                        </div>
                                    </div>
                                    <h3 className="text-white font-medium text-[15px] mb-1 group-hover:text-brand-accent transition-colors">{step.title}</h3>
                                    <p className="text-white/50 text-xs text-center">{step.desc}</p>
                                </Link>

                                {/* Arrow indicator for desktop */}
                                {index !== steps.length - 1 && (
                                    <div className="hidden md:block absolute top-[28px] -right-3 text-white/20 material-symbols-outlined text-xl z-0 pointer-events-none">
                                        double_arrow
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
