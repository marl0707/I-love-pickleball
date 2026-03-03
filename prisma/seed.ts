import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('シードデータの投入を開始します...')

  // ============================================
  // Users (5件)
  // ============================================
  const users = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.user.upsert({
        where: { email: `user${i + 1}@example.com` },
        update: {},
        create: {
          email: `user${i + 1}@example.com`,
          nickname: `ピックルユーザー${i + 1}`,
          isProfilePublic: true,
        },
      })
    )
  )

  // ============================================
  // Facilities, Courts, Shops (5件)
  // ============================================
  const facilities = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.facility.create({
        data: {
          name: `ピックルボールパーク${String.fromCharCode(65 + i)}`,
          typeFlag: 3, // コート＆ショップ併設
          operatorType: i % 2 === 0 ? '民間' : '自治体',
          isPremium: i === 0,
          address: `東京都新宿区ダミー${i + 1}-1`,
          lat: 35.6895 + i * 0.01,
          lng: 139.6917 + i * 0.01,
          mainPhotoUrl: 'https://images.unsplash.com/photo-1622397127715-ab1b9aa9b457?w=800&q=80',
          hostsTournaments: i % 2 === 0,
          hasShower: true,
          hasLockerRoom: true,
          hasParking: true,
          hoursMon: '09:00 - 21:00',
          reservationMethod: 'オンライン',
          courts: {
            create: [
              {
                courtType: 'インドア',
                numberOfCourts: 3 + i,
                surfaceType: 'デコターフ',
                hasAc: true,
              }
            ]
          },
          shops: {
            create: [
              {
                hasPaddleSales: true,
                hasPaddleRental: true,
                paddleRentalFee: 500,
                handledBrands: 'Selkirk,JOOLA'
              }
            ]
          }
        },
      })
    )
  )

  // ============================================
  // Facility Reviews (5件)
  // ============================================
  await Promise.all(
    facilities.map((f, i) =>
      prisma.facilityReview.create({
        data: {
          facilityId: f.id,
          userId: users[i % users.length].id,
          score: 4 + (i % 2), // 4 or 5
          content: `とても綺麗で使いやすいコートでした！（ダミーレビュー${i + 1}）`,
        },
      })
    )
  )

  // ============================================
  // Gears (各5件)
  // ============================================
  const paddles = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.gearPaddle.create({
        data: {
          brandName: `Brand${String.fromCharCode(65 + i)}`,
          productName: `Pro Paddle Model ${i + 1}00`,
          price: 20000 + i * 1000,
          paddleShape: 'Elongated',
          faceMaterial: 'カーボン',
          coreThickness: 16.0,
          amazonUrl: 'https://amazon.co.jp/',
          imageUrl: 'https://images.unsplash.com/photo-1622397127715-ab1b9aa9b457?w=400&q=80',
        },
      })
    )
  )

  const shoes = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.gearShoe.create({
        data: {
          brandName: `CourtShoeBrand${i}`,
          productName: `PickleShoe X${i}`,
          price: 15000,
          courtType: 'オールコート',
          amazonUrl: 'https://amazon.co.jp/',
        },
      })
    )
  )

  const balls = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.gearBall.create({
        data: {
          brandName: `BallMaster${i}`,
          productName: `Tournament Ball ${i}`,
          price: 3000,
          grade: 'トーナメント',
          yahooUrl: 'https://yahoo.co.jp/',
        },
      })
    )
  )

  const apparels = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.gearApparel.create({
        data: {
          brandName: `WearBrand${i}`,
          productName: `Dry Fit Tee ${i}`,
          price: 4500,
          category: 'トップス',
          targetGender: 'Unisex',
          yahooUrl: 'https://yahoo.co.jp/',
        },
      })
    )
  )

  const bags = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.gearBag.create({
        data: {
          brandName: `BagBrand${i}`,
          productName: `Pro Tour Bag ${i}`,
          price: 12000,
          bagType: 'バックパック',
          paddleCapacity: 2 + i,
          hasFenceHook: true,
          yahooUrl: 'https://yahoo.co.jp/',
        },
      })
    )
  )

  // ============================================
  // Gear Reviews (5件)
  // ============================================
  await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.gearReview.create({
        data: {
          userId: users[i].id,
          itemType: 'paddle',
          itemId: paddles[i].id,
          score: 5,
          comment: 'スピンが非常によくかかってコントロールしやすいです。',
        },
      })
    )
  )

  // ============================================
  // Pro Players (5件)
  // ============================================
  const players = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.proPlayer.create({
        data: {
          nameJa: `山田 太郎${i}`,
          nameEn: `Taro Yamada ${i}`,
          nationality: 'Japan',
          playStyle: 'オールラウンダー',
          rankingSingles: i + 1,
          rankingDoubles: i + 1,
          paddleIds: paddles[i].id,
          shoeIds: shoes[i].id,
        },
      })
    )
  )

  // ============================================
  // Articles (5件)
  // ============================================
  await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.article.upsert({
        where: { slug: `pickup-article-${i + 1}` },
        update: {},
        create: {
          slug: `pickup-article-${i + 1}`,
          title: `ピックルボールが${i + 1}倍楽しくなる${i === 0 ? '基本' : '応用'}テクニック`,
          content: `<p>ここにリッチテキストやHTML記事コンテンツが入ります。これはダミーの記事${i + 1}です。</p>`,
          category: i % 2 === 0 ? '初心者ガイド' : 'ニュース',
          targetAudience: '全レベル',
          thumbnailUrl: 'https://images.unsplash.com/photo-1622397127715-ab1b9aa9b457?w=800&q=80',
          status: 'published',
          publishedAt: new Date(Date.now() - i * 86400000),
        },
      })
    )
  )

  // ============================================
  // Advertisements & AdBids (各5件)
  // ============================================
  await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.advertisement.create({
        data: {
          userId: users[i].id,
          slotType: 'header',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
          targetUrl: 'https://ronshoal.com',
          status: 'ACTIVE',
          startsAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日後
        },
      })
    )
  )

  await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.adBid.create({
        data: {
          category: 'Facility',
          bidderId: users[i].id,
          bidAmount: 1000 + i * 500, // 1000〜3000
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
          targetUrl: 'https://ronshoal.com',
          advertiserName: `スポンサー企業${String.fromCharCode(65 + i)}`,
          status: 'ACTIVE',
        },
      })
    )
  )
  // ============================================
  // Community Categories (5件)
  // ============================================
  const categories = [
    { slug: 'general', name: '雑談・交流', description: 'ピックルボールに関する気軽な話題' },
    { slug: 'courts', name: 'コート情報', description: '全国のコートや練習場所について' },
    { slug: 'tournaments', name: '大会・イベント', description: '試合やイベントの告知・レポート' },
    { slug: 'gears', name: '用具・ギア', description: 'パドルやシューズのレビュー・質問' },
    { slug: 'beginners', name: '初心者質問', description: 'ルールや始め方などの質問はこちら' },
  ]

  const communityCategories = await Promise.all(
    categories.map((c, i) =>
      prisma.communityCategory.upsert({
        where: { slug: c.slug },
        update: {},
        create: {
          slug: c.slug,
          name: c.name,
          description: c.description,
          sortOrder: i,
        },
      })
    )
  )

  // ============================================
  // Community Posts (5件)
  // ============================================
  await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.communityPost.create({
        data: {
          categoryId: communityCategories[i % communityCategories.length].id,
          userId: users[i].id,
          title: `最初の投稿です（${communityCategories[i % communityCategories.length].name}）`,
          content: 'コミュニティ機能のテスト投稿です。皆さんよろしくお願いします！',
        },
      })
    )
  )

  // ============================================
  // Events (5件)
  // ============================================
  await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.event.create({
        data: {
          title: `第${i + 1}回 ピックルボール交流会＆練習会`,
          description: `初心者から経験者まで楽しめる交流イベントです。今回は特別ゲストとしてプロ選手も参加予定！ぜひご参加ください。\n\n持ち物: 運動靴、タオル、飲み物（パドル貸出あり）`,
          date: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000), // 1週間後〜5週間後
          location: facilities[i % facilities.length].name,
          organizerId: users[i].id,
          maxCapacity: 10 + i * 5,
          fee: 1000 + i * 500,
          imageUrl: 'https://images.unsplash.com/photo-1622397127715-ab1b9aa9b457?w=800&q=80',
        },
      })
    )
  )

  // ============================================
  // Drills (5件)
  // ============================================
  const drillDifficulties = ['Beginner', 'Beginner', 'Intermediate', 'Intermediate', 'Advanced'];
  await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.drill.create({
        data: {
          title: `【${drillDifficulties[i]}】ドロップショット集中練習 Vol.${i + 1}`,
          description: `ピックルボールの勝敗を分ける重要なショット「ドロップ」の練習メニューです。\n\n手順：\n1. ネットのすぐ後ろにカゴを置く\n2. コート後方からひたすらカゴを狙って優しく打つ\n3. 10球中何球入るかカウントする`,
          difficulty: drillDifficulties[i],
          minPlayers: i % 2 === 0 ? 1 : 2,
          durationMin: 15 + i * 5,
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
        },
      })
    )
  )

  console.log('シードデータの投入が完了しました！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
