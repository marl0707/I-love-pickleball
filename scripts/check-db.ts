import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const articles = await prisma.article.findMany({ take: 3 });
    const facilities = await prisma.facility.findMany({ take: 3 });

    console.log("=== Articles ===");
    console.dir(articles, { depth: null });

    console.log("=== Facilities ===");
    console.dir(facilities, { depth: null });

    const publishedArticles = await prisma.article.count({
        where: { status: { in: ["PUBLISHED", "published"] } }
    });
    console.log(`Published Articles Count: ${publishedArticles}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
