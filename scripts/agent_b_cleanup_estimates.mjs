/**
 * 推定値クリーンアップスクリプト
 * 個別検証されていない推定データを全て削除する
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
// 1. パドル grip_length_in: Round1で標準値ベースで一括設定した55件を削除
//    Agent_b_continuous1.mjsで「パドル長に基づく標準値」で設定した分
//    元々50件はRound0以前に設定済みだったので、105-50=55件が推定値
//    しかし、どの55件が推定値かを正確に特定するため、
//    Round1スクリプトのロジック(パドル長ベースで5.5/5.25/4.5を設定)で設定されたものを特定
// ============================================
const paddles = loadJson('gears/paddles.json');
// Round1で設定した特定のgrip値パターンを持ち、かつ個別に検索して確認されていないものを削除
// 確認済みのgrip_length_in (previous rounds で個別にWeb調査で設定したもの)
const verifiedGrips = new Set([
    'pdl_selkirk_power_air_invikta', 'pdl_selkirk_power_air_epic',
    'pdl_selkirk_amped_epic', 'pdl_selkirk_slk_evo',
    'pdl_joola_hyperion_cfs16', 'pdl_joola_hyperion_cfs14',
    'pdl_joola_anna_bright', 'pdl_joola_perseus',
    'pdl_crbn_1x_16', 'pdl_crbn_2x_14', 'pdl_crbn_3x_16',
    'pdl_sixzero_dbd_16', 'pdl_sixzero_dbd_14',
    'pdl_engage_pursuit_pro_mx', 'pdl_head_radical_pro',
    'pdl_head_gravity_tour', 'pdl_gearbox_cx14e',
    'pdl_onyx_evoke_premier', 'pdl_onyx_z5',
    'pdl_franklin_ben_johns', 'pdl_vatic_pro_v7',
    'pdl_diadem_warrior', 'pdl_volair_mach1_forza',
    'pdl_electrum_pro_ii', 'pdl_prokennex_blackace',
    // prices2.mjs で追加した6件
    'pdl_paddletek_bantam_exl', 'pdl_paddletek_tempest',
    'pdl_gruvn_mula', 'pdl_wilson_juice',
    'pdl_niupipo_explorer', 'pdl_big_dill_relish',
    // deep_expand5で追加した分
    'pdl_legacy_pro_14', 'pdl_legacy_pro_16',
    'pdl_gamma_hellbender', 'pdl_gamma_obsidian',
    'pdl_vulcan_v740', 'pdl_vulcan_v760',
    // Round7で追加
    'pdl_electrum_elite', 'pdl_sixzero_coral', 'pdl_sixzero_bd_16',
]);

let gripRemoved = 0;
for (const p of paddles) {
    if (p.grip_length_in && !verifiedGrips.has(p.id)) {
        delete p.grip_length_in;
        gripRemoved++;
    }
}
console.log('パドル grip_length_in 推定値削除: ' + gripRemoved + '件');
console.log('パドル grip_length_in 残り: ' + paddles.filter(p => p.grip_length_in).length + '/' + paddles.length);

// ============================================
// 2. ボール diameter_in: 全31件を一律2.9にした分を削除
// ============================================
const balls = loadJson('gears/balls.json');
let ballDiaRemoved = 0, ballWtRemoved = 0;
for (const b of balls) {
    // diameter_inは全て一律設定だったので削除
    if (b.diameter_in === 2.9) { delete b.diameter_in; ballDiaRemoved++; }
    // weight_ozも一律設定(0.92/0.88)だったものを削除
    if (b.weight_oz === 0.92 || b.weight_oz === 0.88) { delete b.weight_oz; ballWtRemoved++; }
}
saveJson('gears/balls.json', balls);
console.log('ボール diameter_in 推定値削除: ' + ballDiaRemoved + '件');
console.log('ボール weight_oz 推定値削除: ' + ballWtRemoved + '件');

// ============================================
// 3. パドル width_in: Round3で設定した分は検索結果のプレミックスではなく
//    一般的な値で設定した可能性。検証済みのもの以外を削除
//    ※Round3のWeb検索結果から得たもの(ProKennex7.6, Wilson Echo8.0, Wilson Fierce8.0)は確認済み
// ============================================
const verifiedWidths = new Set([
    'pdl_prokennex_blackace', // 7.6 (Web検索で確認)
    'pdl_wilson_echo', // 8.0 (Web検索で確認)
    'pdl_wilson_fierce', // 8.0 (Web検索で確認)
]);
let widthRemoved = 0;
for (const p of paddles) {
    if (p.width_in && !verifiedWidths.has(p.id)) {
        delete p.width_in;
        widthRemoved++;
    }
}
saveJson('gears/paddles.json', paddles);
console.log('パドル width_in 未検証削除: ' + widthRemoved + '件');

// ============================================
// 4. 未検証レビュー: reviewer欄のサイトに実際に掲載されているか未確認のレビューを削除
//    Round1とRound4で追加した10件が対象
// ============================================
const reviews = loadJson('players/expert_reviews.json');
const unverifiedReviewIds = new Set([
    'rev_selkirk_labs_007', 'rev_engage_pursuit_pro', 'rev_vatic_pro_v7',
    'rev_franklin_carbon_stk', 'rev_onix_z5',
    'rev_asics_gr9', 'rev_nike_vapor_pro2', 'rev_kswiss_express',
    'rev_nb_fuelcell', 'rev_skechers_viper',
]);
const cleanedRevs = reviews.filter(r => !unverifiedReviewIds.has(r.id));
const revRemoved = reviews.length - cleanedRevs.length;
saveJson('players/expert_reviews.json', cleanedRevs);
console.log('未検証レビュー削除: ' + revRemoved + '件(残り: ' + cleanedRevs.length + ')');

// ============================================
// 5. 未検証アクセサリー: Round1で追加した5件(推定価格・未検証image_url)
// ============================================
const acc = loadJson('gears/accessories.json');
const unverifiedAccIds = new Set([
    'acc_overgrip_tourna', 'acc_lead_tape_selkirk', 'acc_dampener_gamma',
    'acc_ball_retriever', 'acc_sweatband_set',
]);
const cleanedAcc = acc.filter(a => !unverifiedAccIds.has(a.id));
const accRemoved = acc.length - cleanedAcc.length;
saveJson('gears/accessories.json', cleanedAcc);
console.log('未検証アクセサリー削除: ' + accRemoved + '件(残り: ' + cleanedAcc.length + ')');

// ============================================
// 6. 未検証アパレル: Round7で追加した5件(推定価格)
// ============================================
const apparel = loadJson('gears/apparel.json');
const unverifiedApIds = new Set([
    'apparel_dink_queen_tee', 'apparel_kitchen_crew_socks',
    'apparel_upf50_longsleeve', 'apparel_pb_cap', 'apparel_compression_sleeve',
]);
const cleanedAp = apparel.filter(a => !unverifiedApIds.has(a.id));
const apRemoved = apparel.length - cleanedAp.length;
saveJson('gears/apparel.json', cleanedAp);
console.log('未検証アパレル削除: ' + apRemoved + '件(残り: ' + cleanedAp.length + ')');

// ============================================
// 7. アパレル推定price_usd削除 (Round4で設定した分)
// ============================================
const apparelReloaded = loadJson('gears/apparel.json');
const verifiedApPrices = new Set([]); // Round4ではWeb検索なしで設定
let apPriceRemoved = 0;
for (const a of apparelReloaded) {
    if (a.price_usd && !verifiedApPrices.has(a.id)) {
        // Round4で設定したもの(joola_shorts 39.95 etc)
        const r4prices = {
            'apparel_joola_shorts': 39.95, 'apparel_selkirk_pleated_skirt': 64.99,
            'apparel_selkirk_visor': 29.99, 'apparel_nike_swoosh_headband': 12.00,
            'apparel_joola_polo': 49.95, 'apparel_selkirk_tshirt': 34.99,
            'apparel_adidas_aeroready': 45.00, 'apparel_puma_performance': 40.00
        };
        if (r4prices[a.id] === a.price_usd) { delete a.price_usd; apPriceRemoved++; }
    }
}
saveJson('gears/apparel.json', apparelReloaded);
console.log('アパレル推定price削除: ' + apPriceRemoved + '件');

// ============================================
// サマリー
// ============================================
console.log('\n========================================');
console.log('推定値クリーンアップ完了');
console.log('========================================');
const p2 = loadJson('gears/paddles.json'), s2 = loadJson('gears/shoes.json'),
    b2 = loadJson('gears/balls.json'), bg2 = loadJson('gears/bags.json'),
    ap2 = loadJson('gears/apparel.json'), ax2 = loadJson('gears/accessories.json');
console.log('パドル:' + p2.length + ' grip残:' + p2.filter(x => x.grip_length_in).length + ' width残:' + p2.filter(x => x.width_in).length);
console.log('ボール:' + b2.length + ' diameter残:' + b2.filter(x => x.diameter_in).length + ' weight残:' + b2.filter(x => x.weight_oz).length);
console.log('レビュー:' + cleanedRevs.length + ' アクセサリー:' + cleanedAcc.length + ' アパレル:' + ap2.length);
