// production_data/ フォルダへの統合マージスクリプト
// 3つのデータソース（data/, salvaged_data/, recreated_by_antigravity/）を統合
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE = 'c:/Users/sejim/OneDrive/デスクトップ/Ronshoal_Tech_Base/02_Development/I-love-pickleball';
const OUT = join(BASE, 'production_data');

// ヘルパー関数
function readJson(path) {
    try {
        return JSON.parse(readFileSync(path, 'utf-8'));
    } catch (e) {
        console.log(`  ⚠ 読み込みスキップ: ${path} (${e.message})`);
        return null;
    }
}

function ensureDir(dir) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function writeJson(path, data) {
    writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
    const count = Array.isArray(data) ? data.length : Object.keys(data).length;
    console.log(`  ✅ ${path.replace(OUT, 'production_data')} (${count}件)`);
}

// 重複除去（nameベース）
function mergeArraysByName(primary, ...others) {
    const merged = [...primary];
    const names = new Set(primary.map(i => (i.name || i.product_name || i.title || i.id || '').toLowerCase()));
    for (const arr of others) {
        if (!arr) continue;
        for (const item of arr) {
            const key = (item.name || item.product_name || item.title || item.id || '').toLowerCase();
            if (!names.has(key)) {
                merged.push(item);
                names.add(key);
            }
        }
    }
    return merged;
}

// IDベースの重複除去
function mergeArraysById(primary, ...others) {
    const merged = [...primary];
    const ids = new Set(primary.map(i => i.id));
    for (const arr of others) {
        if (!arr) continue;
        for (const item of arr) {
            if (item.id && !ids.has(item.id)) {
                merged.push(item);
                ids.add(item.id);
            }
        }
    }
    return merged;
}

console.log('==============================');
console.log('本番データ統合開始');
console.log('==============================\n');

// ディレクトリ作成
const dirs = ['facilities', 'gears', 'players', 'content', 'community', 'events', 'supplementary', '_metadata'];
for (const d of dirs) ensureDir(join(OUT, d));

// =====================================================
// 1. 施設データ統合
// =====================================================
console.log('--- 1. 施設データ統合 ---');

// 地域別データを結合して1つのfacilities.jsonを生成
const regions = ['kanto', 'kansai', 'chubu', 'tohoku', 'hokkaido', 'kyushu', 'chugoku_shikoku'];
let allFacilities = [];
for (const r of regions) {
    const d = readJson(join(BASE, 'data/facilities', `${r}.json`));
    if (d && d.facilities) {
        // regionとnameRomajiをメタデータとして各施設に追加
        for (const f of d.facilities) {
            f._region = d.region || r;
            f._region_romaji = d.nameRomaji || r;
        }
        allFacilities = allFacilities.concat(d.facilities);
    }
}

// チェーン施設
const chain = readJson(join(BASE, 'data/facilities/chain_nationwide.json'));
if (chain) {
    if (Array.isArray(chain)) {
        allFacilities = allFacilities.concat(chain);
    } else if (chain.chain_name) {
        allFacilities.push(chain);
    }
}

// salvaged施設をマージ
const salvFac1 = readJson(join(BASE, 'salvaged_data/massive_salvage_facilities_01.json'));
const salvFac2 = readJson(join(BASE, 'salvaged_data/massive_salvage_facilities_02.json'));
allFacilities = mergeArraysByName(allFacilities, salvFac1, salvFac2);

writeJson(join(OUT, 'facilities/facilities.json'), allFacilities);

// facility_courts: 施設データからコート情報を抽出
const allCourts = [];
for (let i = 0; i < allFacilities.length; i++) {
    const f = allFacilities[i];
    if (f.facility_courts) {
        const courts = Array.isArray(f.facility_courts) ? f.facility_courts : [f.facility_courts];
        for (const c of courts) {
            allCourts.push({ ...c, _facility_name: f.name, _facility_index: i });
        }
    }
}
writeJson(join(OUT, 'facilities/facility_courts.json'), allCourts);

// facility_shops: 施設データからショップ情報を抽出
const allShops = [];
for (let i = 0; i < allFacilities.length; i++) {
    const f = allFacilities[i];
    if (f.facility_shops) {
        allShops.push({ ...f.facility_shops, _facility_name: f.name, _facility_index: i });
    }
}
writeJson(join(OUT, 'facilities/facility_shops.json'), allShops);

// facility_media
const facMedia = readJson(join(BASE, 'data/facilities/facility_media.json'));
const salvMedia = readJson(join(BASE, 'salvaged_data/facility_community_media.json'));
const mergedFacMedia = mergeArraysById(facMedia || [], salvMedia || []);
writeJson(join(OUT, 'facilities/facility_media.json'), mergedFacMedia);

// facility_comments
const facComments = readJson(join(BASE, 'data/facilities/facility_comments.json'));
const salvComments = readJson(join(BASE, 'salvaged_data/dummy_facility_comments.json'));
const mergedComments = mergeArraysById(facComments || [], salvComments || []);
writeJson(join(OUT, 'facilities/facility_comments.json'), mergedComments);

// =====================================================
// 2. ギアデータ統合
// =====================================================
console.log('\n--- 2. ギアデータ統合 ---');

// パドル
const paddlesData = readJson(join(BASE, 'data/gears/paddles.json')) || [];
const salvPad1 = readJson(join(BASE, 'salvaged_data/massive_salvage_paddles_01.json'));
const salvPad2 = readJson(join(BASE, 'salvaged_data/massive_salvage_paddles_02.json'));
writeJson(join(OUT, 'gears/paddles.json'), mergeArraysById(paddlesData, salvPad1, salvPad2));

// シューズ
const shoesData = readJson(join(BASE, 'data/gears/shoes.json')) || [];
const salvShoes = readJson(join(BASE, 'salvaged_data/massive_salvage_shoes.json'));
writeJson(join(OUT, 'gears/shoes.json'), mergeArraysById(shoesData, salvShoes));

// ボール
const ballsData = readJson(join(BASE, 'data/gears/balls.json')) || [];
const salvBalls = readJson(join(BASE, 'salvaged_data/massive_salvage_balls.json'));
writeJson(join(OUT, 'gears/balls.json'), mergeArraysById(ballsData, salvBalls));

// アパレル
const apparelData = readJson(join(BASE, 'data/gears/apparel.json')) || [];
const apparelBags = readJson(join(BASE, 'data/gears/apparel_and_bags.json')) || [];
const salvApparel = readJson(join(BASE, 'salvaged_data/massive_salvage_apparel.json'));
const salvApparelBags = readJson(join(BASE, 'salvaged_data/apparel_and_bags.json'));
writeJson(join(OUT, 'gears/apparel.json'), mergeArraysById(apparelData, apparelBags, salvApparel, salvApparelBags));

// バッグ
const bagsData = readJson(join(BASE, 'data/gears/bags.json')) || [];
const salvBags = readJson(join(BASE, 'salvaged_data/massive_salvage_bags.json'));
writeJson(join(OUT, 'gears/bags.json'), mergeArraysById(bagsData, salvBags));

// アクセサリー
const accData = readJson(join(BASE, 'data/gears/accessories.json')) || [];
const salvAcc = readJson(join(BASE, 'salvaged_data/massive_salvage_accessories.json'));
const salvMasterAcc = readJson(join(BASE, 'salvaged_data/master_gears_accessories.json'));
writeJson(join(OUT, 'gears/accessories.json'), mergeArraysById(accData, salvAcc, salvMasterAcc));

// ニッチギア（supplementary）
const nicheGears = readJson(join(BASE, 'data/gears/niche_gears.json'));
if (nicheGears) writeJson(join(OUT, 'supplementary/niche_gears.json'), nicheGears);

// =====================================================
// 3. プロ選手データ統合
// =====================================================
console.log('\n--- 3. プロ選手データ統合 ---');

const topPros = readJson(join(BASE, 'data/players/top_pros.json')) || [];
const seniorPros = readJson(join(BASE, 'data/players/senior_pros.json')) || [];
const domesticPlayers = readJson(join(BASE, 'data/players/domestic_players.json')) || [];
const salvPros = readJson(join(BASE, 'salvaged_data/massive_salvage_pro_players.json'));
const recreatedPros = readJson(join(BASE, 'recreated_by_antigravity/pro_players_detailed.json'));
writeJson(join(OUT, 'players/pro_players.json'),
    mergeArraysById(topPros, seniorPros, domesticPlayers, salvPros, recreatedPros));

// expert_reviews
const expReviews = readJson(join(BASE, 'data/reviews/expert_reviews.json'));
const salvReviews = readJson(join(BASE, 'salvaged_data/massive_salvage_reviews.json'));
const salvExpReviews = readJson(join(BASE, 'salvaged_data/expert_reviews.json'));
// expert_reviews.jsonがオブジェクト形式の場合は配列に変換
let expArr = [];
if (expReviews) {
    if (Array.isArray(expReviews)) expArr = expReviews;
    else if (typeof expReviews === 'object') {
        for (const [k, v] of Object.entries(expReviews)) {
            if (Array.isArray(v)) expArr = expArr.concat(v);
        }
    }
}
writeJson(join(OUT, 'players/expert_reviews.json'),
    mergeArraysById(expArr, salvReviews || [], salvExpReviews || []));

// =====================================================
// 4. コンテンツデータ統合
// =====================================================
console.log('\n--- 4. コンテンツデータ統合 ---');

// articles
const articleSeed = readJson(join(BASE, 'data/articles/articles_seed.json')) || [];
const begGuide = readJson(join(BASE, 'data/articles/beginner_guide.json')) || [];
const gearRevs = readJson(join(BASE, 'data/articles/gear_reviews.json')) || [];
const localComm = readJson(join(BASE, 'data/articles/local_community.json')) || [];
const newsPro = readJson(join(BASE, 'data/articles/news_pro.json')) || [];
const stratDrills = readJson(join(BASE, 'data/articles/strategy_drills.json')) || [];
const salvArticles = readJson(join(BASE, 'salvaged_data/massive_salvage_articles.json'));
const recreatedArticles = readJson(join(BASE, 'recreated_by_antigravity/articles_editorial.json'));
writeJson(join(OUT, 'content/articles.json'),
    mergeArraysById(articleSeed, begGuide, gearRevs, localComm, newsPro, stratDrills, salvArticles, recreatedArticles));

// drills
const drillsMaster = readJson(join(BASE, 'data/drills/drills_master.json')) || [];
const salvDrills = readJson(join(BASE, 'salvaged_data/massive_salvage_drills.json'));
const salvDrillsBeg = readJson(join(BASE, 'salvaged_data/drills_beginner_intermediate.json'));
const recreatedDrills = readJson(join(BASE, 'recreated_by_antigravity/drills_advanced.json'));
writeJson(join(OUT, 'content/drills.json'),
    mergeArraysById(drillsMaster, salvDrills, salvDrillsBeg, recreatedDrills));

// glossary
const glossary = readJson(join(BASE, 'data/articles/glossary.json')) || [];
const salvGlossary = readJson(join(BASE, 'salvaged_data/glossary.json'));
writeJson(join(OUT, 'content/glossary.json'),
    mergeArraysByName(glossary, salvGlossary));

// =====================================================
// 5. コミュニティデータ統合
// =====================================================
console.log('\n--- 5. コミュニティデータ統合 ---');

const communities = readJson(join(BASE, 'data/community/communities.json')) || [];
const salvComm = readJson(join(BASE, 'salvaged_data/massive_salvage_communities_01.json'));
const salvDummyComm = readJson(join(BASE, 'salvaged_data/dummy_communities.json'));
writeJson(join(OUT, 'community/communities.json'),
    mergeArraysById(communities, salvComm, salvDummyComm));

const commMedia = readJson(join(BASE, 'data/community/community_media.json')) || [];
writeJson(join(OUT, 'community/community_media.json'), commMedia);

// =====================================================
// 6. イベントデータ統合
// =====================================================
console.log('\n--- 6. イベントデータ統合 ---');

const events = readJson(join(BASE, 'data/events/tournaments_and_events.json')) || [];
const salvTournaments = readJson(join(BASE, 'salvaged_data/massive_salvage_tournaments.json'));
const salvTournComp = readJson(join(BASE, 'salvaged_data/tournaments_comprehensive.json'));
const salvLocalEvents = readJson(join(BASE, 'salvaged_data/dummy_local_events.json'));
writeJson(join(OUT, 'events/events.json'),
    mergeArraysById(events, salvTournaments, salvTournComp, salvLocalEvents));

const awards = readJson(join(BASE, 'data/events/awards.json')) || [];
const salvAwards = readJson(join(BASE, 'salvaged_data/awards.json'));
writeJson(join(OUT, 'events/awards.json'),
    mergeArraysById(awards, salvAwards));

// =====================================================
// 7. 補助データ統合
// =====================================================
console.log('\n--- 7. 補助データ統合 ---');

const coaches = readJson(join(BASE, 'data/coaches/top_coaches.json'));
if (coaches) writeJson(join(OUT, 'supplementary/coaches.json'), coaches);

const certs = readJson(join(BASE, 'data/coaches/certifications.json'));
if (certs) writeJson(join(OUT, 'supplementary/certifications.json'), certs);

const injury = readJson(join(BASE, 'data/care/injury_prevention.json'));
if (injury) writeJson(join(OUT, 'supplementary/injury_prevention.json'), injury);

const tactics = readJson(join(BASE, 'data/tactics/advanced_shots.json'));
if (tactics) writeJson(join(OUT, 'supplementary/advanced_shots.json'), tactics);

const mlpTeams = readJson(join(BASE, 'data/events/mlp_teams.json'));
if (mlpTeams) writeJson(join(OUT, 'supplementary/mlp_teams.json'), mlpTeams);

const brands = readJson(join(BASE, 'salvaged_data/master_brands.json'));
if (brands) writeJson(join(OUT, 'supplementary/brands.json'), brands);

const promos = readJson(join(BASE, 'data/events/promotions_coupons.json')) || [];
const salvPromos = readJson(join(BASE, 'salvaged_data/promotions_coupons.json'));
writeJson(join(OUT, 'supplementary/promotions_coupons.json'),
    mergeArraysById(promos, salvPromos));

// activity_logs
const actLogs = readJson(join(BASE, 'data/community/activity_logs.json')) || [];
const salvActLogs = readJson(join(BASE, 'salvaged_data/activity_logs.json'));
writeJson(join(OUT, 'community/activity_logs.json'),
    mergeArraysById(actLogs, salvActLogs));

// announcements
const announcements = readJson(join(BASE, 'data/community/announcements.json')) || [];
const salvAnn = readJson(join(BASE, 'salvaged_data/announcements.json'));
writeJson(join(OUT, 'community/announcements.json'),
    mergeArraysById(announcements, salvAnn));

// threads
const threads = readJson(join(BASE, 'data/community/threads.json'));
const salvThreads = readJson(join(BASE, 'salvaged_data/dummy_threads.json'));
if (threads || salvThreads) {
    let threadsArr = [];
    if (threads) {
        if (Array.isArray(threads)) threadsArr = threads;
        else if (typeof threads === 'object') {
            for (const [k, v] of Object.entries(threads)) {
                if (Array.isArray(v)) threadsArr = threadsArr.concat(v);
            }
        }
    }
    writeJson(join(OUT, 'community/threads.json'),
        mergeArraysById(threadsArr, salvThreads || []));
}

// user_bookmarks
const bookmarks = readJson(join(BASE, 'recreated_by_antigravity/user_bookmarks.json'));
const salvBookmarks = readJson(join(BASE, 'salvaged_data/dummy_bookmarks.json'));
writeJson(join(OUT, 'supplementary/user_bookmarks.json'),
    mergeArraysById(bookmarks || [], salvBookmarks || []));

// price_guide
const priceGuide = readJson(join(BASE, 'data/facilities/price_guide.json'));
if (priceGuide) writeJson(join(OUT, 'supplementary/price_guide.json'), Array.isArray(priceGuide) ? priceGuide : [priceGuide]);

// masterデータ
const masterTags = readJson(join(BASE, 'salvaged_data/master_tags.json'));
if (masterTags) writeJson(join(OUT, 'supplementary/master_tags.json'), masterTags);

const masterAssoc = readJson(join(BASE, 'salvaged_data/master_associations.json'));
if (masterAssoc) writeJson(join(OUT, 'supplementary/master_associations.json'), masterAssoc);

// users (モック)
const users = readJson(join(BASE, 'data/users/users_mock.json')) || [];
const salvUsers = readJson(join(BASE, 'salvaged_data/massive_salvage_users_01.json'));
const salvDummyUsers = readJson(join(BASE, 'salvaged_data/dummy_users.json'));
writeJson(join(OUT, 'supplementary/users_mock.json'),
    mergeArraysById(users, salvUsers, salvDummyUsers));

console.log('\n==============================');
console.log('統合完了！');
console.log('==============================');
