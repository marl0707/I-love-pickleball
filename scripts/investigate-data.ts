import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("=== DB Data Quality Investigation ===\n");

    // 1. Facilities
    const totalFacilities = await prisma.facility.count();
    const facilitiesWithImage = await prisma.facility.count({
        where: { mainPhotoUrl: { not: null, notIn: [""] } }
    });
    console.log(`[Facilities] Total: ${totalFacilities}`);
    console.log(`[Facilities] With mainPhotoUrl: ${facilitiesWithImage} (${Math.round(facilitiesWithImage / totalFacilities * 100)}%)`);

    // 2. Paddles
    const totalPaddles = await prisma.gearPaddle.count();
    const paddlesWithImage = await prisma.gearPaddle.count({
        where: { imageUrl: { not: null, notIn: [""] } }
    });
    console.log(`\n[Gear Paddles] Total: ${totalPaddles}`);
    console.log(`[Gear Paddles] With imageUrl: ${paddlesWithImage} (${Math.round(paddlesWithImage / totalPaddles * 100)}%)`);

    // 3. Articles (Content Length)
    const totalArticles = await prisma.article.count();
    const articlesWithThumbnail = await prisma.article.count({
        where: { thumbnailUrl: { not: null, notIn: [""] } }
    });
    console.log(`\n[Articles] Total: ${totalArticles}`);
    console.log(`[Articles] With thumbnailUrl: ${articlesWithThumbnail} (${Math.round(articlesWithThumbnail / totalArticles * 100)}%)`);

    const articles = await prisma.article.findMany({
        select: { title: true, content: true }
    });

    let emptyContent = 0;
    let shortContent = 0; // less than 200 chars
    let goodContent = 0;

    for (const article of articles) {
        const len = article.content ? article.content.length : 0;
        if (len === 0) emptyContent++;
        else if (len < 200) shortContent++;
        else goodContent++;
    }

    console.log(`[Articles] Content Quality:`);
    console.log(`  - Format: Empty (0 chars) -> ${emptyContent}`);
    console.log(`  - Format: Short (< 200 chars) -> ${shortContent}`);
    console.log(`  - Format: Good (>= 200 chars) -> ${goodContent}`);

    if (articles.length > 0) {
        console.log(`\nSample Article Content Lengths:`);
        articles.slice(0, 5).forEach(a => {
            console.log(`  - "${a.title}": ${a.content ? a.content.length : 0} chars`);
        });
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
