const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });
const prisma = new PrismaClient();

async function main() {
    console.log('--- I LOVE PICKLEBALL DATA COUNTS ---');
    console.log('Facilities:', await prisma.facility.count());
    console.log('Players:', await prisma.proPlayer.count());
    console.log('Articles:', await prisma.article.count());
    console.log('Events:', await prisma.event.count());
    console.log('Drills (Practice Menu):', await prisma.drill.count());
}

main().finally(() => prisma.$disconnect());
