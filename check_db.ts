import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
    const articles = await prisma.article.findMany({ select: { slug: true, title: true, thumbnailUrl: true } });
    console.log('--- Articles with thumbnailUrl: ---');
    articles.filter(a => a.thumbnailUrl).slice(0, 5).forEach(a => console.log(a));
    console.log('--- Articles without thumbnailUrl: ---');
    articles.filter(a => !a.thumbnailUrl).slice(0, 5).forEach(a => console.log(a));
}
run().catch(console.error).finally(() => prisma.$disconnect());
