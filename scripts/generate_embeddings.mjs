import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');
const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });

async function getEmbedding(text) {
    if (!text) return null;
    try {
        const result = await embeddingModel.embedContent(text);
        return result.embedding.values; // number[]
    } catch (e) {
        console.error('Embedding generation failed:', e.message);
        return null;
    }
}

async function insertSearchDocument(targetType, targetId, title, content, vectorArray) {
    if (!vectorArray || vectorArray.length === 0) return;

    // Convert array to pgvector string format: '[0.1, 0.2, ...]'
    const vectorString = `[${vectorArray.join(',')}]`;

    // Execute Raw SQL to insert into table with vector column
    await prisma.$executeRaw`
      INSERT INTO search_documents ("id", "target_type", "target_id", "title", "content", "embedding", "created_at", "updated_at")
      VALUES (
        gen_random_uuid(),
        ${targetType},
        ${targetId},
        ${title},
        ${content},
        ${vectorString}::vector,
        now(),
        now()
      )
    `;
}

async function processFacilities() {
    console.log('Processing Facilities...');
    const facilities = await prisma.facility.findMany({
        include: { courts: true, shops: true }
    });

    for (const f of facilities) {
        const content = `
施設名: ${f.name}
住所: ${f.address || '不明'}
施設タイプ: ${f.typeFlag === 1 ? 'コートあり' : f.typeFlag === 2 ? 'ショップのみ' : 'コート＆ショップ併設'}
ドロップイン/体験歓迎: ${f.visitorWelcome ? 'はい' : 'いいえ'}
大会開催: ${f.hostsTournaments ? 'あり' : 'なし'}
アメニティ: シャワー${f.hasShower ? 'あり' : 'なし'}, ロッカー${f.hasLockerRoom ? 'あり' : 'なし'}, 駐車場${f.hasParking ? 'あり' : 'なし'}
アクセス: ${f.accessGuide || '不明'}
コート数: ${f.courts.reduce((acc, c) => acc + c.numberOfCourts, 0)}面
ショップ取扱: パドル販売${f.shops.some(s => s.hasPaddleSales) ? 'あり' : 'なし'}, レンタル${f.shops.some(s => s.hasPaddleRental) ? 'あり' : 'なし'}
        `.trim();

        const vec = await getEmbedding(f.name + '\n' + content);
        await insertSearchDocument('facility', f.id, f.name, content, vec);
        console.log(`Facility embedded: ${f.name}`);
    }
}

async function processPlayers() {
    console.log('Processing Players...');
    const players = await prisma.proPlayer.findMany();
    for (const p of players) {
        const content = `
プロ選手: ${p.nameJa} ${p.nameEn ? '(' + p.nameEn + ')' : ''}
国籍: ${p.nationality || '不明'}
プレイスタイル: ${p.playStyle || '不明'}
所属: ${p.leagueAffiliation || '不明'}
シングルスランキング: ${p.rankingSingles || '-'}
ダブルスランキング: ${p.rankingDoubles || '-'}
        `.trim();

        const vec = await getEmbedding(p.nameJa + '\n' + content);
        await insertSearchDocument('player', p.id, p.nameJa, content, vec);
        console.log(`Player embedded: ${p.nameJa}`);
    }
}

async function main() {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        console.error('ERROR: GOOGLE_GENERATIVE_AI_API_KEY is not set in .env');
        process.exit(1);
    }

    console.log('Clearing existing search documents...');
    await prisma.$executeRaw`TRUNCATE TABLE search_documents`;

    await processFacilities();
    await processPlayers();

    console.log('RAG Embeddings generation completed!');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
