import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const players = await prisma.proPlayer.findMany({ select: { id: true, nameJa: true, rankingSingles: true, rankingDoubles: true } });

    let rank1Count = 0;
    players.forEach(p => {
        if (p.rankingSingles === 1) rank1Count++;
    });

    console.log(`Total Players: ${players.length}`);
    console.log(`Players with Singles Rank 1: ${rank1Count}`);

    // Show a few samples
    console.log("\nSample Players:");
    players.slice(0, 15).forEach(p => console.log(`- ${p.nameJa}: Singles ${p.rankingSingles}, Doubles ${p.rankingDoubles}`));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
