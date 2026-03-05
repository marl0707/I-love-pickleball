import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('--- PLAYERS DATA SEEDING ---');
  const players = await prisma.proPlayer.findMany();
  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    // Random rank between 1 and 20 if null or 1
    const rankS = (p.rankingSingles === null || p.rankingSingles === 1) ? Math.floor(Math.random() * 20) + 1 : p.rankingSingles;
    const rankD = (p.rankingDoubles === null || p.rankingDoubles === 1) ? Math.floor(Math.random() * 20) + 1 : p.rankingDoubles;
    const photo = p.photoUrl || '/images/placeholders/player.png';
    const style = p.playStyle || 'アグレッシブベースライナー';
    
    await prisma.proPlayer.update({
      where: { id: p.id },
      data: {
        rankingSingles: rankS,
        rankingDoubles: rankD,
        photoUrl: photo,
        playStyle: style
      }
    });
  }
  console.log(`Updated ${players.length} players.`);

  console.log('--- FACILITIES DATA SEEDING ---');
  const facilities = await prisma.facility.findMany();
  for (const f of facilities) {
    await prisma.facility.update({
      where: { id: f.id },
      data: {
        mainPhotoUrl: f.mainPhotoUrl || '/images/placeholders/facility.png',
        hoursMon: f.hoursMon || '09:00 - 21:00',
        hoursTue: f.hoursTue || '09:00 - 21:00',
        hoursWed: f.hoursWed || '09:00 - 21:00',
        hoursThu: f.hoursThu || '09:00 - 21:00',
        hoursFri: f.hoursFri || '09:00 - 23:00',
        hoursSat: f.hoursSat || '08:00 - 23:00',
        hoursSun: f.hoursSun || '08:00 - 21:00',
      }
    });
  }
  console.log(`Updated ${facilities.length} facilities.`);

  console.log('--- EVENT DATA SEEDING ---');
  // ユーザーIDの取得
  let user = await prisma.user.findFirst();
  if(!user) {
    user = await prisma.user.create({ data: { email: 'dummy@example.com', nickname: 'Dummy' } });
  }
  const eventsCount = await prisma.event.count();
  if (eventsCount < 5) {
     for(let i=1; i<=5; i++) {
       await prisma.event.create({
         data: {
           title: `ピックルボール交流大会 第${i}回`,
           description: `初心者から上級者まで楽しめるピックルボールの大会です。第${i}回の特別イベントとしてプロ選手の講習会も同時開催予定！`,
           date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * i),
           location: '東京体育館',
           organizerId: user.id,
           fee: 3000,
           maxCapacity: 30,
           imageUrl: '/images/placeholders/facility.png'
         }
       });
     }
     console.log('Inserted 5 dummy events.');
  }

  console.log('--- DRILL DATA SEEDING ---');
  const drillsCount = await prisma.drill.count();
  if (drillsCount < 5) {
     const dummyDrills = [
       { title: 'ディンクラリー100回連続', diff: 'Beginner', min: 2, dur: 15, desc: 'ノンボレーゾーン越しに柔らかく打ち合うディンクを100回連続で続ける基礎練習。' },
       { title: 'サードショットドロップ集中', diff: 'Intermediate', min: 2, dur: 20, desc: 'ベースラインからキッチンへボールを落とすサードショットドロップの感覚を養うドリル。' },
       { title: 'ボレーボレー（至近距離での反応）', diff: 'Intermediate', min: 2, dur: 10, desc: 'キッチンラインに立って互いに速いテンポでボレーを打ち合う練習。反射神経を向上させる。' },
       { title: 'サーブ＆リターンのコントロール', diff: 'Beginner', min: 2, dur: 15, desc: 'サーブをコートの奥深くにコントロールし、それに対する深く返すリターンを反復練習する。' },
       { title: 'アラウンド・ザ・ポスト(ATP)練習', diff: 'Advanced', min: 2, dur: 10, desc: 'ネットの横を回り込ませて相手コートに打ち込むATPショットの実戦を想定したドリル。' }
     ];
     for(const d of dummyDrills) {
        await prisma.drill.create({
           data: {
             title: d.title,
             description: d.desc,
             difficulty: d.diff,
             minPlayers: d.min,
             durationMin: d.dur,
             imageUrl: '/images/placeholders/facility.png'
           }
        });
     }
     console.log('Inserted 5 dummy drills.');
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
