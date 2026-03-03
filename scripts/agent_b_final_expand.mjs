/**
 * 最終拡充スクリプト
 * 1. 残り12パドルのスペック補完
 * 2. 新バッグ5件追加
 * 3. 新ニッチギア6件追加
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
// 1. 残り12パドルのweight_oz補完
// ============================================
const paddles = loadJson('gears/paddles.json');
const paddleSpecs = {
    'pdl_oneshot_aeroshoot': { weight_oz: '7.9', face_material: 'Carbon Fiber', core_material: 'Polypropylene Honeycomb', usapa_approved: true },
    'pdl_kswiss_hypercourt': { weight_oz: '7.8-8.2', face_material: 'Carbon Fiber', core_material: 'Polymer Honeycomb', usapa_approved: true },
    'pdl_asics_court_speed': { weight_oz: '8.0', face_material: 'Carbon Fiber', core_material: 'Polymer Honeycomb', usapa_approved: true },
    'pdl_pickleball_apes': { weight_oz: '7.8-8.2', face_material: 'Carbon Fiber', core_material: 'Polymer Honeycomb (Thermoformed)', usapa_approved: true },
    'pdl_the_kitchen': { weight_oz: '8.0-8.3', face_material: 'Raw Carbon Fiber', core_material: 'Polymer Honeycomb', usapa_approved: true },
    'pdl_11_six_24': { weight_oz: '8.0-8.3', face_material: 'Raw Carbon Fiber', core_material: 'Polypropylene Honeycomb', usapa_approved: true },
    'pdl_juciao_pro': { weight_oz: '8.0', face_material: 'Carbon Fiber', core_material: 'Polypropylene Honeycomb (Thermoformed Unibody)', usapa_approved: true },
    'pdl_zcebra_gorilla': { weight_oz: '7.8-8.2', face_material: 'Carbon Fiber', core_material: 'Polymer Honeycomb', usapa_approved: true },
    'pdl_friday_challenger': { weight_oz: '7.8-8.0', face_material: 'Fiberglass', core_material: 'Polymer Honeycomb', usapa_approved: true },
    'pdl_spinhaven_velocity': { weight_oz: '7.9-8.2', face_material: 'Carbon Fiber', core_material: 'Polymer Honeycomb', usapa_approved: true },
    'pdl_owl_quiet': { weight_oz: '7.9', face_material: 'Carbon Fiber', core_material: 'Polymer Honeycomb (静音設計)', usapa_approved: true },
    'pdl_proxr_titan': { weight_oz: '8.0-8.4', face_material: 'T700 Raw Carbon Fiber', core_material: 'Polypropylene Honeycomb', usapa_approved: true },
};
let pc = 0;
for (const p of paddles) {
    const s = paddleSpecs[p.id];
    if (s) { Object.assign(p, s); pc++; }
}
saveJson('gears/paddles.json', paddles);
console.log('パドルweight補完: ' + pc + '件');
console.log('weight_oz: ' + paddles.filter(p => p.weight_oz).length + '/' + paddles.length);

// ============================================
// 2. 新バッグ追加
// ============================================
const bags = loadJson('gears/bags.json');
const bagIds = new Set(bags.map(b => b.id));
const newBags = [
    // Selkirk Core Line Team Bag - ソース: selkirk.com
    {
        id: 'bag_selkirk_team', brand_name: 'Selkirk', product_name: 'Core Line Team Bag',
        bag_type: 'バックパック', paddle_count: 3, has_shoe_compartment: false,
        has_laptop_sleeve: true, has_fence_hook: true,
        material: '+V11 Max Polyfiber Performance',
        special_features: ['Hard EVAトップ(スマホポケット)', 'フェンスクリップ', '15インチPC収納', '内部ジッパーポケット3個', 'メッシュ水筒ポケット'],
        description: 'パドル3本+ノートPC+小物を収納できる中型バックパック。フェンスに掛けられるクリップ付き。',
        color_variations: ['Black', 'White'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // CRBN Pro Team Backpack - ソース: crbnpickleball.com
    {
        id: 'bag_crbn_pro_team', brand_name: 'CRBN', product_name: 'Pro Team Backpack',
        bag_type: 'バックパック', paddle_count: 3, has_shoe_compartment: true,
        has_laptop_sleeve: true, has_fence_hook: true,
        material: '500D Polyester + 防水ターポリン底面',
        dimensions: '21.5"H x 12.5"W x 8"D',
        special_features: ['サーマルライニング付パドル収納', '断熱サイドポケット', 'YKKジッパー', 'デュアルコーティングメタルフェンスフック', 'エアメッシュパッド入りストラップ'],
        description: '2025年人気No.1。パドル3本+シューズ+ノートPC収納、断熱ポケット付きの最上位バックパック。',
        color_variations: ['Black'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Franklin Ben Johns Sling Bag - ソース: franklinsports.com
    {
        id: 'bag_franklin_sling', brand_name: 'Franklin', product_name: 'Ben Johns Pickleball Sling Bag',
        bag_type: 'スリングバッグ', paddle_count: 6, has_shoe_compartment: true,
        has_laptop_sleeve: false, has_fence_hook: true,
        special_features: ['フェルトライニング付デバイスポケット', '通気性シューズトンネル', 'パドル最大6本収納', 'X-40ボール収納スペース'],
        description: 'Ben Johns監修スリングバッグ。パドル6本+シューズ+ボール収納。バックパック/スリング2WAY。',
        color_variations: ['Black/Green'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Gearbox Court Backpack
    {
        id: 'bag_gearbox_court', brand_name: 'Gearbox', product_name: 'Court Backpack',
        bag_type: 'バックパック', paddle_count: 2, has_shoe_compartment: true,
        has_laptop_sleeve: true, has_fence_hook: false,
        description: 'Gearbox公式のコートバックパック。パドル2本+シューズ+ノートPC収納。',
        color_variations: ['Black'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // FORWRD Court Caddy - ソース: forwrd.co (2025年注目)
    {
        id: 'bag_forwrd_court_caddy', brand_name: 'FORWRD', product_name: 'Court Caddy',
        bag_type: 'コートバッグ', paddle_count: 4, has_shoe_compartment: true,
        has_laptop_sleeve: false, has_fence_hook: true,
        special_features: ['サーマルパドル保護', 'ベンチレーテッドシューズ区画', 'クイックアクセスボールポケット', 'ウォーターボトルホルダー'],
        description: '2025年注目の新ブランドFORWRD。先進的な収納システムで全ギアを整理。',
        color_variations: ['Black', 'Navy'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
];
let bc = 0;
for (const nb of newBags) { if (!bagIds.has(nb.id)) { bags.push(nb); bc++; } }
saveJson('gears/bags.json', bags);
console.log('バッグ新規追加: ' + bc + '件 (合計: ' + bags.length + '件)');

// ============================================
// 3. 新ニッチギア追加
// ============================================
const niche = loadJson('supplementary/niche_gears.json');
const nicheIds = new Set(niche.map(n => n.id));
const newNiche = [
    // ボールマシン
    {
        id: 'niche_titan_one_machine', category: 'ボールマシン', name: 'Titan ONE Ball Machine',
        brand: 'Titan', description: 'アプリ制御のボールマシン。プリロードドリル付き。カスタムドリル作成可能。',
        features: ['アプリ制御', 'プリロードドリル', 'カスタムドリル作成', '可変球速・スピン']
    },
    {
        id: 'niche_erne_machine', category: 'ボールマシン', name: 'Erne Pickleball Machine',
        brand: 'Erne', description: '最大150球収容の高性能ボールマシン。スマートフォンアプリでドリルプログラミング。',
        features: ['150球収容', 'スマホアプリ制御', '可変球速', '水平オシレーション']
    },
    // トレーニングエイド
    {
        id: 'niche_potenza_smartx', category: 'スマートパドル', name: 'Potenza SMARTx COREx4',
        brand: 'Potenza', description: '内蔵センサーでスイング速度・パワー・スピンを計測。モバイルアプリ連携。',
        features: ['内蔵センサー', 'スイング分析', 'スピン計測', 'モバイルアプリ連携']
    },
    {
        id: 'niche_pb_vision_ai', category: 'AI分析ツール', name: 'PB Vision',
        brand: 'PB Vision', description: 'AI搭載の試合分析ツール。映像からショット軌道・コート移動・サーブ効果を分析。',
        features: ['AI映像分析', 'ショット軌道追跡', 'コート移動分析', 'サーブ/リターン効果']
    },
    {
        id: 'niche_lightning_loop', category: 'トレーニングウェイト', name: 'Lightning Loop',
        brand: 'Lightning Loop', description: 'パドル装着型ウェイト。野球のウェイテッドドーナツと同様の概念。',
        features: ['パドル装着型', '重量調整可能', 'スイング筋力強化']
    },
    // リバウンダー
    {
        id: 'niche_swingit_rebounder', category: 'リバウンダー', name: 'SWINGIT Practice Rebounder Net',
        brand: 'SWINGIT', description: '2-in-1リバウンダー。リバウンダーとミニネットに変換可能。角度調整可能。',
        features: ['2-in-1変換', '角度調整', 'ポータブル', 'ディンク・ボレー練習']
    },
];
let nc = 0;
for (const nn of newNiche) { if (!nicheIds.has(nn.id)) { niche.push(nn); nc++; } }
saveJson('supplementary/niche_gears.json', niche);
console.log('ニッチギア新規追加: ' + nc + '件 (合計: ' + niche.length + '件)');

// ============================================
// 新ブランド追加 (バッグ・ニッチギア)
// ============================================
const brands = loadJson('supplementary/brands.json');
const brandIds = new Set(brands.map(b => b.id));
const newBrands = [
    {
        id: 'brand_forwrd', name: 'FORWRD', country: 'USA',
        description: '2025年注目のピックルボールバッグ・アクセサリーブランド。先進的収納システムが特徴。',
        product_categories: ['バッグ'], website_url: 'https://forwrd.co'
    },
    {
        id: 'brand_titan_pb', name: 'Titan (Pickleball)', country: 'USA',
        description: 'ボールマシンとパドルを製造するピックルボールブランド。アプリ連携機能が充実。',
        product_categories: ['ボールマシン', 'パドル'], website_url: null
    },
    {
        id: 'brand_erne', name: 'Erne (Machine)', country: 'USA',
        description: '高性能ピックルボールマシンブランド。最大150球収容の大容量モデル。',
        product_categories: ['ボールマシン'], website_url: null
    },
    {
        id: 'brand_oneshot', name: 'OneShot', country: 'USA',
        description: 'Aeroシリーズのピックルボールパドルブランド。Aeroshoot/Proshot/Powershotを展開。',
        product_categories: ['パドル'], website_url: null
    },
    {
        id: 'brand_11six24', name: '11SIX24', country: 'USA',
        description: 'Power/Pegasus/Vaporシリーズのピックルボールパドルブランド。',
        product_categories: ['パドル'], website_url: 'https://11six24.com'
    },
    {
        id: 'brand_juciao', name: 'Juciao', country: 'China',
        description: 'Thermoformedパドルを製造するピックルボールブランド。WU KONGシリーズで知られる。',
        product_categories: ['パドル'], website_url: null
    },
    {
        id: 'brand_gruvn', name: 'GRUVN', country: 'USA',
        description: 'Mulaシリーズでコスパの高い高性能パドルを提供するブランド。T700 Raw CF面。',
        product_categories: ['パドル'], website_url: 'https://gruvn.co'
    },
    {
        id: 'brand_owl', name: 'OWL', country: 'USA',
        description: '静音設計のピックルボールパドルブランド。騒音制限コート向け。CX/PXシリーズ展開。',
        product_categories: ['パドル'], website_url: null
    },
];
let brc = 0;
for (const nb of newBrands) { if (!brandIds.has(nb.id)) { brands.push(nb); brc++; } }
saveJson('supplementary/brands.json', brands);
console.log('ブランド新規追加: ' + brc + '件 (合計: ' + brands.length + '件)');

// 最終サマリー
console.log('\n========================================');
console.log('最終データ拡充サマリー');
console.log('========================================');
console.log('パドル: ' + paddles.length + '件 (weight_oz: ' + paddles.filter(p => p.weight_oz).length + '/' + paddles.length + ')');
console.log('シューズ: ' + loadJson('gears/shoes.json').length + '件');
console.log('ボール: ' + loadJson('gears/balls.json').length + '件');
console.log('バッグ: ' + bags.length + '件');
console.log('アパレル: ' + loadJson('gears/apparel.json').length + '件');
console.log('アクセサリー: ' + loadJson('gears/accessories.json').length + '件');
console.log('ニッチギア: ' + niche.length + '件');
console.log('ブランド: ' + brands.length + '件');
