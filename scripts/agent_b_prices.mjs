/**
 * 価格帯(price_usd) + 追加product_url設定
 * Web検索で確認したMSRP/市場価格のみ。嘘は一切つかない。
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
// 1. パドル price_usd 設定
// ============================================
const paddles = loadJson('gears/paddles.json');
const paddlePrices = {
    'pdl_selkirk_power_air_invikta': { price_usd: 249.99, price_tier: 'プレミアム' },
    'pdl_selkirk_power_air_epic': { price_usd: 249.99, price_tier: 'プレミアム' },
    'pdl_selkirk_amped_epic': { price_usd: 129.99, price_tier: 'ミッドレンジ' },
    'pdl_selkirk_slk_evo': { price_usd: 79.99, price_tier: 'エントリー' },
    'pdl_selkirk_labs_007': { price_usd: 299.99, price_tier: 'プレミアム' },
    'pdl_selkirk_luxx_control': { price_usd: 279.99, price_tier: 'プレミアム' },
    'pdl_joola_hyperion_cfs16': { price_usd: 219.95, price_tier: 'プレミアム' },
    'pdl_joola_hyperion_cfs14': { price_usd: 219.95, price_tier: 'プレミアム' },
    'pdl_joola_anna_bright': { price_usd: 219.95, price_tier: 'プレミアム' },
    'pdl_joola_collin_johns': { price_usd: 219.95, price_tier: 'プレミアム' },
    'pdl_joola_solaire': { price_usd: 199.95, price_tier: 'プレミアム' },
    'pdl_joola_perseus': { price_usd: 249.95, price_tier: 'プレミアム' },
    'pdl_crbn_1x_16': { price_usd: 229.99, price_tier: 'プレミアム' },
    'pdl_crbn_2x_14': { price_usd: 229.99, price_tier: 'プレミアム' },
    'pdl_crbn_3x_16': { price_usd: 229.99, price_tier: 'プレミアム' },
    'pdl_crbn_trufoam_genesis': { price_usd: 249.99, price_tier: 'プレミアム' },
    'pdl_sixzero_dbd_16': { price_usd: 199.99, price_tier: 'プレミアム' },
    'pdl_sixzero_dbd_14': { price_usd: 199.99, price_tier: 'プレミアム' },
    'pdl_engage_pursuit_pro_mx': { price_usd: 259.99, price_tier: 'プレミアム' },
    'pdl_head_radical_pro': { price_usd: 179.95, price_tier: 'ミッドレンジ' },
    'pdl_head_gravity_tour': { price_usd: 179.95, price_tier: 'ミッドレンジ' },
    'pdl_onyx_evoke_premier': { price_usd: 119.99, price_tier: 'ミッドレンジ' },
    'pdl_onyx_z5': { price_usd: 79.99, price_tier: 'エントリー' },
    'pdl_franklin_ben_johns': { price_usd: 119.99, price_tier: 'ミッドレンジ' },
    'pdl_gearbox_cx14e': { price_usd: 199.99, price_tier: 'プレミアム' },
    'pdl_paddletek_bantam_exl': { price_usd: 149.99, price_tier: 'ミッドレンジ' },
    'pdl_vatic_pro_v7': { price_usd: 119.99, price_tier: 'ミッドレンジ' },
    'pdl_diadem_warrior': { price_usd: 169.99, price_tier: 'ミッドレンジ' },
    'pdl_diadem_vice': { price_usd: 149.99, price_tier: 'ミッドレンジ' },
    'pdl_volair_mach1_forza': { price_usd: 199.99, price_tier: 'プレミアム' },
    'pdl_electrum_pro_ii': { price_usd: 199.99, price_tier: 'プレミアム' },
    'pdl_gruvn_mula': { price_usd: 89.99, price_tier: 'エントリー' },
    'pdl_gamma_never_stop': { price_usd: 99.99, price_tier: 'エントリー' },
    'pdl_prince_spectrum_pro': { price_usd: 129.99, price_tier: 'ミッドレンジ' },
    'pdl_wilson_profile': { price_usd: 89.99, price_tier: 'エントリー' },
};
let ppc = 0;
for (const p of paddles) {
    const pr = paddlePrices[p.id];
    if (pr && !p.price_usd) { Object.assign(p, pr); ppc++; }
}
saveJson('gears/paddles.json', paddles);
console.log('パドルprice_usd設定: ' + ppc + '件 (' + paddles.filter(p => p.price_usd).length + '/' + paddles.length + ')');

// ============================================
// 2. シューズ price_usd 設定
// ============================================
const shoes = loadJson('gears/shoes.json');
const shoePrices = {
    'shoe_asics_gel_resolution_9': { price_usd: 119.95 },
    'shoe_09': { price_usd: 139.95 }, // GR10
    'shoe_07': { price_usd: 79.95 }, // Gel-Renma
    'shoe_08': { price_usd: 69.95 }, // Gel-Dedicate 9
    'shoe_14': { price_usd: 120.00 }, // Nike Vapor Pro 2
    'shoe_15': { price_usd: 65.00 }, // Nike Court Lite 4
    'shoe_k_swiss_express_light': { price_usd: 104.95 },
    'shoe_01': { price_usd: 104.95 }, // K-Swiss Express Light 3
    'shoe_02': { price_usd: 89.95 }, // K-Swiss Speedex
    'shoe_nb_fuelcell_996v6': { price_usd: 134.99 },
    'shoe_12': { price_usd: 139.99 }, // NB Fresh Foam Lav v2
    'shoe_13': { price_usd: 134.99 }, // NB FuelCell 996v5.5
    'shoe_babolat_jet_mach_3': { price_usd: 159.00 },
    'shoe_10': { price_usd: 89.00 }, // Babolat Pulsion
    'shoe_11': { price_usd: 149.00 }, // Babolat Jet Tere
    'shoe_16': { price_usd: 139.00 }, // adidas SoleMatch Control 2
    'shoe_17': { price_usd: 159.00 }, // adidas Barricade 16
    'shoe_head_motion_pro': { price_usd: 129.95 },
    'shoe_18': { price_usd: 139.95 }, // HEAD Sprint Pro 3.5
    'shoe_19': { price_usd: 139.00 }, // Wilson Rush Pro 4.0
    'shoe_20': { price_usd: 119.00 }, // Yonex Fusionrev 5
    'shoe_21': { price_usd: 99.00 }, // Yonex Sonicage 3
    'shoe_mizuno_wave_enforce2': { price_usd: 129.95 },
    'shoe_skechers_viper_court': { price_usd: 89.99 },
    'shoe_06': { price_usd: 99.99 }, // Skechers Viper Court Luxe
    'shoe_27': { price_usd: 119.00 }, // FILA Axilus 3
    'shoe_04': { price_usd: 69.99 }, // FILA Double Bounce 3
    'shoe_selkirk_courtstrike': { price_usd: 149.99 },
};
let spc = 0;
for (const s of shoes) {
    const pr = shoePrices[s.id];
    if (pr && !s.price_usd) { Object.assign(s, pr); spc++; }
}
saveJson('gears/shoes.json', shoes);
console.log('シューズprice_usd設定: ' + spc + '件 (' + shoes.filter(s => s.price_usd).length + '/' + shoes.length + ')');

// サマリー
console.log('\n========================================');
console.log('price_usd設定状況');
console.log('========================================');
console.log('パドル: ' + paddles.filter(p => p.price_usd).length + '/' + paddles.length);
console.log('シューズ: ' + shoes.filter(s => s.price_usd).length + '/' + shoes.length);
