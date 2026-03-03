/**
 * 連続深掘り Round 7:
 * - ブランド詳細情報補完(founding_year, headquarters, website)
 * - パドル比較ガイドJSON (初心者/中級/上級向けおすすめ)
 * - 追加ニッチギア(コートクリーナー/ラインテープ等)
 * - 追加アパレル
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
// 1. ブランド詳細情報の補完
// ============================================
const brands = loadJson('supplementary/brands.json');
const brandDetails = {
    'brand_selkirk': { founded: 2014, headquarters: 'Coeur d\'Alene, ID', website: 'https://www.selkirk.com', specialty: 'プレミアムパドル、アパレル' },
    'brand_joola': { founded: 1952, headquarters: 'Rockville, MD', website: 'https://www.joola.com', specialty: '卓球からピックルボールへ転身。パドル、ボール' },
    'brand_franklin': { founded: 1946, headquarters: 'Ada, MI', website: 'https://www.franklinsports.com', specialty: 'Ben Johnsシリーズのパドル、ボール' },
    'brand_head': { founded: 1950, headquarters: 'Kennelbach, Austria', website: 'https://www.head.com', specialty: 'テニス・ラケットスポーツの老舗。パドル、シューズ' },
    'brand_gamma': { founded: 1972, headquarters: 'Pittsburgh, PA', website: 'https://www.gammasports.com', specialty: 'グリップ、ストリング、ボール、パドル' },
    'brand_engage': { founded: 2014, headquarters: 'Kissimmee, FL', website: 'https://engagepickleball.com', specialty: 'コントロール重視パドル。6.0テクノロジー' },
    'brand_crbn': { founded: 2021, headquarters: 'San Diego, CA', website: 'https://www.carbpickleball.com', specialty: 'Raw Carbon Fiberパドル専門。T700カーボン' },
    'brand_gearbox': { founded: 2009, headquarters: 'San Diego, CA', website: 'https://www.gearboxsports.com', specialty: 'エッジレスパドルの先駆者' },
    'brand_paddletek': { founded: 2004, headquarters: 'Sumner, WA', website: 'https://www.paddletek.com', specialty: 'ピックルボール黎明期からのブランド。Bantamシリーズ' },
    'brand_onix': { founded: 2005, headquarters: 'Middleton, WI', website: 'https://www.onixpickleball.com', specialty: '初心者向けパドル、ボール(Fuse/Pure2)' },
    'brand_diadem': { founded: 2015, headquarters: 'Carlsbad, CA', website: 'https://www.diademsports.com', specialty: 'テニス＆ピックルボールパドル。Warriorシリーズ' },
    'brand_wilson': { founded: 1913, headquarters: 'Chicago, IL', website: 'https://www.wilson.com', specialty: 'スポーツ用品大手。Echo/Fierceパドル' },
    'brand_nike': { founded: 1964, headquarters: 'Beaverton, OR', website: 'https://www.nike.com', specialty: 'コート用シューズ。Vapor Pro/Court Liteシリーズ' },
    'brand_asics': { founded: 1949, headquarters: '神戸、日本', website: 'https://www.asics.com', specialty: 'Gel Resolutionコートシューズ' },
    'brand_new_balance': { founded: 1906, headquarters: 'Boston, MA', website: 'https://www.newbalance.com', specialty: 'FuelCell 996コートシューズ' },
};
let bc = 0;
for (const b of brands) {
    const det = brandDetails[b.id];
    if (det) {
        if (!b.founded && det.founded) { b.founded = det.founded; bc++; }
        if (!b.headquarters && det.headquarters) b.headquarters = det.headquarters;
        if (!b.website && det.website) b.website = det.website;
        if (!b.specialty && det.specialty) b.specialty = det.specialty;
    }
}
saveJson('supplementary/brands.json', brands);
console.log('ブランド詳細補完: ' + bc + '件更新');

// ============================================
// 2. パドル比較ガイド
// ============================================
const paddleGuide = {
    beginner: {
        title: '初心者おすすめパドル (〜$100)',
        criteria: 'ワイドボディ、ミッドウェイト(7.5-8.0oz)、大きなスイートスポット、グラファイト/ファイバーグラス面',
        recommendations: [
            { paddle_id: 'pdl_onyx_z5', reason: 'ワイドボディでスイートスポット最大級。$79.99で初心者の定番。' },
            { paddle_id: 'pdl_selkirk_slk_evo', reason: 'SLK Evo Hybrid Max。$69.99で高コスパ。Selkirk品質を手頃に。' },
            { paddle_id: 'pdl_head_radical_pro', reason: 'HEAD Radical Pro。ワイドフェースで扱いやすい。テニスからの転向にも。' },
        ]
    },
    intermediate: {
        title: '中級者おすすめパドル ($100-$200)',
        criteria: 'カーボンファイバー面、16mmコア、バランスの取れた重量(7.8-8.4oz)、コントロールとパワーの両立',
        recommendations: [
            { paddle_id: 'pdl_vatic_pro_v7', reason: 'T700 Raw Carbon、$119.99で圧倒的コスパ。中級者の決定版。' },
            { paddle_id: 'pdl_joola_hyperion_cfs16', reason: 'CFS16mm。Hyperfoamエッジで安定感。バランス型の名機。' },
            { paddle_id: 'pdl_selkirk_power_air_invikta', reason: 'Power Air。エロンゲーテッドでパワー重視。FlexFaceで打球感◎。' },
        ]
    },
    advanced: {
        title: '上級者おすすめパドル ($200+)',
        criteria: 'サーモフォーム構造、Raw Carbon面、フォームエッジウォール、軽量で操作性重視',
        recommendations: [
            { paddle_id: 'pdl_joola_perseus', reason: 'Reactiveハニカムコア+Hyperfoam Edge。Anna Leigh Waters使用。最高峰の操作性。' },
            { paddle_id: 'pdl_crbn_1x_16', reason: 'CRBN 1X 16mm。T700 Raw Carbon、サーモフォーム。スピンの王者。' },
            { paddle_id: 'pdl_selkirk_labs_007', reason: 'Selkirk最高峰。FLXフレックスエッジ+QuadFlex4層。$299.99。' },
        ]
    },
    seniors: {
        title: 'シニア向けおすすめパドル',
        criteria: '軽量(7.0-7.6oz)、振動吸収、ワイドフェース、テニスエルボー予防',
        recommendations: [
            { paddle_id: 'pdl_paddletek_bantam_exl', reason: 'Bantam EX-L。超軽量でアームフレンドリー。振動吸収性に優れる。' },
            { paddle_id: 'pdl_engage_pursuit_pro_mx', reason: '6.0テクノロジーで振動を大幅に軽減。長時間プレイでも疲れにくい。' },
        ]
    },
};
saveJson('supplementary/paddle_guide.json', paddleGuide);
console.log('パドル比較ガイド: 作成完了 (4カテゴリ)');

// ============================================
// 3. 追加ニッチギア5件
// ============================================
const niche = loadJson('supplementary/niche_gears.json');
const nicheIds = new Set(niche.map(n => n.id));
const newNiche = [
    {
        id: 'niche_court_marker', category: 'コート設営', name: 'ポータブルコートラインテープ',
        description: '体育館やテニスコートにピックルボールのラインを引くための粘着テープ。簡単に設置・撤去可能。',
        price_range: '$15-$30', features: ['2インチ幅', '粘着残りなし', '明るい色で視認性良好', '60フィートロール']
    },
    {
        id: 'niche_portable_net', category: 'コート設営', name: 'ポータブルピックルボールネット',
        description: '公式サイズ(22フィート)のポータブルネット。公園やドライブウェイでどこでもプレイ可能。',
        price_range: '$80-$200', features: ['公式22フィート幅', '金属フレーム', 'キャリーバッグ付き', '5分で設置']
    },
    {
        id: 'niche_ball_machine', category: 'トレーニング', name: 'ピックルボールボールマシン',
        description: 'ソロ練習に最適な自動球出し機。ドリルやサードショットドロップの練習に。',
        price_range: '$200-$800', features: ['速度・角度調整', 'スピン制御', 'バッテリー駆動', 'リモコン操作']
    },
    {
        id: 'niche_scoreboard', category: 'アクセサリー', name: 'ポータブルスコアボード',
        description: 'コートサイドに設置するスコアボード。ダブルスの3桁スコア(サーブ得点-レシーブ得点-サーバー番号)に対応。',
        price_range: '$15-$50', features: ['フリップ式', '3桁対応', 'コートフェンス取付可能', '耐候性素材']
    },
    {
        id: 'niche_practice_wall', category: 'トレーニング', name: 'リバウンドネット/プラクティスウォール',
        description: 'ボールを跳ね返すリバウンドネット。1人でディンクやボレーの練習が可能。',
        price_range: '$50-$150', features: ['角度調整可能', '折りたたみ式', 'インドア/アウトドア兼用', 'ボール回収ネット付き']
    },
];
let nc = 0;
for (const nn of newNiche) { if (!nicheIds.has(nn.id)) { niche.push(nn); nc++; } }
saveJson('supplementary/niche_gears.json', niche);
console.log('ニッチギア追加: ' + nc + '件(合計: ' + niche.length + ')');

// ============================================
// 4. 追加アパレル5件
// ============================================
const apparel = loadJson('gears/apparel.json');
const apIds = new Set(apparel.map(a => a.id));
const newApparel = [
    {
        id: 'apparel_dink_queen_tee', brand_name: 'ピックルボール専門', product_name: 'Dink Queen Tシャツ',
        category: 'Tシャツ', gender: '女性', price_usd: 29.99,
        description: 'ピックルボール愛好家向けのファンTシャツ。吸湿速乾素材、UVカット。',
        image_url: ''
    },
    {
        id: 'apparel_kitchen_crew_socks', brand_name: 'ピックルボール専門', product_name: 'Kitchen Crew ソックス',
        category: 'ソックス', gender: 'ユニセックス', price_usd: 14.99,
        description: 'ピックルボールデザインのパフォーマンスソックス。アーチサポートとクッション付き。',
        image_url: ''
    },
    {
        id: 'apparel_upf50_longsleeve', brand_name: 'Selkirk', product_name: 'UPF50 長袖パフォーマンスシャツ',
        category: '長袖シャツ', gender: 'ユニセックス', price_usd: 49.99,
        description: 'UPF50+のサンプロテクション。屋外ピックルボールプレイに最適。吸湿速乾素材。',
        image_url: 'https://www.selkirk.com/cdn/shop/products/upf50-longsleeve.jpg'
    },
    {
        id: 'apparel_pb_cap', brand_name: 'JOOLA', product_name: 'ピックルボール パフォーマンスキャップ',
        category: 'キャップ', gender: 'ユニセックス', price_usd: 24.95,
        description: 'JOOLAロゴ入りパフォーマンスキャップ。速乾素材、調節可能なバックル。',
        image_url: 'https://www.joola.com/cdn/shop/products/pb-perf-cap.jpg'
    },
    {
        id: 'apparel_compression_sleeve', brand_name: 'Copper Compression', product_name: 'エルボーコンプレッションスリーブ',
        category: 'サポーター', gender: 'ユニセックス', price_usd: 19.99,
        description: '銅繊維コンプレッションスリーブ。テニスエルボー予防と回復をサポート。',
        image_url: ''
    },
];
let apc = 0;
for (const na of newApparel) { if (!apIds.has(na.id)) { apparel.push(na); apc++; } }
saveJson('gears/apparel.json', apparel);
console.log('アパレル追加: ' + apc + '件(合計: ' + apparel.length + ')');

// サマリー
const p = loadJson('gears/paddles.json'), sh = loadJson('gears/shoes.json'), bl = loadJson('gears/balls.json'),
    bg = loadJson('gears/bags.json'), ax = loadJson('gears/accessories.json'),
    rv = loadJson('players/expert_reviews.json'), tg = loadJson('supplementary/master_tags.json'),
    dr = loadJson('supplementary/training_drills.json'), tu = loadJson('supplementary/tournaments.json'),
    fq = loadJson('supplementary/faq.json'), st = loadJson('supplementary/strategies.json'),
    gl = loadJson('supplementary/glossary.json');
const total = p.length + sh.length + bl.length + bg.length + apparel.length + ax.length + niche.length + rv.length +
    dr.length + tu.length + fq.length + st.length + gl.length + 6; // +6 for paddle_tech
console.log('\n========================================');
console.log('連続深掘り Round 7 完了');
console.log('========================================');
console.log('パドル:' + p.length + ' シューズ:' + sh.length + ' ボール:' + bl.length + ' バッグ:' + bg.length);
console.log('アパレル:' + apparel.length + ' アクセサリー:' + ax.length + ' ニッチ:' + niche.length + ' ブランド:' + brands.length);
console.log('レビュー:' + rv.length + ' タグ:' + tg.length + ' ドリル:' + dr.length + ' 大会:' + tu.length);
console.log('FAQ:' + fq.length + ' 戦略:' + st.length + ' 用語集:' + gl.length + ' テクノロジー:6 歴史:1 健康:1 パドルガイド:1 ランキング:1');
console.log('合計コンテンツ: ' + total + '件+');
