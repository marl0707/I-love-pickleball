// トップページ — I LOVE PICKLEBALL
export const revalidate = 3600; // ISR: 1時間キャッシュ
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import AdSlot from "@/components/AdSlot";
import { prisma } from "@/lib/prisma";

// フォールバック画像
const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1622396342880-9280d9aa3ac9?q=80&w=800&auto=format&fit=crop";

function getBadgeBg(category: string): string {
  const map: Record<string, string> = {
    "News": "bg-black",
    "Rules": "bg-blue-900",
    "Gear": "bg-gray-600",
    "Facilities": "bg-brand-dark",
  };
  return map[category] || "bg-gray-700";
}

async function getHomeData() {
  try {
    const [facilities, gears, players, articles] = await Promise.all([
      prisma.facility.findMany({
        take: 10,
        select: { id: true, name: true, mainPhotoUrl: true, address: true },
      }),
      prisma.gearPaddle.findMany({
        take: 10,
        select: { id: true, productName: true, imageUrl: true, brandName: true },
      }),
      prisma.proPlayer.findMany({
        take: 10,
        select: { id: true, nameJa: true, photoUrl: true },
      }),
      prisma.article.findMany({
        where: { status: { in: ["PUBLISHED", "published"] } },
        orderBy: { publishedAt: "desc" },
        take: 10,
        select: { id: true, slug: true, title: true, category: true, thumbnailUrl: true, content: true, publishedAt: true },
      }),
    ]);

    const getRandomItem = <T,>(items: T[]): T | null => (items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null);

    const randomFacility = getRandomItem(facilities);
    const randomGear = getRandomItem(gears);
    const randomPlayer = getRandomItem(players);
    const randomArticle = getRandomItem(articles);

    const editorsPick = [
      randomFacility ? { label: "Courts", title: randomFacility.name, img: randomFacility.mainPhotoUrl || PLACEHOLDER_IMG, href: `/facilities/${randomFacility.id}`, tag: "Facility" } : null,
      randomGear ? { label: "Gears", title: randomGear.productName, img: randomGear.imageUrl || PLACEHOLDER_IMG, href: `/gear/${randomGear.id}`, tag: randomGear.brandName } : null,
      randomPlayer ? { label: "Players", title: randomPlayer.nameJa, img: randomPlayer.photoUrl || PLACEHOLDER_IMG, href: `/players/${randomPlayer.id}`, tag: "Pro Player" } : null,
      randomArticle ? { label: "Articles", title: randomArticle.title, img: randomArticle.thumbnailUrl || PLACEHOLDER_IMG, href: `/articles/${randomArticle.slug}`, tag: randomArticle.category || "News" } : null,
    ].filter(Boolean) as { label: string; title: string; img: string; href: string; tag: string }[];

    const latestArticles = articles.slice(0, 3).map((a) => ({
      title: a.title,
      slug: a.slug,
      category: a.category || "News",
      img: a.thumbnailUrl || PLACEHOLDER_IMG,
      date: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("ja-JP") : "",
      desc: a.content?.replace(/<[^>]+>/g, '').slice(0, 100) || "",
    }));

    const gearNews = await prisma.article.findMany({
      where: {
        status: { in: ["PUBLISHED", "published"] },
        category: { in: ['Gear', 'Equipment', 'パドル', 'シューズ', '初心者ガイド'] }
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { slug: true, title: true, thumbnailUrl: true, publishedAt: true },
    });

    return { editorsPick, latestArticles, gearNews };
  } catch (e) {
    console.error("トップページデータ取得エラー:", e);
    return { editorsPick: [], latestArticles: [], gearNews: [] };
  }
}

export default async function HomePage() {
  const { editorsPick, latestArticles, gearNews } = await getHomeData();

  return (
    <div className="bg-white text-gray-900" style={{ fontFamily: "'Noto Sans JP', 'Shippori Mincho', serif" }}>
      {/* ========== メインコンテンツ ========== */}

      {/* 広告バナー */}
      <div className="bg-gray-50 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <AdSlot slot="header-banner" />
        </div>
      </div>

      {/* ===== ヒーローセクション（動的スライドショー） ===== */}
      <HeroSlider />

      {/* ===== Editor's Pick ===== */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl italic text-gray-800 mb-4">Editor&apos;s Pick</h2>
            <div className="w-12 h-px bg-gray-400 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {editorsPick.map((item, i) => (
              <Link key={i} href={item.href} className="group cursor-pointer block">
                <div className="aspect-[3/4] overflow-hidden mb-4 relative bg-gray-200">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${item.img}')` }}
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 text-[10px] uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>{item.label}</div>
                </div>
                <h3 className="text-base font-medium leading-relaxed text-gray-800 group-hover:text-brand-accent transition-colors text-center px-2">{item.title}</h3>
                <p className="text-xs text-center text-brand-accent mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>{item.tag}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Latest News + サイドバー ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* メインコンテンツ */}
          <div className="flex-1 w-full lg:w-3/4">
            <div className="flex items-end justify-between mb-10 border-b border-gray-200 pb-4">
              <h2 className="text-3xl text-gray-800 italic">Latest Articles</h2>
              <Link className="text-xs tracking-widest text-gray-500 hover:text-brand-accent" href={`/articles`} style={{ fontFamily: "'Inter', sans-serif" }}>すべての記事を見る</Link>
            </div>
            <div className="space-y-12">
              {latestArticles.map((article, i) => (
                <Link key={i} href={`/articles/${article.slug}`} className="flex flex-col md:flex-row gap-8 group block">
                  <div className="w-full md:w-64 aspect-[4/3] overflow-hidden bg-gray-200">
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${article.img}')` }} />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-[10px] font-bold tracking-widest uppercase text-white ${getBadgeBg(article.category)} px-2 py-1`} style={{ fontFamily: "'Inter', sans-serif" }}>{article.category}</span>
                      <time className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{article.date}</time>
                    </div>
                    <h3 className="text-xl md:text-2xl font-medium text-gray-800 mb-3 group-hover:text-brand-accent transition-colors leading-snug">{article.title}</h3>
                    <p className="text-sm text-gray-500 leading-loose line-clamp-2 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>{article.desc}</p>
                    <span className="text-xs font-bold tracking-widest text-gray-400 group-hover:text-brand-accent flex items-center gap-2">続きを読む <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span></span>
                  </div>
                </Link>
              ))}
              {latestArticles.length === 0 && (
                <p className="text-gray-400 text-center py-12">まだ記事がありません</p>
              )}
            </div>

            <div className="mt-16 text-center">
              <Link href={`/articles`} className="border border-gray-300 text-gray-600 px-10 py-3 text-sm tracking-widest hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all duration-300 inline-block" style={{ fontFamily: "'Inter', sans-serif" }}>
                もっと記事を見る
              </Link>
            </div>

            {/* ギア特集セクション */}
            <div className="mt-24 space-y-20">
              <section>
                <div className="flex flex-col items-center mb-10">
                  <span className="text-brand-accent text-sm tracking-widest uppercase mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Geaer</span>
                  <h2 className="text-2xl text-gray-800">最新ギア特集</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <Link href={`/gears`} className="md:col-span-2 relative group overflow-hidden h-[300px] bg-gray-200 block">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1622396342880-9280d9aa3ac9?q=80&w=800&auto=format&fit=crop')" }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-white text-xl font-medium mb-1">パドル徹底比較</h3>
                      <p className="text-white/80 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>2026年最新モデルからベストバイを見つける</p>
                    </div>
                  </Link>
                  <div className="flex flex-col gap-6">
                    {gearNews.length > 0 ? gearNews.map((article, idx) => {
                      const displayImg = article.thumbnailUrl || PLACEHOLDER_IMG;
                      return (
                        <Link key={idx} className="flex gap-4 group/item" href={`/articles/${article.slug}`}>
                          <div className="w-24 h-24 bg-cover bg-center shrink-0 bg-gray-200" style={{ backgroundImage: `url('${displayImg}')` }} />
                          <div>
                            <h4 className="text-sm font-medium text-gray-800 group-hover/item:text-brand-accent transition-colors line-clamp-2 leading-relaxed">{article.title}</h4>
                            <span className="text-[10px] text-gray-400 mt-1 block">
                              {article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 10).replace(/-/g, '.') : ''}
                            </span>
                          </div>
                        </Link>
                      );
                    }) : null}
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* サイドバー */}
          <aside className="w-full lg:w-1/4 space-y-12">
            {/* 広告枠 */}
            <AdSlot slot="sidebar-rectangle" />

            {/* Popular Ranking */}
            <div>
              <h3 className="text-xl italic text-gray-800 mb-6 border-b border-gray-200 pb-2">Popular Ranking</h3>
              <div className="space-y-6">
                {[
                  { rank: 1, rankBg: "bg-brand-accent", title: "プレースタイル別 最新パドルベスト5", img: "https://images.unsplash.com/photo-1622396342880-9280d9aa3ac9?q=80&w=200", href: "/articles" },
                  { rank: 2, rankBg: "bg-gray-400", title: "東京都内の無料コートガイド", img: "https://images.unsplash.com/photo-1554068865-24cecd4e34f8?q=80&w=200", href: "/articles" },
                  { rank: 3, rankBg: "bg-gray-400", title: "初心者が必ず覚えるべき5つのルール", img: "https://images.unsplash.com/photo-1526679262145-238d77cfc235?q=80&w=200", href: "/articles" },
                ].map((item) => (
                  <Link key={item.rank} href={item.href} className="flex gap-4 items-start relative group cursor-pointer block">
                    <span className={`absolute -left-2 -top-2 ${item.rankBg} text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full z-10`} style={{ fontFamily: "'Inter', sans-serif" }}>{item.rank}</span>
                    <div className="w-20 h-20 bg-cover bg-center shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300" style={{ backgroundImage: `url('${item.img}')` }} />
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 line-clamp-3 leading-relaxed group-hover:text-brand-accent transition-colors">{item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 広告 */}
            <AdSlot slot="sidebar-rectangle" />
          </aside>
        </div>
      </div>
    </div >
  );
}
