/**
 * アパレル・レビュー・シューズ重量 深掘り拡充スクリプト
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
// 1. 新アパレル追加（スカート/ヘッドウェア/ライナー）
// ============================================
const apparel = loadJson('gears/apparel.json');
const apparelIds = new Set(apparel.map(a => a.id));
const newApparel = [
    {
        id: 'apparel_selkirk_pleated_skirt', brand_name: 'Selkirk', product_name: 'Essentials Pleated Pickleball Skirt',
        category: 'スカート', description: '軽量・冷却・吸湿速乾・UPF防御・4方向ストレッチ。内蔵ライナー＋スマホポケット付き。',
        features: ['プリーツデザイン', '内蔵ライナーショーツ', 'UPF防御', '4方向ストレッチ', 'スマホポケット'],
        color_variations: ['White', 'Black', 'Navy'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    {
        id: 'apparel_lucky_love_skirt', brand_name: 'Lucky in Love', product_name: 'Pickleball Pleated Skort',
        category: 'スカート', description: 'テニス/ピックルボール用プリーツスコート。ファッション性と機能性を両立。',
        features: ['プリーツ', '内蔵ショーツ', '吸湿速乾'],
        color_variations: [], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    {
        id: 'apparel_junk_headband', brand_name: 'Junk Brands', product_name: 'Big Bang Lite Headband (Pickle Party)',
        category: 'ヘッドバンド', description: 'Technical T-Shirt素材。滑り止め・吸湿速乾・通気性。PBデザイン。',
        features: ['Technical T-Shirt素材', 'ノンスリップ', '吸湿速乾', '通気性'],
        color_variations: ['Pickle Party'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    {
        id: 'apparel_nike_swoosh_headband', brand_name: 'Nike', product_name: 'Swoosh Headband',
        category: 'ヘッドバンド', description: 'Nikeの定番テリーループヘッドバンド。コットン/ナイロン/ラバー混紡で汗吸収。',
        features: ['テリーループ素材', '汗吸収', 'フィット感'],
        color_variations: ['White', 'Black', 'Red'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    {
        id: 'apparel_selkirk_visor', brand_name: 'Selkirk', product_name: 'Performance Visor',
        category: 'バイザー', description: 'Selkirk公式パフォーマンスバイザー。軽量・通気性・UV防御。',
        features: ['軽量', '通気性', 'UV防御', '調整可能'],
        color_variations: ['White', 'Black'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
    {
        id: 'apparel_joola_shorts', brand_name: 'JOOLA', product_name: 'Ben Johns Performance Shorts',
        category: 'ボトムス', description: 'Ben Johns監修のパフォーマンスショーツ。軽量・通気・吸湿速乾。',
        features: ['軽量', '通気性', '吸湿速乾', 'ストレッチ'],
        color_variations: ['Black', 'Navy'], amazon_url: null, rakuten_url: null, yahoo_url: null, price: null
    },
];
let ac = 0;
for (const na of newApparel) { if (!apparelIds.has(na.id)) { apparel.push(na); ac++; } }
saveJson('gears/apparel.json', apparel);
console.log('アパレル新規追加: ' + ac + '件 (合計: ' + apparel.length + '件)');

// ============================================
// 2. 新レビュー追加
// ============================================
const reviews = loadJson('players/expert_reviews.json');
const reviewIds = new Set(reviews.map(r => r.id));
const newReviews = [
    {
        id: 'rev_selkirk_slk_evo', paddle_id: 'pdl_selkirk_slk_evo', reviewer: 'pickleballeffect.com',
        rating: 4.2, date: '2024-06-15',
        pros: ['手頃な価格で最新テクノロジー', 'SpinFlex™面でスピン性能良好', '7.8ozと軽量で腕への負担少', '初中級者に最適'],
        cons: ['上級者には物足りないパワー', 'edge guard部分がやや分厚い'],
        summary: 'Selkirk SLK Evoは手頃な価格で最新のサーモフォーミングとカーボンファイバー技術を搭載。Rev-Hybrid Polymerコアの広いスイートスポットが初中級者に最適。SpinFlex™面でスピンも良好。'
    },
    {
        id: 'rev_joola_hyperion_cfs14', paddle_id: 'pdl_joola_hyperion_cfs14', reviewer: 'pickleballstudio.com',
        rating: 4.6, date: '2024-04-20',
        pros: ['16mmより軽くスイングが速い', 'Carbon Flex3面でスピン良好(1500+ RPM)', 'Hyperfoam Edge Wallで甘いスイートスポット', 'キッチンでの攻撃性'],
        cons: ['ハンドルの耐久性に不安あり(初期ロット)', '16mmほどのコントロールはない'],
        summary: 'JOOLA Hyperion CFS 14mmは16mm版のヘッド重さ問題を改善。速いスイングとポップ力を両立し、キッチンでのアグレッシブなプレイに最適。'
    },
    {
        id: 'rev_crbn_1x_power', paddle_id: 'pdl_crbn_1x_16', reviewer: 'pickleheads.com',
        rating: 4.7, date: '2024-03-10',
        pros: ['スピン性能10/10', 'パワーとコントロールのバランス秀逸', 'ユニボディ+フォーム注入エッジで堅牢', '広いスイートスポット'],
        cons: ['価格が高め', 'スイングウェイトがやや重い'],
        summary: 'CRBN 1X Power Seriesは中級者向けパワー重視パドルの最高峰。T700 Raw Carbon面でスピン性能抜群。ユニボディ構造とフォーム注入エッジで耐久性と安定性を両立。'
    },
    {
        id: 'rev_head_gravity_tour', paddle_id: 'pdl_head_gravity_tour', reviewer: 'racquetdepot.com',
        rating: 4.4, date: '2024-05-05',
        pros: ['12K Raw Carbon面で高スピン', '17mmコアの優れたコントロール', 'FoamedCoreで快適な打球感', '安定感抜群'],
        cons: ['8.4-8.5ozとやや重い', 'グリップサイズの選択肢が限定的'],
        summary: 'HEAD Gravity Tourは17mm厚コアでコントロール重視設計。12K Raw Carbon面で高スピンを実現。FoamedCoreで振動を吸収し快適。安定性を重視する中上級者に最適。'
    },
    {
        id: 'rev_sixzero_dbd_16', paddle_id: 'pdl_sixzero_dbd_16', reviewer: 'pickleballdepot.ca',
        rating: 4.5, date: '2024-07-01',
        pros: ['Toray 700K Raw CF面でトップクラスのスピン', 'サーモフォームで耐久性◎', 'ハイブリッドシェイプで万能型', '8.1ozのバランスの良い重量'],
        cons: ['やや高価', '初心者にはパワーが強すぎる場合あり'],
        summary: 'Six Zero Double Black Diamond 16mmはToray 700K Raw Carbon面でスピンとコントロールを両立。サーモフォーミングで堅牢性も確保。万能型ハイブリッドシェイプで幅広いプレーヤーに対応。'
    },
];
let rc = 0;
for (const nr of newReviews) { if (!reviewIds.has(nr.id)) { reviews.push(nr); rc++; } }
saveJson('players/expert_reviews.json', reviews);
console.log('レビュー新規追加: ' + rc + '件 (合計: ' + reviews.length + '件)');

// ============================================
// 3. 既存シューズ weight_grams 補完
// ============================================
const shoes = loadJson('gears/shoes.json');
const shoeWeights = {
    'shoe_asics_gel_res9': { weight_grams: 420 },
    'shoe_nike_gp_challenge': { weight_grams: 422 },
    'shoe_fila_axilus3': { weight_grams: 425 },
    'shoe_nike_vapor_pro2': { weight_grams: 380 },
    'shoe_kswiss_express_light3': { weight_grams: 340 },
    'shoe_babolat_jet_mach3': { weight_grams: 380 },
    'shoe_skechers_viper_court': { weight_grams: 312 },
    'shoe_head_motion_pro': { weight_grams: 413 },
    'shoe_mizuno_wave_enforce2': { weight_grams: 413 },
    'shoe_nb_fuelcell_996v6': { weight_grams: 352 },
};
let swc = 0;
for (const s of shoes) {
    const w = shoeWeights[s.id];
    if (w && !s.weight_grams) { Object.assign(s, w); swc++; }
}
saveJson('gears/shoes.json', shoes);
console.log('シューズweight_grams補完: ' + swc + '件');
console.log('weight_grams設定済み: ' + shoes.filter(s => s.weight_grams).length + '/' + shoes.length);

// ============================================
// 4. 新ブランド追加
// ============================================
const brands = loadJson('supplementary/brands.json');
const brandIds = new Set(brands.map(b => b.id));
const newBrands = [
    {
        id: 'brand_junk', name: 'Junk Brands', country: 'USA',
        description: 'ハイパフォーマンスヘッドバンドの専門ブランド。Technical T-Shirt素材のノンスリップ設計。',
        product_categories: ['ヘッドウェア'], website_url: 'https://junkbrands.com'
    },
    {
        id: 'brand_lucky_in_love', name: 'Lucky in Love', country: 'USA',
        description: 'テニス/PB用女性アパレルブランド。ファッション性の高いスコート/スカートで人気。',
        product_categories: ['アパレル'], website_url: 'https://shopluckyinlove.com'
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
const p = loadJson('gears/paddles.json'), sh = shoes, bl = loadJson('gears/balls.json'),
    bg = loadJson('gears/bags.json'), ap = apparel, ax = loadJson('gears/accessories.json'),
    ng = loadJson('supplementary/niche_gears.json'), br = brands, rv = reviews;
console.log('パドル: ' + p.length + ' | シューズ: ' + sh.length + ' | ボール: ' + bl.length);
console.log('バッグ: ' + bg.length + ' | アパレル: ' + ap.length + ' | アクセサリー: ' + ax.length);
console.log('ニッチギア: ' + ng.length + ' | ブランド: ' + br.length + ' | レビュー: ' + rv.length);
const total = p.length + sh.length + bl.length + bg.length + ap.length + ax.length + ng.length;
console.log('合計アイテム数: ' + total);
