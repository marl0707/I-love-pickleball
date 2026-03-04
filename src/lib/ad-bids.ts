import { prisma } from './prisma'

export interface AdBidWithBidder {
  id: string;
  category: string;
  bidAmount: number;
  imageUrl: string;
  targetUrl: string;
  advertiserName: string;
  status: string;
  createdAt: Date;
  bidderUser: {
    nickname: string | null;
  };
}

/**
 * 広告入札のランキングを取得する関数。
 * - Rank 1: 全カテゴリの中で最も入札額が高い広告（グローバル1位）
 * - Rank 2〜10: 指定されたカテゴリにおける上位（グローバル1位を除いたもの）最大9件
 */
export async function getRankedAdBids(category: string): Promise<AdBidWithBidder[]> {
  try {
    // 1. グローバル1位（全カテゴリ中最高額）の取得
    const globalTopBid = await prisma.adBid.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { bidAmount: 'desc' },
      include: { bidderUser: { select: { nickname: true } } }
    });

    // 2. 指定カテゴリの上位取得（グローバル1位のIDは除外）
    const excludeIds = globalTopBid ? [globalTopBid.id] : [];
    
    // カテゴリが 'All' など、特定のカテゴリ指定がない場合は全体の2位から10位を取得
    const categoryFilter = category.toLowerCase() === 'all' || !category ? {} : { category: { equals: category, mode: 'insensitive' as any } };
    
    const categoryTopBids = await prisma.adBid.findMany({
      where: {
        ...categoryFilter,
        status: 'ACTIVE',
        id: { notIn: excludeIds }
      },
      orderBy: { bidAmount: 'desc' },
      take: 9,
      include: { bidderUser: { select: { nickname: true } } }
    });

    // 3. 配列に結合して返す
    // globalTopBidが存在すれば先頭に追加（[0]位 = Rank1, [1]位 = Rank2...）
    if (globalTopBid) {
      return [globalTopBid, ...categoryTopBids] as AdBidWithBidder[];
    }
    
    return categoryTopBids as AdBidWithBidder[];
  } catch (error) {
    console.error('getRankedAdBids error:', error);
    return [];
  }
}
