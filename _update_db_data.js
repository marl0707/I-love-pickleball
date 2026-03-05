const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });
const prisma = new PrismaClient();

async function main() {
    console.log('--- STARTING DB DATA UPDATE ---');

    // 1. Update ProPlayer photos
    const players = await prisma.proPlayer.findMany();
    for (const p of players) {
        if (p.photoUrl && p.photoUrl.includes('.com/player/')) {
            await prisma.proPlayer.update({
                where: { id: p.id },
                data: { photoUrl: '/images/placeholders/player.png' }
            });
        } else if (!p.photoUrl) {
            await prisma.proPlayer.update({
                where: { id: p.id },
                data: { photoUrl: '/images/placeholders/player.png' }
            });
        }
    }
    console.log('Players updated.');

    // 2. Update Facility photos
    const facilities = await prisma.facility.findMany();
    for (const f of facilities) {
        if (!f.mainPhotoUrl) {
            await prisma.facility.update({
                where: { id: f.id },
                data: { mainPhotoUrl: '/images/placeholders/facility.png' }
            });
        }
    }
    console.log('Facilities updated.');

    // 3. Update Drills Difficulty & Content
    const drills = await prisma.drill.findMany();
    for (const d of drills) {
        const diffMap = {
            '初心者': 'Beginner', 'BEGINNER': 'Beginner', 'beginner': 'Beginner',
            '中級者': 'Intermediate', 'INTERMEDIATE': 'Intermediate', 'intermediate': 'Intermediate',
            '上級者': 'Advanced', 'ADVANCED': 'Advanced', 'advanced': 'Advanced'
        };
        if (diffMap[d.difficulty]) {
            await prisma.drill.update({
                where: { id: d.id },
                data: {
                    difficulty: diffMap[d.difficulty],
                    imageUrl: '/images/placeholders/facility.png'
                }
            });
        } else if (!['Beginner', 'Intermediate', 'Advanced'].includes(d.difficulty)) {
            // 判別不能ならBeginnerにする
            await prisma.drill.update({
                where: { id: d.id },
                data: {
                    difficulty: 'Beginner',
                    imageUrl: '/images/placeholders/facility.png'
                }
            });
        }
    }
    console.log('Drills updated.');

    // 4. Update Event dates to future dates so they show up
    const events = await prisma.event.findMany();
    for (let i = 0; i < events.length; i++) {
        const e = events[i];
        // 過去の場合は未来に設定
        if (e.date < new Date()) {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 10 + i);
            await prisma.event.update({
                where: { id: e.id },
                data: {
                    date: futureDate,
                    imageUrl: '/images/placeholders/facility.png'
                }
            });
        } else {
            await prisma.event.update({
                where: { id: e.id },
                data: { imageUrl: '/images/placeholders/facility.png' }
            });
        }
    }
    console.log('Events updated.');

    console.log('--- UPDATE COMPLETE ---');
}

main().finally(() => prisma.$disconnect());
