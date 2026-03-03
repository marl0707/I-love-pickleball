// 地域別施設レコード数カウント + コミュニティ・ドリル・記事等のレコード数詳細
import { readFileSync } from 'fs';
const BASE = 'c:/Users/sejim/OneDrive/デスクトップ/Ronshoal_Tech_Base/02_Development/I-love-pickleball';

const facilityFiles = ['kanto', 'kansai', 'chubu', 'tohoku', 'hokkaido', 'kyushu', 'chugoku_shikoku'];
console.log('=== 地域別施設レコード数 ===');
let totalFacilities = 0;
for (const f of facilityFiles) {
    try {
        const d = JSON.parse(readFileSync(`${BASE}/data/facilities/${f}.json`, 'utf-8'));
        const count = d.facilities ? d.facilities.length : 0;
        console.log(`  ${f}: ${count}件`);
        totalFacilities += count;
    } catch (e) { console.log(`  ${f}: エラー - ${e.message}`); }
}
console.log(`  合計: ${totalFacilities}件`);

// チェーン
try {
    const c = JSON.parse(readFileSync(`${BASE}/data/facilities/chain_nationwide.json`, 'utf-8'));
    console.log(`  chain_nationwide: ${Array.isArray(c) ? c.length : '1チェーン(' + Object.keys(c).length + 'keys)'}件`);
} catch (e) { }

// salvaged施設
console.log('\n=== salvaged施設 ===');
for (const f of ['massive_salvage_facilities_01', 'massive_salvage_facilities_02']) {
    try {
        const d = JSON.parse(readFileSync(`${BASE}/salvaged_data/${f}.json`, 'utf-8'));
        console.log(`  ${f}: ${d.length}件`);
    } catch (e) { }
}

// salvaged communities
console.log('\n=== salvaged communities ===');
try {
    const d = JSON.parse(readFileSync(`${BASE}/salvaged_data/massive_salvage_communities_01.json`, 'utf-8'));
    console.log(`  massive_salvage_communities_01: ${d.length}件`);
} catch (e) { }

// data communities
try {
    const d = JSON.parse(readFileSync(`${BASE}/data/community/communities.json`, 'utf-8'));
    console.log(`  data/community/communities: ${d.length}件`);
} catch (e) { }

// paddles合計
console.log('\n=== パドル合計 ===');
let tp = 0;
for (const f of ['data/gears/paddles.json', 'salvaged_data/massive_salvage_paddles_01.json', 'salvaged_data/massive_salvage_paddles_02.json']) {
    try {
        const d = JSON.parse(readFileSync(`${BASE}/${f}`, 'utf-8'));
        console.log(`  ${f}: ${d.length}件`);
        tp += d.length;
    } catch (e) { }
}
console.log(`  合計: ${tp}件`);

// その他重要カテゴリ
console.log('\n=== その他カテゴリ ===');
const checks = [
    'data/gears/shoes.json', 'salvaged_data/massive_salvage_shoes.json',
    'data/gears/balls.json', 'salvaged_data/massive_salvage_balls.json',
    'data/gears/apparel.json', 'salvaged_data/massive_salvage_apparel.json',
    'data/gears/bags.json', 'salvaged_data/massive_salvage_bags.json',
    'data/gears/accessories.json', 'salvaged_data/massive_salvage_accessories.json',
    'data/drills/drills_master.json', 'salvaged_data/massive_salvage_drills.json',
    'data/articles/articles_seed.json', 'salvaged_data/massive_salvage_articles.json',
    'data/coaches/top_coaches.json', 'data/coaches/certifications.json',
    'data/articles/glossary.json',
    'data/events/tournaments_and_events.json', 'salvaged_data/massive_salvage_tournaments.json',
    'data/players/domestic_players.json', 'data/players/senior_pros.json',
    'data/care/injury_prevention.json', 'data/tactics/advanced_shots.json',
    'data/events/mlp_teams.json',
];
for (const f of checks) {
    try {
        const d = JSON.parse(readFileSync(`${BASE}/${f}`, 'utf-8'));
        const cnt = Array.isArray(d) ? d.length : Object.keys(d).length;
        console.log(`  ${f}: ${cnt}件`);
    } catch (e) { console.log(`  ${f}: エラー`); }
}
