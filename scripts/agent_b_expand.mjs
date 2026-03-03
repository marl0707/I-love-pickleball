/**
 * エージェントB データ種類拡充スクリプト
 * 2024-2025年の人気新モデルを追加 + 新ブランドを追加
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

// =====================================================
// 新パドル追加（2024-2025年のトレンドモデル）
// =====================================================
const paddles = loadJson('gears/paddles.json');
const existingIds = new Set(paddles.map(p => p.id));

const newPaddles = [
    // Bread & Butter Loco - ソース: pickleheads.com, youtube.com (2025年ベストハイブリッドパドル)
    {
        id: 'pdl_bnb_loco', brand_name: 'Bread & Butter', product_name: 'Loco',
        face_material: 'Raw Carbon Fiber (T700)', core_material: 'Polypropylene Honeycomb (Foam Injected)',
        core_thickness: 16, weight_oz: '8.0-8.3', length_in: 16.5, width_in: 7.5,
        usapa_approved: true, paddle_shape: 'Elongated(長方形)',
        description: '2025年ベストハイブリッドパドル。コントロールとパワーの絶妙なバランス。',
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Bread & Butter The Filth - ソース: 101-pickleball.com (2025年ベストパワーパドル)
    {
        id: 'pdl_bnb_filth', brand_name: 'Bread & Butter', product_name: 'The Filth',
        face_material: 'Raw Carbon Fiber', core_material: 'Polypropylene Honeycomb',
        core_thickness: 14, weight_oz: '8.2-8.5', usapa_approved: true,
        paddle_shape: 'Elongated(長方形)',
        description: '2025年パワー重視の予算向けベストパドル。',
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Honolulu Sword & Shield J2NF - ソース: weartesters.com, mattspickleball.com
    {
        id: 'pdl_honolulu_j2nf', brand_name: 'Honolulu Pickleball Co', product_name: 'Sword & Shield J2NF',
        face_material: 'Raw Carbon Fiber', core_material: 'Foam Core (Thermoformed)',
        core_thickness: 16, weight_oz: '8.0-8.3', length_in: 16.5, width_in: 7.5,
        usapa_approved: true, paddle_shape: 'Elongated(長方形)',
        description: '2025年最高評価のフォームパドル。パワー・スピン・コントロール全てにおいて高スコア。',
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // CRBN³ TruFoam Genesis - ソース: crbnpickleball.com, pickleballwarehouse.com
    {
        id: 'pdl_crbn_trufoam_genesis', brand_name: 'CRBN', product_name: 'TruFoam Genesis',
        face_material: 'Raw Carbon Fiber (T700)', core_material: 'TruFoam Core (Thermoformed)',
        core_thickness: 16, weight_oz: '8.0-8.3', length_in: 16.5, width_in: 7.5,
        usapa_approved: true, paddle_shape: 'Elongated(長方形)',
        description: 'CRBNの最新フォームコアパドル。エリートレベルのスピン・パワー・コントロール。',
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Selkirk Labs Project 007 - ソース: selkirk.com, pickleballwarehouse.com
    {
        id: 'pdl_selkirk_labs_007', brand_name: 'Selkirk', product_name: 'Labs Project 007',
        face_material: 'Carbon Fiber (ProSpin+ NextGen)',
        core_material: 'SuperCore Polymer Honeycomb + FlexFoam Perimeter',
        core_thickness: 16, weight_oz: '7.8-8.2',
        usapa_approved: true, paddle_shape: 'Elongated(長方形)',
        description: '2025年Selkirkの最新ラボシリーズ。最高峰のスイートスポットとスピン性能。',
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Selkirk LUXX Control Air Epic - ソース: selkirk.com (2025年ベストコントロールパドル)
    {
        id: 'pdl_selkirk_luxx_control', brand_name: 'Selkirk', product_name: 'LUXX Control Air Epic',
        face_material: 'Carbon Fiber (ProSpin+)',
        core_material: 'SuperCore Polymer + Air Dynamic Throat',
        core_thickness: 16, weight_oz: '7.7-8.2',
        usapa_approved: true, paddle_shape: 'Elongated(長方形)',
        description: '2025年コントロール特化パドル。Air Dynamic Throatで空気抵抗を軽減。',
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Electrum Model E Elite - ソース: racketsandrunners.ca, custompickleballbands.com
    {
        id: 'pdl_electrum_elite', brand_name: 'Electrum', product_name: 'Model E Elite',
        face_material: 'Raw Carbon Fiber', core_material: 'Polymer Honeycomb (Foam Injected Perimeter)',
        core_thickness: 14, weight_oz: '7.9-8.2', length_in: 16, width_in: 8,
        usapa_approved: true, paddle_shape: 'Standard(標準)',
        description: '2025年スピン特化パドル。フォーム注入ペリメータで安定性向上。',
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // SixZero Coral - ソース: padelspeed.com (2025年オールコート推奨)
    {
        id: 'pdl_sixzero_coral', brand_name: 'Six Zero', product_name: 'Coral',
        face_material: 'Carbon Fiber (Japanese Toray)', core_material: 'Honeycomb Polymer Core',
        core_thickness: 16, weight_oz: '8.0-8.2', length_in: 16.3, width_in: 7.5,
        usapa_approved: true, paddle_shape: 'Hybrid(AeroCurve)',
        description: '初級〜中級者向けの寛容性の高いオールコートパドル。',
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
];

let paddleAdded = 0;
for (const np of newPaddles) {
    if (!existingIds.has(np.id)) { paddles.push(np); paddleAdded++; }
}
saveJson('gears/paddles.json', paddles);
console.log(`パドル新規追加: ${paddleAdded}件 (合計: ${paddles.length}件)`);

// =====================================================
// 新シューズ追加（ピックルボール専用シューズブランド）
// =====================================================
const shoes = loadJson('gears/shoes.json');
const shoeIds = new Set(shoes.map(s => s.id));

const newShoes = [
    // Tyrol Drive-V - ソース: tyrolpickleball.com (PB専用設計)
    {
        id: 'shoe_tyrol_drive_v', brand_name: 'Tyrol', product_name: 'Drive-V',
        outsole: 'Vibram® Rubber (ピックルボール専用設計)',
        midsole: 'EVA Cushioning',
        insole: 'Removable (カスタムオルソティック対応)',
        stability: 'Curved Heel Stabilizer + Torsion Control Shank',
        court_type: 'オールコート',
        description: 'ピックルボール専用設計。Vibram®ソールで抜群のグリップ。広い深いトゥボックスで足指保護。',
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Acacia Tyler Signature - ソース: acaciasports.com (PB専用)
    {
        id: 'shoe_acacia_tyler', brand_name: 'Acacia', product_name: 'Tyler Signature Edition Pro',
        outsole: 'Rubber (Non-Marking)',
        midsole: 'Honeycomb Memory Foam',
        stability: 'Heel Control Stability (HCS)',
        court_type: 'オールコート',
        description: 'チャンピオンTyler Loong監修。Acaciaで最も軽量かつ敏敏なモデル。ProFlexアッパー搭載。',
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Diadem Court Burst - ソース: diadem, pickleheads.com
    {
        id: 'shoe_diadem_court_burst', brand_name: 'Diadem', product_name: 'Court Burst',
        outsole: 'Non-Marking Rubber',
        midsole: 'Responsive Cushioning',
        court_type: 'オールコート',
        description: '2025年トップ推奨。軽量＋強力サポートの融合。レスポンシブクッションで快適性抜群。',
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Selkirk CourtStrike Pro - ソース: thedinkpickleball.com
    {
        id: 'shoe_selkirk_courtstrike', brand_name: 'Selkirk', product_name: 'CourtStrike Pro',
        outsole: 'Grippy Rubber (多方向トラクション)',
        midsole: 'Flexible Support Cushioning',
        court_type: 'オールコート',
        description: 'ピックルボール専用設計。多方向グリップ・柔軟サポート。',
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
];

let shoeAdded = 0;
for (const ns of newShoes) {
    if (!shoeIds.has(ns.id)) { shoes.push(ns); shoeAdded++; }
}
saveJson('gears/shoes.json', shoes);
console.log(`シューズ新規追加: ${shoeAdded}件 (合計: ${shoes.length}件)`);

// =====================================================
// 新ブランド追加
// =====================================================
const brands = loadJson('supplementary/brands.json');
const brandIds = new Set(brands.map(b => b.id));

const newBrands = [
    {
        id: 'brand_bread_butter', brand_name: 'Bread & Butter',
        description: '2024年に急成長したピックルボールパドルブランド。コストパフォーマンスの高いthermoformedパドルで人気。',
        product_categories: ['パドル'], website_url: 'https://breadandbutterpickleball.com',
        founded_year: 2023, hq_location: 'USA',
        notable_products: 'Loco (2025年ベストハイブリッド), The Filth (パワー特化)'
    },
    {
        id: 'brand_honolulu', brand_name: 'Honolulu Pickleball Company',
        description: 'ハワイ発のピックルボールブランド。フォームコアパドルで2025年にブレイク。',
        product_categories: ['パドル'], website_url: null,
        founded_year: 2024, hq_location: 'Honolulu, Hawaii, USA',
        notable_products: 'Sword & Shield J2NF (2025年最高峰フォームパドル)'
    },
    {
        id: 'brand_tyrol', brand_name: 'Tyrol',
        description: 'ピックルボール専用シューズブランド。Vibram®ソール採用で高いグリップ力を実現。',
        product_categories: ['シューズ'], website_url: 'https://tyrolpickleball.com',
        founded_year: null, hq_location: 'USA',
        notable_products: 'Drive-V, Velocity-V, Striker Pro-V',
        unique_tech: 'Vibram® Outsole + Wide/Deep Toe Box + Flow-Through Cooling'
    },
    {
        id: 'brand_acacia', brand_name: 'Acacia',
        description: 'ピックルボール専用シューズとアクセサリーブランド。軽量で快適な設計が特徴。',
        product_categories: ['シューズ'], website_url: 'https://acaciasports.com',
        founded_year: null, hq_location: 'USA',
        notable_products: 'Tyler Signature Pro, DinkShot, ProShot',
        notable_players: ['Tyler Loong(署名モデル)'],
        unique_tech: 'Honeycomb Memory Foam + ProFlex Upper + HCS'
    },
    {
        id: 'brand_electrum', brand_name: 'Electrum',
        description: '高性能ピックルボールパドルブランド。Model Eシリーズで知られる。',
        product_categories: ['パドル'], website_url: 'https://electrumpickleball.com',
        founded_year: null, hq_location: 'USA',
        notable_products: 'Model E Pro II, Model E Elite',
        unique_tech: 'Foam Injected Perimeter'
    },
    {
        id: 'brand_legacy', brand_name: 'Legacy Pro',
        description: 'Thermoformed構造のハイパフォーマンスパドルブランド。',
        product_categories: ['パドル'], website_url: null,
        notable_products: 'Legacy Pro (1900+ RPMスピン)'
    },
    {
        id: 'brand_proxr', brand_name: 'ProXR',
        description: 'プロ選手Zane Navratil共同開発のパドルブランド。6インチの長いグリップが特徴。',
        product_categories: ['パドル'], website_url: 'https://proxrpickleball.com',
        founded_year: null, hq_location: 'USA',
        notable_players: ['Zane Navratil'],
        notable_products: 'Zane Navratil Signature, The Sweet Spot',
        unique_tech: '6" Extended Handle + Shock Foam Perimeter'
    },
    {
        id: 'brand_ronbus', brand_name: 'Ronbus',
        description: 'コストパフォーマンスの高いthermoformedパドルで注目を集めるブランド。',
        product_categories: ['パドル'], website_url: null,
        founded_year: null, hq_location: 'USA',
        notable_products: 'R1 Nova, R2 Pulsar, R3 Pulsar FX'
    },
    {
        id: 'brand_vulcan', brand_name: 'Vulcan',
        description: '幅広い価格帯のパドルとボールを製造するピックルボールブランド。V900シリーズが上位モデル。',
        product_categories: ['パドル', 'ボール'], website_url: 'https://vulcanpickleball.com',
        founded_year: null, hq_location: 'USA',
        notable_products: 'V520 Control, V510 Hybrid, V930/V940, V520 Indoor Ball',
        unique_tech: 'Quatro-Carbon™ Face + ZEP9™ Core'
    },
];

let brandAdded = 0;
for (const nb of newBrands) {
    if (!brandIds.has(nb.id)) { brands.push(nb); brandAdded++; }
}
saveJson('supplementary/brands.json', brands);
console.log(`ブランド新規追加: ${brandAdded}件 (合計: ${brands.length}件)`);

// =====================================================
// 新ボール追加（2025年注目モデル）
// =====================================================
const balls = loadJson('gears/balls.json');
const ballIds = new Set(balls.map(b => b.id));

const newBalls = [
    // Selkirk Pro S1 Gold - ソース: selkirk.com
    {
        id: 'ball_selkirk_pro_s1_gold', brand_name: 'Selkirk', product_name: 'Pro S1 Gold Outdoor',
        ball_type: 'アウトドア用(40穴)', hole_count: 40, usapa_approved: true,
        description: 'Selkirk公式アウトドアボール。PPA Tour選定球。',
        color_variations: ['Yellow'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Wilson TRU 32 Indoor
    {
        id: 'ball_wilson_tru32_indoor', brand_name: 'Wilson', product_name: 'TRU 32 Indoor',
        ball_type: 'インドア用(32穴)', hole_count: 32, usapa_approved: true,
        description: 'Wilson独自の32穴デザイン。インドアプレイ向け。',
        color_variations: ['Yellow'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
];

let ballAdded = 0;
for (const nb of newBalls) {
    if (!ballIds.has(nb.id)) { balls.push(nb); ballAdded++; }
}
saveJson('gears/balls.json', balls);
console.log(`ボール新規追加: ${ballAdded}件 (合計: ${balls.length}件)`);

// =====================================================
// 最終統計
// =====================================================
console.log('\n========================================');
console.log('データ拡充サマリー');
console.log('========================================');
console.log(`パドル: ${paddles.length}件 (weight_oz: ${paddles.filter(p => p.weight_oz).length}件)`);
console.log(`シューズ: ${shoes.length}件`);
console.log(`ボール: ${balls.length}件`);
console.log(`ブランド: ${brands.length}件`);
