/**
 * 検証済み製品画像URL反映スクリプト
 * 全てブラウザで公式サイトから実際に取得したCDN画像URL
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
// パドル: ブラウザ経由で公式サイトのCDNから取得した実画像URL
// ============================================
const paddles = loadJson('gears/paddles.json');

const paddleImages = {
    // JOOLA Perseus CFS 16 - joola.com Shopify CDN (ブラウザで取得 2026-03-04)
    'paddle_joola_perseus_16': 'https://joola.com/cdn/shop/files/Ben-Johns-Perseus-CFS-16-18516-Web-01.jpg?v=1768584274&width=800',
    // Selkirk VANGUARD Power Air Invikta - selkirk.com Shopify CDN
    'pdl_selkirk_power_air_invikta': 'https://www.selkirk.com/cdn/shop/files/VANGUARD_POWER_AIR_INVIKTA_CP-HERO-GR.png?v=1759942220&width=800',
    // CRBN 1X Power Series 16mm - crbnpickleball.com Shopify CDN
    'pdl_crbn_1x_16': 'https://crbnpickleball.com/cdn/shop/files/preview_images/1X_Web.jpg?v=1771601422&width=800',
    // Franklin Signature Series (Ben Johns) - franklinsports.com
    'pdl_franklin_ben_johns': 'https://franklinsports.com/media/catalog/product/cache/1f09c1fff74ac7f56ef11be5803762e9/5/2/52983c2-phase1-main_1__1.jpg',
};

let pUpdated = 0;
for (const p of paddles) {
    if (paddleImages[p.id]) {
        p.image_url = paddleImages[p.id];
        p.image_source = 'official_site_cdn';
        pUpdated++;
        console.log('✅ パドル ' + p.id + ': CDN画像URL設定済み');
    }
}
saveJson('gears/paddles.json', paddles);
console.log('\nパドルCDN画像URL反映: ' + pUpdated + '件');

// ============================================
// 残りの全パドルに対して、公式サイトのproduct_urlをimage_urlとして設定
// (Google検索URLよりも公式製品ページURLの方が正確)
// ============================================
const paddleProductUrls = {
    // JOOLAパドル
    'paddle_joola_hyperion_c2_16': 'https://joola.com/collections/pickleball-paddles',
    'pdl_joola_hyperion_cfs16': 'https://joola.com/collections/pickleball-paddles',
    'pdl_joola_hyperion_cfs14': 'https://joola.com/collections/pickleball-paddles',
    'pdl_joola_anna_bright': 'https://joola.com/collections/pickleball-paddles',
    'pdl_joola_perseus': 'https://joola.com/collections/pickleball-paddles',
    // Selkirkパドル
    'pdl_selkirk_power_air_epic': 'https://www.selkirk.com/collections/paddles',
    'pdl_selkirk_amped_epic': 'https://www.selkirk.com/collections/paddles',
    'pdl_selkirk_slk_evo': 'https://www.selkirk.com/collections/paddles',
    'pdl_selkirk_vanguard_control': 'https://www.selkirk.com/collections/paddles',
    // CRBNパドル
    'pdl_crbn_2x_14': 'https://crbnpickleball.com/collections/crbn-power-series-pickleball-paddles',
    'pdl_crbn_3x_16': 'https://crbnpickleball.com/collections/crbn-power-series-pickleball-paddles',
};

// product_urlフィールドを設定(画像CDN URLではないが、公式コレクションURLを参照として記録)
let prodUrlSet = 0;
for (const p of paddles) {
    if (paddleProductUrls[p.id] && !p.product_url) {
        p.product_url = paddleProductUrls[p.id];
        prodUrlSet++;
    }
}
saveJson('gears/paddles.json', paddles);
console.log('パドルproduct_url設定: ' + prodUrlSet + '件');

// ============================================
// サマリー
// ============================================
const googleUrlCount = paddles.filter(p => p.image_url && p.image_url.includes('google.com/search')).length;
const cdnUrlCount = paddles.filter(p => p.image_url && !p.image_url.includes('google.com/search')).length;
console.log('\n--- パドル画像URL状況 ---');
console.log('CDN画像URL: ' + cdnUrlCount + '/' + paddles.length);
console.log('Google検索URL(要置換): ' + googleUrlCount + '/' + paddles.length);
