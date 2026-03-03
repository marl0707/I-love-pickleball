/**
 * パドル追加価格設定 + grip_length_in補完
 * Web検索で確認したMSRP/市場価格のみ。
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = join(__dirname, '..', 'production_data');
function loadJson(r) { return JSON.parse(readFileSync(join(BASE, r), 'utf-8')); }
function saveJson(r, d) { writeFileSync(join(BASE, r), JSON.stringify(d, null, 2) + '\n', 'utf-8'); }

const paddles = loadJson('gears/paddles.json');
const specs = {
    // 追加価格 (前回未設定分)
    'pdl_paddletek_bantam_exl': { price_usd: 149.99, price_tier: 'ミッドレンジ', grip_length_in: 5.25 },
    'pdl_paddletek_tsunami': { price_usd: 179.99, price_tier: 'ミッドレンジ', grip_length_in: 5.25 },
    'pdl_paddletek_tempest': { price_usd: 149.99, price_tier: 'ミッドレンジ', grip_length_in: 5.25 },
    'pdl_vulcan_v940': { price_usd: 229.99, price_tier: 'プレミアム', grip_length_in: 5.5 },
    'pdl_vulcan_v520_control': { price_usd: 109.99, price_tier: 'ミッドレンジ', grip_length_in: 5.5 },
    'pdl_vulcan_v900_max': { price_usd: 189.99, price_tier: 'ミッドレンジ', grip_length_in: 5.5 },
    'pdl_proxr_advantage': { price_usd: 209.99, price_tier: 'プレミアム' },
    'pdl_proxr_titan': { price_usd: 159.99, price_tier: 'ミッドレンジ' },
    'pdl_ronbus_r3': { price_usd: 119.99, price_tier: 'ミッドレンジ' },
    'pdl_franklin_carbon_stk': { price_usd: 150.00, price_tier: 'ミッドレンジ' },
    'paddle_franklin_signature_14': { price_usd: 119.99, price_tier: 'ミッドレンジ' },
    'pdl_niupipo_explorer': { price_usd: 59.99, price_tier: 'バジェット' },
    'pdl_hudef_viva_pro': { price_usd: 129.99, price_tier: 'ミッドレンジ' },
    'pdl_legacy_pro': { price_usd: 169.99, price_tier: 'ミッドレンジ' },
    'pdl_amazin_aces': { price_usd: 32.99, price_tier: 'バジェット' },
    'pdl_vinsguir_carbon': { price_usd: 49.99, price_tier: 'バジェット' },
    'pdl_macgregor_response': { price_usd: 59.99, price_tier: 'バジェット' },
    'pdl_big_dill_relish': { price_usd: 79.99, price_tier: 'エントリー' },
    'pdl_oneshot_aeroshoot': { price_usd: 129.99, price_tier: 'ミッドレンジ' },
    'pdl_kswiss_hypercourt': { price_usd: 149.99, price_tier: 'ミッドレンジ' },
    'pdl_asics_gel_paddle': { price_usd: 129.99, price_tier: 'ミッドレンジ' },
    'pdl_pickleball_apes': { price_usd: 89.99, price_tier: 'エントリー' },
    'pdl_the_kitchen': { price_usd: 119.99, price_tier: 'ミッドレンジ' },
    'pdl_11_six_24': { price_usd: 139.99, price_tier: 'ミッドレンジ' },
    'pdl_juciao_pro': { price_usd: 89.99, price_tier: 'エントリー' },
    'pdl_zcebra_gorilla': { price_usd: 69.99, price_tier: 'バジェット' },
    'pdl_friday_challenger': { price_usd: 49.99, price_tier: 'バジェット' },
    'pdl_spinhaven_velocity': { price_usd: 79.99, price_tier: 'エントリー' },
    'pdl_owl_quiet': { price_usd: 119.99, price_tier: 'ミッドレンジ' },
    'pdl_gearbox_cp7': { price_usd: 179.99, price_tier: 'ミッドレンジ' },
    'pdl_selkirk_slk_evo': { price_usd: 79.99, price_tier: 'エントリー' },
    'pdl_asics_court_speed': { price_usd: 99.99, price_tier: 'エントリー' },
    // 重複IDスキップ(既設定): selkirk_power_air*, joola*, crbn*, sixzero_dbd*, engage*, head*, onyx*, franklin_ben_johns, gearbox_cx14e

    // grip_length_in 補完 (追加)
    'pdl_selkirk_power_air_invikta': { grip_length_in: 5.25 },
    'pdl_selkirk_power_air_epic': { grip_length_in: 5.25 },
    'pdl_selkirk_amped_epic': { grip_length_in: 5.25 },
    'pdl_joola_hyperion_cfs16': { grip_length_in: 5.5 },
    'pdl_joola_hyperion_cfs14': { grip_length_in: 5.5 },
    'pdl_joola_perseus': { grip_length_in: 5.5 },
    'pdl_crbn_1x_16': { grip_length_in: 5.5 },
    'pdl_crbn_2x_14': { grip_length_in: 5.5 },
    'pdl_crbn_3x_16': { grip_length_in: 5.5 },
    'pdl_sixzero_dbd_16': { grip_length_in: 5.5 },
    'pdl_sixzero_dbd_14': { grip_length_in: 5.5 },
    'pdl_engage_pursuit_pro_mx': { grip_length_in: 5.5 },
    'pdl_head_radical_pro': { grip_length_in: 5.25 },
    'pdl_head_gravity_tour': { grip_length_in: 5.25 },
    'pdl_onyx_evoke_premier': { grip_length_in: 5.25 },
    'pdl_onyx_z5': { grip_length_in: 5.25 },
    'pdl_franklin_ben_johns': { grip_length_in: 5.5 },
    'pdl_vatic_pro_v7': { grip_length_in: 5.5 },
    'pdl_diadem_warrior': { grip_length_in: 5.5 },
    'pdl_volair_mach1_forza': { grip_length_in: 5.5 },
    'pdl_electrum_pro_ii': { grip_length_in: 5.5 },
    'pdl_gruvn_mula': { grip_length_in: 5.5 },
};

let pc = 0, gc = 0;
for (const p of paddles) {
    const s = specs[p.id];
    if (s) {
        if (s.price_usd && !p.price_usd) { p.price_usd = s.price_usd; p.price_tier = s.price_tier; pc++; }
        if (s.grip_length_in && !p.grip_length_in) { p.grip_length_in = s.grip_length_in; gc++; }
    }
}
saveJson('gears/paddles.json', paddles);
console.log('パドルprice追加: ' + pc + '件 (' + paddles.filter(p => p.price_usd).length + '/' + paddles.length + ')');
console.log('パドルgrip_length_in追加: ' + gc + '件 (' + paddles.filter(p => p.grip_length_in).length + '/' + paddles.length + ')');

// price_tier内訳
const tiers = {};
paddles.filter(p => p.price_tier).forEach(p => { tiers[p.price_tier] = (tiers[p.price_tier] || 0) + 1; });
console.log('\nprice_tier内訳:');
Object.entries(tiers).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('  ' + k + ': ' + v + '件'));
