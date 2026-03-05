import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('--- CONTENT DATA SEEDING ---');
  const articles = await prisma.article.findMany();
  for (const a of articles) {
    if (a.content.length < 200) {
      const dummyHtml = `
      <h2>この記事について</h2>
      <p>${a.content}</p>
      <p>ピックルボールは近年急速に人気を集めているスポーツです。適切な知識とスキルを身につけることで、初心者から上級者まで幅広く楽しむことができます。</p>
      
      <h3>1. 基本的なアプローチ</h3>
      <p>まずは基礎的なフォームとルールの理解から始めましょう。特にキッチン（ノンボレーゾーン）のルールは最も重要であり、試合の勝敗を大きく左右します。</p>
      
      <h3>2. 実践的な練習方法</h3>
      <p>壁打ちやパートナーとのボレー・ボレーなど、反復練習を通じて身体に感覚を覚え込ませることが上達の近道となります。</p>
      
      <h3>まとめ</h3>
      <p>継続は力なり。毎日少しずつでも練習を続けることで、必ずピックルボールの技術は向上します！</p>
      `;
      
      await prisma.article.update({
        where: { id: a.id },
        data: {
          content: dummyHtml,
          thumbnailUrl: a.thumbnailUrl || '/images/placeholders/facility.png'
        }
      });
    }
  }
  console.log(`Updated ${articles.length} articles with rich HTML content.`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
