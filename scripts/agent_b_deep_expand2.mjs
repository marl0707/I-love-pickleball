/**
 * シューズ・ボール・アクセサリー深掘り拡充スクリプト
 * Web検索で確認した実在情報のみ。嘘は一切つかない。
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = join(__dirname, '..', 'production_data');
function loadJson(r) { return JSON.parse(readFileSync(join(BASE, r), 'utf-8')); }
function saveJson(r, d) { writeFileSync(join(BASE, r), JSON.stringify(d, null, 2) + '\n', 'utf-8'); }

// ============================================
// 1. 新シューズ追加
// ============================================
const shoes = loadJson('gears/shoes.json');
const shoeIds = new Set(shoes.map(s => s.id));
const newShoes = [
    // HEAD Motion Pro - ソース: pickleballwarehouse.com, pickleballcentral.com
    {
        id: 'shoe_head_motion_pro', brand_name: 'HEAD', product_name: 'Motion Pro Pickleball Shoe',
        court_type: 'オールコート', outsole: 'Hybrasion+ 360°パターン', midsole: 'DynaFoam EVA',
        weight_grams: 413, // Men's 10 = 14.6oz
        stability_features: ['TPUヒールカウンター', '3D Anti-Torsion Shank', 'ロックダウンレーシングストラップ', '補強トーキャップ'],
        description: 'HEAD Motion Pro。DynaFoam EVAミッドソールでクッション性抜群。Hybrasion+ 360°アウトソールで全方向グリップ。',
        color_variations: ['White/Blue', 'Black/Orange'],
        amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Mizuno Wave Enforce Tour 2 - ソース: mizuno.com, tennis-warehouse.com
    {
        id: 'shoe_mizuno_wave_enforce2', brand_name: 'Mizuno', product_name: 'Wave Enforce Tour 2',
        court_type: 'オールコート', outsole: 'XG Rubber', midsole: 'Mizuno Wave + Mizuno Enerzy',
        weight_grams: 413, // Men's 10.5 = 14.6oz
        stability_features: ['Mizuno Wave プレート', 'D-Flex Groove', 'TPUシャンク'],
        description: 'Mizuno Wave テクノロジー搭載。安定性とクッション性を両立するコートシューズ。',
        color_variations: ['White/Black', 'Navy'],
        amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // New Balance FuelCell 996v6 - ソース: newbalance.com, tennis-warehouse.com
    {
        id: 'shoe_nb_fuelcell_996v6', brand_name: 'New Balance', product_name: 'FuelCell 996v6',
        court_type: 'オールコート', outsole: 'NDurance Rubber (ヘリンボーンパターン)', midsole: 'FuelCell Foam',
        weight_grams: 352, // Men's = 12.4oz
        stability_features: ['TPU Shank (大型)', 'PUサポートチップ', '耐久トーガード', 'ラテラルスタビリティ強化'],
        description: 'New Balance FuelCell搭載。推進力のあるFuelCellフォームと、NDuranceラバーで高い耐久性。8mmヒールドロップ。',
        color_variations: ['White', 'Black/Red'],
        amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
];
let sc = 0;
for (const ns of newShoes) { if (!shoeIds.has(ns.id)) { shoes.push(ns); sc++; } }
saveJson('gears/shoes.json', shoes);
console.log('シューズ新規追加: ' + sc + '件 (合計: ' + shoes.length + '件)');

// ============================================
// 2. ボール weight/diameter/hole_count 補完 + 新モデル
// ============================================
const balls = loadJson('gears/balls.json');
const ballIds = new Set(balls.map(b => b.id));

// 既存ボールのweight/diameter補完
const ballSpecs = {
    // Dura Fast 40 がすでにあれば
    'ball_dura_fast40_outdoor': { weight_oz: 0.92, diameter_in: 2.9375, hole_count: 40 },
    'ball_onix_pure2_outdoor': { weight_oz: 0.927, diameter_in: 2.9, hole_count: 40 },
    'ball_gamma_photon_indoor': { weight_oz: 0.85, diameter_in: 2.9, hole_count: 26 },
};
let bsc = 0;
for (const b of balls) {
    const s = ballSpecs[b.id];
    if (s) { Object.assign(b, s); bsc++; }
}

// 新ボール追加
const newBalls = [
    // HEAD Penn 26 Indoor - ソース: pickleballcentral.com
    {
        id: 'ball_head_penn26_indoor', brand_name: 'HEAD', product_name: 'Penn 26 Indoor Pickleball',
        ball_type: 'indoor', hole_count: 26, weight_oz: 0.81,
        diameter_in: 2.9, usapa_approved: true,
        description: 'HEAD Penn 26ホールインドアボール。軽量0.81oz。柔らかめの打球感。',
        color_variations: ['Yellow'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // JOOLA Primo Ball - ソース: joola.com
    {
        id: 'ball_joola_primo', brand_name: 'JOOLA', product_name: 'Primo Outdoor Pickleball',
        ball_type: 'outdoor', hole_count: 40, usapa_approved: true,
        description: 'JOOLA公式のプレミアムアウトドアボール。耐久性と一貫したバウンスが特徴。',
        color_variations: ['Neon Green'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Engage Tour Ball
    {
        id: 'ball_engage_tour', brand_name: 'Engage', product_name: 'Tour Outdoor Pickleball',
        ball_type: 'outdoor', hole_count: 40, usapa_approved: true,
        description: 'Engage公式トーナメントボール。一貫した飛行と耐久性。',
        color_variations: ['Yellow'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
];
let bnc = 0;
for (const nb of newBalls) { if (!ballIds.has(nb.id)) { balls.push(nb); bnc++; } }
saveJson('gears/balls.json', balls);
console.log('ボールスペック補完: ' + bsc + '件, 新規追加: ' + bnc + '件 (合計: ' + balls.length + '件)');

// ============================================
// 3. 新アクセサリー追加
// ============================================
const accessories = loadJson('gears/accessories.json');
const accIds = new Set(accessories.map(a => a.id));
const newAcc = [
    // グローブ
    {
        id: 'acc_head_web_glove', brand_name: 'HEAD', product_name: 'Web Pickleball Glove',
        category: 'グローブ', description: 'シリコン処理パームでグリップ力抜群。ナックルパッド付き保護設計。合成レザー製。',
        features: ['シリコンパーム', 'ナックルパッド', '合成レザー'],
        color_variations: ['Black'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    {
        id: 'acc_selkirk_boost_glove', brand_name: 'Selkirk', product_name: 'Boost Pickleball Glove',
        category: 'グローブ', description: 'ハニカム構造パームで全天候グリップ。通気性Lycra素材。ウェット時もドライ時も安定。',
        features: ['ハニカムパーム構造', '通気性Lycra', '全天候対応'],
        color_variations: ['Black', 'White'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    {
        id: 'acc_franklin_perf_glove', brand_name: 'Franklin', product_name: 'Performance Pickleball Glove (Half Finger)',
        category: 'グローブ', description: 'ハーフフィンガーデザインで操作性を維持しつつ、パーム部分のグリップ力を強化。',
        features: ['ハーフフィンガー', 'グリップ強化パーム'],
        color_variations: ['Black'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // アイウェア
    {
        id: 'acc_crbn_pivot_glasses', brand_name: 'CRBN', product_name: 'Pivot Pickleball Glasses',
        category: 'アイウェア', description: 'ANSI Z87.1安全基準準拠。フォトクロミック(自動調光)レンズ搭載。光条件に自動対応。',
        features: ['ANSI Z87.1準拠', 'フォトクロミックレンズ', '自動調光', '軽量'],
        color_variations: ['Black'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    {
        id: 'acc_onix_falcon_eyewear', brand_name: 'Onix', product_name: 'Falcon Eyewear',
        category: 'アイウェア', description: 'ラップアラウンドフレーム。交換可能レンズ3色(アンバー/ブルー/クリア)。防曇コート。',
        features: ['交換レンズ3色', '調整可能ノーズピース', '防曇コーティング', 'ラップアラウンド'],
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // パドルイレーサー
    {
        id: 'acc_crbn_paddle_eraser', brand_name: 'CRBN', product_name: 'Pickleball Paddle Eraser',
        category: 'パドルメンテナンス', description: 'Raw Carbon Fiber面専用クリーナー。ボール残留・汚れを除去しスピン性能を復元。',
        features: ['ラバーブロック型', 'Carbon Fiber面専用', 'スピン復元'],
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // リストバンド
    {
        id: 'acc_onix_sweatband', brand_name: 'Onix', product_name: 'Sweat Absorption Wristbands',
        category: 'リストバンド', description: 'コットン/ナイロン/エラスタン混紡。優れた汗吸収力で手滑りを防止。',
        features: ['高吸水性', 'コットン混紡', 'フィット感'],
        color_variations: ['White', 'Black'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // タングステンテープ (既存のリードテープとは別カテゴリ)
    {
        id: 'acc_hesacore_tour_grip', brand_name: 'Hesacore', product_name: 'Tour Grip for Pickleball',
        category: 'グリップ', description: 'ハニカム構造の特殊グリップ。手の疲労軽減と安定性向上。テニスから転用されPBでも人気。',
        features: ['ハニカム構造', '手の疲労軽減', '安定性向上', 'カスタマイズ可能'],
        color_variations: ['Yellow'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
];
let acc_c = 0;
for (const na of newAcc) { if (!accIds.has(na.id)) { accessories.push(na); acc_c++; } }
saveJson('gears/accessories.json', accessories);
console.log('アクセサリー新規追加: ' + acc_c + '件 (合計: ' + accessories.length + '件)');

// ============================================
// 4. 新ブランド追加
// ============================================
const brands = loadJson('supplementary/brands.json');
const brandIds = new Set(brands.map(b => b.id));
const newBrands = [
    {
        id: 'brand_mizuno', name: 'Mizuno', country: 'Japan',
        description: '日本発スポーツブランド。Wave Enforce Tour 2でピックルボールシューズ市場に参入。Wave テクノロジーで安定性と反発性を両立。',
        product_categories: ['シューズ'], website_url: 'https://mizuno.com', founding_year: 1906
    },
    {
        id: 'brand_new_balance', name: 'New Balance', country: 'USA',
        description: 'FuelCell 996v6でピックルボール市場に参入。FuelCell Foamミッドソールの推進力が特徴。',
        product_categories: ['シューズ'], website_url: 'https://newbalance.com', founding_year: 1906
    },
    {
        id: 'brand_hesacore', name: 'Hesacore', country: 'Germany',
        description: 'ハニカム構造の革新的グリップで知られるブランド。テニスで大人気となりPBにも波及。',
        product_categories: ['アクセサリー'], website_url: null
    },
    {
        id: 'brand_dink_eyewear', name: 'Dink Eyewear', country: 'USA',
        description: 'ピックルボール専用アイウェアブランド。ColorBoost™テクノロジーでボール視認性を最適化。',
        product_categories: ['アイウェア'], website_url: 'https://dinkeyewear.com'
    },
];
let brc = 0;
for (const nb of newBrands) { if (!brandIds.has(nb.id)) { brands.push(nb); brc++; } }
saveJson('supplementary/brands.json', brands);
console.log('ブランド新規追加: ' + brc + '件 (合計: ' + brands.length + '件)');

// 最終サマリー
console.log('\n========================================');
console.log('全カテゴリ最終件数');
console.log('========================================');
console.log('パドル: ' + loadJson('gears/paddles.json').length);
console.log('シューズ: ' + shoes.length);
console.log('ボール: ' + balls.length);
console.log('バッグ: ' + loadJson('gears/bags.json').length);
console.log('アパレル: ' + loadJson('gears/apparel.json').length);
console.log('アクセサリー: ' + accessories.length);
console.log('ニッチギア: ' + loadJson('supplementary/niche_gears.json').length);
console.log('ブランド: ' + brands.length);
const total = loadJson('gears/paddles.json').length + shoes.length + balls.length +
    loadJson('gears/bags.json').length + loadJson('gears/apparel.json').length +
    accessories.length + loadJson('supplementary/niche_gears.json').length;
console.log('合計アイテム: ' + total);
