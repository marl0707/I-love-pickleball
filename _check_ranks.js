const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });
const prisma = new PrismaClient();
async function main() {
    const players = await prisma.proPlayer.findMany({
        orderBy: { rankingSingles: "asc" },
        take: 10
    });
    console.log("--- First 10 players on /players ---");
    players.forEach(p => console.log(`${p.nameJa} / S: ${p.rankingSingles} / D: ${p.rankingDoubles}`));
}
main().finally(() => prisma.$disconnect());
