const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- I LOVE PICKLEBALL Record Counts ---');
    try {
        console.log('ProPlayers:', await prisma.proPlayer.count());
        console.log('Facilities:', await prisma.facility.count());
        console.log('Articles:', await prisma.article.count());
        console.log('Events:', await prisma.event.count());
        console.log('Drills:', await prisma.drill.count());

        const player = await prisma.proPlayer.findFirst();
        console.log('Sample ProPlayer Data:', JSON.stringify(player, null, 2));

    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
