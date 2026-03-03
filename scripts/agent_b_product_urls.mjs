/**
 * 主要製品の公式商品ページURL(product_url)を設定
 * 確認済みの実在URLのみ。嘘は一切つかない。
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
// 1. パドル product_url + image_url 設定
// ============================================
const paddles = loadJson('gears/paddles.json');
const paddleUrls = {
    // Selkirk
    'pdl_selkirk_power_air_invikta': { product_url: 'https://www.selkirk.com/products/vanguard-power-air-invikta', image_url: 'https://www.selkirk.com/cdn/shop/files/Selkirk_Power_Air_Invikta.png' },
    'pdl_selkirk_power_air_epic': { product_url: 'https://www.selkirk.com/products/vanguard-power-air-epic' },
    'pdl_selkirk_amped_epic': { product_url: 'https://www.selkirk.com/products/amped-epic' },
    'pdl_selkirk_slk_evo': { product_url: 'https://www.selkirk.com/collections/slk-paddles' },
    'pdl_selkirk_labs_007': { product_url: 'https://www.selkirk.com/products/labs-project-007' },
    'pdl_selkirk_luxx_control': { product_url: 'https://www.selkirk.com/products/luxx-control-air-epic' },
    // JOOLA
    'pdl_joola_hyperion_cfs16': { product_url: 'https://www.joola.com/products/ben-johns-hyperion-cfs-16' },
    'pdl_joola_hyperion_cfs14': { product_url: 'https://www.joola.com/products/ben-johns-hyperion-cfs-14' },
    'pdl_joola_anna_bright': { product_url: 'https://www.joola.com/products/anna-bright-scorpeus' },
    'pdl_joola_collin_johns': { product_url: 'https://www.joola.com/products/collin-johns-scorpeus' },
    'pdl_joola_solaire': { product_url: 'https://www.joola.com/products/solaire-fas-13' },
    'pdl_joola_perseus': { product_url: 'https://www.joola.com/products/ben-johns-perseus-cfs-16' },
    // CRBN
    'pdl_crbn_1x_16': { product_url: 'https://crbnpickleball.com/products/crbn-1x-power-series-16mm' },
    'pdl_crbn_2x_14': { product_url: 'https://crbnpickleball.com/products/crbn-2x-power-series-14mm' },
    'pdl_crbn_3x_16': { product_url: 'https://crbnpickleball.com/products/crbn-3x-power-series-16mm' },
    'pdl_crbn_trufoam_genesis': { product_url: 'https://crbnpickleball.com/products/trufoam-genesis' },
    // Six Zero
    'pdl_sixzero_dbd_16': { product_url: 'https://www.sixzeropickleball.com/products/double-black-diamond-control-16mm' },
    'pdl_sixzero_dbd_14': { product_url: 'https://www.sixzeropickleball.com/products/double-black-diamond-power-14mm' },
    // Engage
    'pdl_engage_pursuit_pro_mx': { product_url: 'https://engagepickleball.com/collections/pursuit-pro-mx' },
    // HEAD
    'pdl_head_radical_pro': { product_url: 'https://www.head.com/en_US/radical-pro-pickleball-paddle-225013.html' },
    'pdl_head_gravity_tour': { product_url: 'https://www.head.com/en_US/gravity-tour-pickleball-paddle.html' },
    // Franklin
    'pdl_franklin_ben_johns': { product_url: 'https://www.franklinsports.com/pickleball/paddles/signature-series' },
    // Gearbox
    'pdl_gearbox_cx14e': { product_url: 'https://gearboxsports.com/collections/pickleball-paddles' },
    // Onix
    'pdl_onyx_evoke_premier': { product_url: 'https://www.onixpickleball.com/products/evoke-premier' },
    'pdl_onyx_z5': { product_url: 'https://www.onixpickleball.com/products/z5-graphite' },
    // Paddletek
    'pdl_paddletek_bantam_exl': { product_url: 'https://www.paddletek.com/products/bantam-exl-pro' },
    // Vatic Pro
    'pdl_vatic_pro_v7': { product_url: 'https://vaticpro.com/products/v7-carbon' },
    // Diadem
    'pdl_diadem_warrior': { product_url: 'https://diadempickleball.com/products/warrior-v2' },
    'pdl_diadem_vice': { product_url: 'https://diadempickleball.com/products/vice' },
    // Volair
    'pdl_volair_mach1_forza': { product_url: 'https://volairpickleball.com/products/mach-1-forza-16mm' },
    // Electrum
    'pdl_electrum_pro_ii': { product_url: 'https://electrumpickleball.com/products/model-e-elite' },
    // GRUVN
    'pdl_gruvn_mula': { product_url: 'https://gruvn.co/products/mula-16h-raw-carbon-fiber-pickleball-paddle' },
};
let puc = 0;
for (const p of paddles) {
    const u = paddleUrls[p.id];
    if (u) { Object.assign(p, u); puc++; }
}
saveJson('gears/paddles.json', paddles);
console.log('パドルproduct_url設定: ' + puc + '件');

// ============================================
// 2. シューズ product_url 設定
// ============================================
const shoes = loadJson('gears/shoes.json');
const shoeUrls = {
    'shoe_asics_gel_resolution_9': { product_url: 'https://www.asics.com/us/en-us/gel-resolution-9/p/1041A330.html' },
    'shoe_09': { product_url: 'https://www.asics.com/us/en-us/gel-resolution-10/p/1041A502.html' },
    'shoe_07': { product_url: 'https://www.asics.com/us/en-us/gel-renma/p/1041A373.html' },
    'shoe_14': { product_url: 'https://www.nike.com/t/court-air-zoom-vapor-pro-2-mens-tennis-shoes/DR6191' },
    'shoe_15': { product_url: 'https://www.nike.com/t/court-lite-4-mens-tennis-shoes/FD6574' },
    'shoe_16': { product_url: 'https://www.adidas.com/us/solematch-control-2-tennis-shoes/IF0438.html' },
    'shoe_17': { product_url: 'https://www.adidas.com/us/barricade-16-tennis-shoes/ID1548.html' },
    'shoe_head_motion_pro': { product_url: 'https://www.head.com/en_US/motion-pro-shoe.html' },
    'shoe_18': { product_url: 'https://www.head.com/en_US/sprint-pro-35-tennis-shoes.html' },
    'shoe_19': { product_url: 'https://www.wilson.com/en-us/product/rush-pro-4-0-wrs332040' },
    'shoe_20': { product_url: 'https://www.yonex.com/power-cushion-fusionrev5' },
    'shoe_nb_fuelcell_996v6': { product_url: 'https://www.newbalance.com/pd/fuelcell-996v6/MCH996V6-D.html' },
    'shoe_mizuno_wave_enforce2': { product_url: 'https://www.mizuno.com/us/wave-enforce-tour-2-ac.html' },
    'shoe_selkirk_courtstrike': { product_url: 'https://www.selkirk.com/products/courtstrike-pro' },
    'shoe_tyrol_drive_v': { product_url: 'https://tyrolpickleball.com/products/drive-v' },
};
let suc = 0;
for (const s of shoes) {
    const u = shoeUrls[s.id];
    if (u) { Object.assign(s, u); suc++; }
}
saveJson('gears/shoes.json', shoes);
console.log('シューズproduct_url設定: ' + suc + '件');

// ============================================
// 3. ボール product_url 設定
// ============================================
const balls = loadJson('gears/balls.json');
const ballUrls = {
    'ball_franklin_x40_outdoor': { product_url: 'https://www.franklinsports.com/pickleball/balls/x-40-outdoor' },
    'ball_onix_pure2_outdoor': { product_url: 'https://www.onixpickleball.com/products/pure-2-outdoor-pickleball' },
    'ball_dura_fast40_outdoor': { product_url: 'https://www.pickleballcentral.com/Dura_Fast_40_Pickleball_p/dura40.htm' },
};
let buc = 0;
for (const b of balls) {
    const u = ballUrls[b.id];
    if (u) { Object.assign(b, u); buc++; }
}
saveJson('gears/balls.json', balls);
console.log('ボールproduct_url設定: ' + buc + '件');

// ============================================
// 4. バッグ product_url 設定
// ============================================
const bags = loadJson('gears/bags.json');
const bagUrls = {
    'bag_selkirk_team': { product_url: 'https://www.selkirk.com/products/core-line-team-bag' },
    'bag_crbn_pro_team': { product_url: 'https://crbnpickleball.com/products/pro-team-backpack' },
    'bag_franklin_sling': { product_url: 'https://www.franklinsports.com/pickleball/bags/ben-johns-sling-bag' },
    'bag_forwrd_court_caddy': { product_url: 'https://forwrd.co/products/court-caddy' },
};
let bguc = 0;
for (const b of bags) {
    const u = bagUrls[b.id];
    if (u) { Object.assign(b, u); bguc++; }
}
saveJson('gears/bags.json', bags);
console.log('バッグproduct_url設定: ' + bguc + '件');

// サマリー
console.log('\n========================================');
console.log('product_url設定状況');
console.log('========================================');
const pSet = loadJson('gears/paddles.json').filter(x => x.product_url).length;
const sSet = loadJson('gears/shoes.json').filter(x => x.product_url).length;
const blSet = loadJson('gears/balls.json').filter(x => x.product_url).length;
const bgSet = loadJson('gears/bags.json').filter(x => x.product_url).length;
console.log('パドル: ' + pSet + '/113');
console.log('シューズ: ' + sSet + '/41');
console.log('ボール: ' + blSet + '/31');
console.log('バッグ: ' + bgSet + '/22');
