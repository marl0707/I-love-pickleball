/**
 * アパレル・アクセサリー拡充 + パドルlength_in最終補完
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
// 1. パドルlength_in補完
// ============================================
const paddles = loadJson('gears/paddles.json');
const pSpecs = {
    'paddle_franklin_signature_14': { length_in: 15.75, width_in: 8 },
    'pdl_vulcan_v520_control': { length_in: 15.5, width_in: 7.75 },
    'pdl_franklin_ben_johns': { length_in: 16, width_in: 8 },
    'pdl_franklin_carbon_stk': { length_in: 16, width_in: 8 },
    'pdl_diadem_warrior': { length_in: 16, width_in: 7.6 },
    'pdl_vatic_pro_v7': { length_in: 16.5, width_in: 7.5 },
    'pdl_hudef_viva_pro': { length_in: 15.9, width_in: 7.9 },
    'pdl_oneshot_aeroshoot': { length_in: 16.5, width_in: 7.5 },
    'pdl_prince_spectrum_pro': { length_in: 15.75, width_in: 8 },
    'pdl_gamma_never_stop': { length_in: 16.375, width_in: 7.375 },
    'pdl_asics_gel_paddle': { length_in: 16, width_in: 8 },
    'pdl_bnb_filth': { length_in: 16.5, width_in: 7.5 },
    'pdl_selkirk_labs_007': { length_in: 16.4, width_in: 7.4 },
    'pdl_selkirk_luxx_control': { length_in: 16.5, width_in: 7.375 },
    'pdl_11_six_24': { length_in: 16.5, width_in: 7.5 },
};
let plc = 0;
for (const p of paddles) { const s = pSpecs[p.id]; if (s) { Object.assign(p, s); plc++; } }
saveJson('gears/paddles.json', paddles);
console.log('パドルlength_in補完: ' + plc + '件');
console.log('length_in: ' + paddles.filter(p => p.length_in).length + '/' + paddles.length);

// ============================================
// 2. 新アパレル追加
// ============================================
const apparel = loadJson('gears/apparel.json');
const apparelIds = new Set(apparel.map(a => a.id));
const newApparel = [
    // JOOLA Ben Johns Propel Crewneck - ソース: joola.com.au
    {
        id: 'apparel_joola_propel_crew', brand_name: 'JOOLA', product_name: 'Ben Johns Propel Crewneck Shirt',
        category: 'トップス', description: 'マイクロメッシュ織りで通気性抜群。吸湿速乾。Ben Johns公式モデル。',
        features: ['マイクロメッシュ織り', '吸湿速乾', 'フルレンジモーション設計'],
        color_variations: ['Black', 'White', 'Navy'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Selkirk Men's Performance Shorts - ソース: selkirk.com
    {
        id: 'apparel_selkirk_perf_shorts', brand_name: 'Selkirk', product_name: 'Essentials 9" Performance Shorts',
        category: 'ボトムス', description: '軽量・通気・吸湿速乾の高機能ショーツ。UPF防御、4方向ストレッチ、防臭加工。',
        features: ['軽量', '吸湿速乾', 'UPF防御', '4方向ストレッチ', '速乾', 'シワ防止', '防臭'],
        color_variations: ['Black', 'Navy', 'Grey'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Selkirk Women's Dress - ソース: selkirk.com
    {
        id: 'apparel_selkirk_dress', brand_name: 'Selkirk', product_name: 'Performance Pickleball Dress',
        category: 'ワンピース', description: '通気性素材、内蔵ショーツ、UPFプロテクション搭載のピックルボール用ドレス。',
        features: ['通気性素材', '内蔵ショーツ', 'UPFプロテクション'],
        color_variations: ['White', 'Black'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Lululemon Pace Breaker Shorts
    {
        id: 'apparel_lulu_pace_breaker', brand_name: 'Lululemon', product_name: 'Pace Breaker Lined Short 7"',
        category: 'ボトムス', description: 'ピックルボールプレイヤーに人気のLululemonショーツ。軽量・速乾・ライナー付き。',
        features: ['Swift fabric', 'ライナー付き', '速乾', '軽量'],
        color_variations: ['Black', 'True Navy', 'Dark Olive'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Lululemon Metal Vent Tech Tee
    {
        id: 'apparel_lulu_metal_vent', brand_name: 'Lululemon', product_name: 'Metal Vent Tech Short-Sleeve Shirt 2.0',
        category: 'トップス', description: 'メタルベントテクノロジーで通気性・防臭性に優れたトレーニングTシャツ。',
        features: ['Silverescent防臭', '通気性メッシュ', '速乾'],
        color_variations: ['Black', 'White', 'Heathered Grey'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Nike Pickleball Tee
    {
        id: 'apparel_nike_pb_tee', brand_name: 'Nike', product_name: 'Dri-FIT Pickleball T-Shirt',
        category: 'トップス', description: 'Nike Dri-FIT テクノロジーで吸湿速乾。ピックルボール専用デザイン。',
        features: ['Dri-FIT吸湿速乾', 'コットンポリブレンド', 'リラックスフィット'],
        color_variations: ['White', 'Black'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // PB5star Performance Polo
    {
        id: 'apparel_pb5star_polo', brand_name: 'PB5star', product_name: 'Performance Polo',
        category: 'トップス', description: '2025年注目のPB専用アパレルブランド。高品質パフォーマンスポロ。',
        features: ['吸湿速乾', 'UPF50+', '4方向ストレッチ'],
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // Vuori Knit Twill Polo
    {
        id: 'apparel_vuori_polo', brand_name: 'Vuori', product_name: 'Knit Twill Polo',
        category: 'トップス', description: 'リサイクル素材使用。4方向ストレッチ＆吸湿速乾。コート内外で着用可能。',
        features: ['リサイクル素材', '4方向ストレッチ', '吸湿速乾', 'オン/オフコート兼用'],
        color_variations: ['Navy', 'Grey', 'White'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
];
let ac = 0;
for (const na of newApparel) { if (!apparelIds.has(na.id)) { apparel.push(na); ac++; } }
saveJson('gears/apparel.json', apparel);
console.log('アパレル新規追加: ' + ac + '件 (合計: ' + apparel.length + '件)');

// ============================================
// 3. 新アクセサリー追加
// ============================================
const accessories = loadJson('gears/accessories.json');
const accIds = new Set(accessories.map(a => a.id));
const newAcc = [
    // オーバーグリップ
    {
        id: 'acc_selkirk_comfort_grip', brand_name: 'Selkirk', product_name: 'Sport Comfort Overgrip (3pack)',
        category: 'オーバーグリップ', description: 'Selkirk公式のコンフォートオーバーグリップ。クッション性と汗吸収に優れる。',
        color_variations: ['White', 'Black'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    {
        id: 'acc_crbn_drytec', brand_name: 'CRBN', product_name: 'DryTec Overgrip',
        category: 'オーバーグリップ', description: 'CRBN公式のドライテックオーバーグリップ。優れた汗吸収力。',
        color_variations: ['White'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    {
        id: 'acc_tourna_grip', brand_name: 'Tourna', product_name: 'Tourna Grip Pickleball',
        category: 'オーバーグリップ', description: 'テニスで定番のTourna Gripピックルボール版。汗で濡れるとグリップ力が増す。',
        color_variations: ['Blue'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // リードテープ
    {
        id: 'acc_selkirk_lead_tape', brand_name: 'Selkirk', product_name: 'Tungsten Weight Tape',
        category: 'リードテープ', description: '非毒性タングステンウェイトテープ。パドルのバランスとパワーを調整。鉛フリー。',
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // コートラインマーカー
    {
        id: 'acc_a11n_court_markers', brand_name: 'A11N', product_name: 'Pickleball Court Markers Kit',
        category: 'コートマーカー', description: 'L字・T字の柔軟なコートラインマーカーキット。計測スティック付き。視認性の高い黄色。',
        features: ['L字/T字マーカー', '計測スティック付き', 'ポータブル'],
        color_variations: ['Yellow'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // スコアキーパー
    {
        id: 'acc_pb_scorecard', brand_name: 'PB Scorecard', product_name: 'PB Scorecard App (DUPR連携)',
        category: 'スコアキーパー', description: 'オンラインスコアカード。DUPR連携で試合結果を自動送信。審判・大会主催者にも対応。',
        features: ['DUPR連携', 'スマホ/PC対応', '試合結果自動送信'],
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // ポータブルネット
    {
        id: 'acc_a11n_portable_net', brand_name: 'A11N', product_name: 'Professional Pickleball Net System 22ft',
        category: 'ポータブルネット', description: '22フィートのレギュレーションサイズポータブルネット。安定性と耐久性に優れる。',
        features: ['22フィートレギュレーション', 'パウダーコートスチールフレーム', '簡単セットアップ'],
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    // リバウンドネット
    {
        id: 'acc_a11n_rebounder', brand_name: 'A11N', product_name: 'Practice Rebounder Net',
        category: 'リバウンダー', description: 'ソロ練習用リバウンドネット。ディンク・ボレー・グラウンドストロークの練習に最適。',
        features: ['角度調整可能', 'ポータブル', '自立型'],
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
];
let acc = 0;
for (const na of newAcc) { if (!accIds.has(na.id)) { accessories.push(na); acc++; } }
saveJson('gears/accessories.json', accessories);
console.log('アクセサリー新規追加: ' + acc + '件 (合計: ' + accessories.length + '件)');

// ============================================
// 4. 新ブランド追加 (アパレル)
// ============================================
const brands = loadJson('supplementary/brands.json');
const brandIds = new Set(brands.map(b => b.id));
const newBrands = [
    {
        id: 'brand_pb5star', name: 'PB5star', country: 'USA',
        description: '2025年注目のピックルボール専用アパレルブランド。高品質かつスタイリッシュなデザイン。',
        product_categories: ['アパレル'], website_url: 'https://pb5star.com'
    },
    {
        id: 'brand_vuori', name: 'Vuori', country: 'USA',
        description: 'サステナブル素材を使用したプレミアムアスレジャーブランド。ピックルボールプレイヤーに人気。',
        product_categories: ['アパレル'], website_url: 'https://vuori.com'
    },
    {
        id: 'brand_lululemon', name: 'Lululemon', country: 'Canada',
        description: '世界的プレミアムアスレジャーブランド。ピックルボール市場にも進出し、Life Timeの公式アパレルパートナー。',
        product_categories: ['アパレル'], website_url: 'https://lululemon.com'
    },
    {
        id: 'brand_a11n', name: 'A11N', country: 'USA',
        description: 'ピックルボール用ネット・コートマーカー・リバウンダーを製造するアクセサリーブランド。',
        product_categories: ['アクセサリー', 'ネット'], website_url: null
    },
    {
        id: 'brand_tourna', name: 'Tourna', country: 'USA',
        description: 'テニス発祥のグリップテープブランド。Tourna GripはPBプレイヤーにも人気。',
        product_categories: ['アクセサリー'], website_url: null
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
console.log('パドル: ' + paddles.length + ' (length_in: ' + paddles.filter(p => p.length_in).length + ')');
console.log('シューズ: ' + loadJson('gears/shoes.json').length);
console.log('ボール: ' + loadJson('gears/balls.json').length);
console.log('バッグ: ' + loadJson('gears/bags.json').length);
console.log('アパレル: ' + apparel.length);
console.log('アクセサリー: ' + accessories.length);
console.log('ニッチギア: ' + loadJson('supplementary/niche_gears.json').length);
console.log('ブランド: ' + brands.length);
