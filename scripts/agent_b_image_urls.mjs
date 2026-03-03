/**
 * 公式CDN画像URL一括反映
 * ブラウザで実際にクロールして取得した正規のCDN画像URLのみ
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
// パドル image_url 設定 (ブラウザクロールで取得)
// ============================================
const paddles = loadJson('gears/paddles.json');
const imgUrls = {
    // バッチ1: ブラウザクロール取得
    'pdl_selkirk_power_air_invikta': 'https://www.selkirk.com/cdn/shop/files/selkirk-vanguard-power-air-pickleball-paddle-gray_3520x.jpg?v=1763543769',
    'pdl_joola_hyperion_cfs16': 'https://joola.com/cdn/shop/files/Ben-Johns-Hyperion-CFS-16-18502-Web-01.png?v=1768584359',
    'pdl_crbn_1x_16': 'https://crbnpickleball.com/cdn/shop/products/1X_Front_Web_1800x1800.jpg?v=1673322003',
    // バッチ2: ブラウザクロール取得
    'pdl_selkirk_power_air_epic': 'https://www.selkirk.com/cdn/shop/files/VANGUARD_POWER_AIR_EPIC_RED_HERO-GR.png?v=1759942216&width=2000',
    'pdl_selkirk_amped_epic': 'https://www.selkirk.com/cdn/shop/files/Selkirk-AMPED-Control-Pickleball-Paddle-Epic-LT-red.png?v=1761251685&width=2000',
    'pdl_sixzero_dbd_16': 'https://www.sixzeropickleball.com/cdn/shop/files/1_77978e8a-4a92-4863-a9ab-9934dfd64a27.png?v=1762118738&width=2000',
    'pdl_head_radical_pro': 'https://cdn-mdb.head.com/CDN3/G/200145/1/683x911/radical-pro15-2026.webp',
    'pdl_onyx_evoke_premier': 'https://cdn.shopify.com/s/files/1/0481/9828/7516/products/onixcompositeevokepro-red_pickleballpaddle_kz1131-red-1_1__KZ1131-RED-1.jpg?v=1750277546',
    'pdl_franklin_ben_johns': 'https://franklinsports.com/media/catalog/product/5/2/52985-phase1-main.jpg',
};
let ic = 0;
for (const p of paddles) {
    const u = imgUrls[p.id];
    if (u) { p.image_url = u; ic++; }
}
saveJson('gears/paddles.json', paddles);
console.log('パドルimage_url設定: ' + ic + '件 (' + paddles.filter(p => p.image_url).length + '/' + paddles.length + ')');
console.log('パドルproduct_url: ' + paddles.filter(p => p.product_url).length + '/' + paddles.length);
