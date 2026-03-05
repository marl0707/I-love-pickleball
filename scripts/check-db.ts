import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const players = await prisma.proPlayer.findMany({ take: 3 });
  console.log("PLAYERS:", players.map(p => ({
    name: p.nameJa, rankS: p.rankingSingles, rankD: p.rankingDoubles, photo: p.photoUrl
  })));
  
  const articles = await prisma.article.findMany({ take: 3 });
  console.log("ARTICLES:", articles.map(a => ({
    title: a.title, contentSnippet: a.content.substring(0, 50)
  })));
  
  const drills = await prisma.drill.findMany({ take: 3 });
  console.log("DRILLS:", drills);
  
  const events = await prisma.event.findMany({ take: 3 });
  console.log("EVENTS:", events);
}
main().catch(console.error).finally(() => prisma.$disconnect());
