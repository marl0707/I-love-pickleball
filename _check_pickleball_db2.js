const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
    console.log('--- I LOVE PICKLEBALL DB Check ---');
    try {
        const count = await prisma.proPlayer.count();
        console.log('ProPlayers Count:', count);

        if (count > 0) {
            const players = await prisma.proPlayer.findMany({ take: 5 });
            players.forEach(p => {
                console.log(`Player: ${p.nameJa}, Singles: ${p.rankingSingles}, Doubles: ${p.rankingDoubles}`);
            });
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
