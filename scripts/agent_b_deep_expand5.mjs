/**
 * パドルlength_in + シューズprice + コートルールデータ追加
 * Web検索で確認した実在情報のみ。
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = join(__dirname, '..', 'production_data');
function loadJson(r) { return JSON.parse(readFileSync(join(BASE, r), 'utf-8')); }
function saveJson(r, d) { writeFileSync(join(BASE, r), JSON.stringify(d, null, 2) + '\n', 'utf-8'); }

// ============================================
// 1. パドル length_in 補完
// ============================================
const paddles = loadJson('gears/paddles.json');
const paddleLengths = {
    'pdl_selkirk_slk_evo': 16.0, 'pdl_gearbox_cx14e': 16.625,
    'pdl_joola_anna_bright': 16.0, 'pdl_joola_collin_johns': 16.0,
    'pdl_joola_solaire': 16.5, 'pdl_joola_perseus': 16.5,
    'pdl_engage_pursuit_pro_mx': 16.5, 'pdl_crbn_trufoam_genesis': 16.5,
    'pdl_selkirk_luxx_control': 16.4, 'pdl_selkirk_labs_007': 16.4,
    'pdl_electrum_pro_ii': 16.5, 'pdl_volair_mach1_forza': 16.5,
    'pdl_gruvn_mula': 16.5, 'pdl_diadem_vice': 16.0,
    'pdl_proxr_advantage': 16.5, 'pdl_proxr_titan': 16.0,
    'pdl_ronbus_r3': 16.0, 'pdl_legacy_pro': 16.5,
    'pdl_owl_quiet': 15.75, 'pdl_gearbox_cp7': 16.625,
    'pdl_vulcan_v940': 16.5, 'pdl_vulcan_v520_control': 15.75,
    'pdl_vulcan_v900_max': 16.5, 'pdl_paddletek_tsunami': 16.25,
    'pdl_paddletek_tempest': 15.875,
};
let lc = 0;
for (const p of paddles) {
    if (paddleLengths[p.id] && !p.length_in) { p.length_in = paddleLengths[p.id]; lc++; }
}
saveJson('gears/paddles.json', paddles);
console.log('パドルlength_in追加: ' + lc + '件 (' + paddles.filter(p => p.length_in).length + '/' + paddles.length + ')');

// ============================================
// 2. シューズ残りprice_usd設定
// ============================================
const shoes = loadJson('gears/shoes.json');
const shoePrices = {
    'shoe_tyrol_drive_v': { price_usd: 160.00 },
    'shoe_acacia_tyler': { price_usd: 129.99 },
    'shoe_diadem_court_burst': { price_usd: 149.95 },
    'shoe_selkirk_courtstrike': { price_usd: 149.99 },
    'shoe_19': { price_usd: 135.00 }, // Wilson Rush Pro 4.0
    'shoe_22': { price_usd: 119.95 }, // Lotto Mirage 600 II
    'shoe_23': { price_usd: 119.95 }, // Mizuno Wave Exceed Light 3
    'shoe_24': { price_usd: 79.95 }, // Mizuno Break Shot 5
    'shoe_25': { price_usd: 139.95 }, // Diadora Speed Blushield
    'shoe_26': { price_usd: 89.95 }, // Prince PR Court Ace
    'shoe_29': { price_usd: 119.95 }, // adidas Stycon
    'shoe_30': { price_usd: 99.99 }, // UA HOVR Court Ace
};
let spc = 0;
for (const s of shoes) {
    const pr = shoePrices[s.id];
    if (pr && !s.price_usd) { Object.assign(s, pr); spc++; }
}
saveJson('gears/shoes.json', shoes);
console.log('シューズprice追加: ' + spc + '件 (' + shoes.filter(s => s.price_usd).length + '/' + shoes.length + ')');

// ============================================
// 3. コートルール情報データ作成
// ============================================
const courtRules = {
    court_dimensions: {
        length_ft: 44, width_ft: 20,
        length_m: 13.41, width_m: 6.1,
        recommended_play_area: { length_ft: 60, width_ft: 30 },
        description: 'ピックルボールコートはバドミントンのダブルスコートと同じサイズ。'
    },
    net: {
        height_sideline_in: 36, height_center_in: 34,
        height_sideline_m: 0.91, height_center_m: 0.86,
        width_ft: 21.75,
        description: 'ネットはサイドラインで36インチ(91cm)、中央で34インチ(86cm)。2インチの差がダイナミックなネットプレイを促す。'
    },
    non_volley_zone: {
        depth_ft: 7, depth_m: 2.13,
        description: 'ネットから7フィート(2.13m)のノンボレーゾーン(キッチン)。この中ではボレー(ノーバウンドで打つこと)は禁止。'
    },
    service_court: {
        length_ft: 15, width_ft: 10,
        description: 'サービスコートは各サイド15フィート×10フィート。サーブは対角線上に打つ。'
    },
    scoring: {
        game_points: 11, win_by: 2,
        tournament_options: [11, 15, 21],
        description: '通常11点先取、2点差で勝利。トーナメントでは15点/21点の場合もある。サービング側のみ得点可能。'
    },
    key_rules: [
        { name: '2バウンスルール', description: 'サーブ後、レシーブ側は1回バウンドさせてから返球。サーブ側も1回バウンドさせてから返球。その後はボレーOK。' },
        { name: 'アンダーハンドサーブ', description: 'サーブはアンダーハンドストロークで、ウエスト以下でパドルのヘッドが手首の最高点より下で打つ。' },
        { name: 'キッチンルール', description: 'ノンボレーゾーン(キッチン)内ではボレー禁止。バウンド後は打球OK。モメンタムで入るのもフォルト。' },
        { name: 'ドロップサーブ', description: 'ボールを落としてバウンドさせてからサーブも可能。この場合、高さと腕の弧の制限は適用されない。' },
    ]
};
saveJson('supplementary/court_rules.json', courtRules);
console.log('コートルール情報: 作成完了');

// ============================================
// 4. グリップ交換ガイドデータ作成
// ============================================
const gripGuide = {
    id: 'guide_grip_replacement',
    title: 'ピックルボールパドル グリップ交換ガイド',
    description: 'グリップテープの交換方法。12時間のプレイ後、またはグリップが滑りやすく感じたら交換時期。',
    grip_types: [
        { type: 'リプレースメントグリップ', description: 'ベースグリップの交換。元のグリップを完全に剥がして新しいものに巻き替える。' },
        { type: 'オーバーグリップ', description: '既存のベースグリップの上に巻くもの。太さの調整やタック感の改善に。' },
    ],
    steps: [
        '1. 古いグリップをはさみでカットして剥がす',
        '2. 残った粘着テープを除去する',
        '3. 新しいグリップのテーパー端をバットキャップの底に合わせる',
        '4. バットキャップを1周巻く',
        '5. 1/8インチずつ重ねながら上に巻いていく（テンションをかけるのがコツ）',
        '6. 上端まで巻いたら余分をカット',
        '7. フィニッシングテープで上端を固定',
    ],
    tips: [
        '右利き: テープを右に引きながら巻く',
        '左利き: テープを左に引きながら巻く',
        'テンションをかけてシワを防ぐ',
        'オーバーグリップは30-45度の角度で巻く',
    ],
};
const nicheFile = 'supplementary/niche_gears.json';
const niche = loadJson(nicheFile);
const nicheIds = new Set(niche.map(n => n.id));
if (!nicheIds.has('niche_grip_guide')) {
    niche.push({
        id: 'niche_grip_guide', category: 'メンテナンスガイド',
        name: 'グリップ交換ガイド', brand: '各種',
        description: gripGuide.description, features: gripGuide.steps.slice(0, 4),
    });
    saveJson(nicheFile, niche);
    console.log('ニッチギアにグリップガイド追加');
} else {
    console.log('グリップガイド既存');
}

// サマリー
console.log('\n========================================');
const bl = loadJson('gears/balls.json'), bg = loadJson('gears/bags.json'),
    ap = loadJson('gears/apparel.json'), ax = loadJson('gears/accessories.json'),
    rv = loadJson('players/expert_reviews.json'), br = loadJson('supplementary/brands.json'),
    tg = loadJson('supplementary/master_tags.json');
console.log('パドル:' + paddles.length + ' シューズ:' + shoes.length + ' ボール:' + bl.length + ' バッグ:' + bg.length);
console.log('アパレル:' + ap.length + ' アクセサリー:' + ax.length + ' ニッチ:' + niche.length + ' ブランド:' + br.length);
console.log('レビュー:' + rv.length + ' タグ:' + tg.length);
console.log('パドルprice: ' + paddles.filter(p => p.price_usd).length + '/' + paddles.length);
console.log('シューズprice: ' + shoes.filter(s => s.price_usd).length + '/' + shoes.length);
console.log('パドルlength: ' + paddles.filter(p => p.length_in).length + '/' + paddles.length);
console.log('パドルgrip_length: ' + paddles.filter(p => p.grip_length_in).length + '/' + paddles.length);
