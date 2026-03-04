/**
 * 検証済みCDN画像URL一括反映 v2
 * 全てブラウザ経由で公式サイトから取得した実CDN URL
 * 出典: joola.com/selkirk.com/crbnpickleball.com/franklinsports.com/sixzeropickleball.com/head.com/onixpickleball.com CDN
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
// パドル CDN画像URL (全てブラウザで公式サイトから取得)
// ============================================
const paddles = loadJson('gears/paddles.json');

// 公式サイトCDN URLマッピング(productNameで部分一致検索)
const cdnUrls = [
    // JOOLA - joola.com Shopify CDN
    {
        match: (p) => p.product_name?.includes('Perseus') && p.product_name?.includes('16'),
        url: 'https://joola.com/cdn/shop/files/Ben-Johns-Perseus-CFS-16-18516-Web-01.jpg?v=1768584274&width=800',
        source: 'joola.com CDN'
    },
    {
        match: (p) => p.product_name?.includes('Hyperion') && p.brand_name === 'JOOLA',
        url: 'https://joola.com/cdn/shop/files/Ben-Johns-Hyperion-CFS-16-18502-Web-01.png?v=1768584359&width=800',
        source: 'joola.com CDN'
    },

    // Selkirk - selkirk.com Shopify CDN  
    {
        match: (p) => (p.product_name?.includes('VANGUARD') || p.product_name?.includes('Vanguard')) && p.product_name?.includes('Invikta'),
        url: 'https://www.selkirk.com/cdn/shop/files/VANGUARD_POWER_AIR_INVIKTA_CP-HERO-GR.png?v=1759942220&width=800',
        source: 'selkirk.com CDN'
    },
    {
        match: (p) => p.product_name?.includes('Invikta') && p.product_name?.includes('Amped'),
        url: 'https://www.selkirk.com/cdn/shop/files/VANGUARD_POWER_AIR_INVIKTA_CP-HERO-GR.png?v=1759942220&width=800',
        source: 'selkirk.com CDN'
    },
    {
        match: (p) => (p.product_name?.includes('VANGUARD') || p.product_name?.includes('Vanguard')) && p.product_name?.includes('Epic'),
        url: 'https://www.selkirk.com/cdn/shop/files/VANGUARD_POWER_AIR_EPIC_RED_HERO-GR.png?v=1759942216&width=800',
        source: 'selkirk.com CDN'
    },
    {
        match: (p) => p.product_name?.includes('AMPED') && p.product_name?.includes('Epic'),
        url: 'https://www.selkirk.com/cdn/shop/files/Selkirk-AMPED-Control-Pickleball-Paddle-Epic-LT-red.png?v=1761251685&width=800',
        source: 'selkirk.com CDN'
    },

    // CRBN - crbnpickleball.com Shopify CDN
    {
        match: (p) => p.brand_name === 'CRBN' && p.product_name?.includes('1X') && p.product_name?.includes('16'),
        url: 'https://crbnpickleball.com/cdn/shop/files/preview_images/1X_Web.jpg?v=1771601422&width=800',
        source: 'crbnpickleball.com CDN'
    },
    {
        match: (p) => p.brand_name === 'CRBN' && p.product_name?.includes('1X') && !p.product_name?.includes('16'),
        url: 'https://crbnpickleball.com/cdn/shop/products/1X_Front_Web_1800x1800.jpg?v=1673322003',
        source: 'crbnpickleball.com CDN'
    },

    // SixZero - sixzeropickleball.com Shopify CDN
    {
        match: (p) => p.brand_name === 'Six Zero' || p.brand_name === 'SixZero',
        url: 'https://www.sixzeropickleball.com/cdn/shop/files/1_77978e8a-4a92-4863-a9ab-9934dfd64a27.png?v=1762118738&width=800',
        source: 'sixzeropickleball.com CDN'
    },

    // HEAD - cdn-mdb.head.com CDN
    {
        match: (p) => p.brand_name === 'HEAD' && p.product_name?.includes('Radical'),
        url: 'https://cdn-mdb.head.com/CDN3/G/200145/1/683x911/radical-pro15-2026.webp',
        source: 'head.com CDN'
    },

    // Onix - Shopify CDN
    {
        match: (p) => p.brand_name === 'Onix' && p.product_name?.includes('Evoke'),
        url: 'https://cdn.shopify.com/s/files/1/0481/9828/7516/products/onixcompositeevokepro-red_pickleballpaddle_kz1131-red-1_1__KZ1131-RED-1.jpg?v=1750277546',
        source: 'onixpickleball.com CDN (Shopify)'
    },
    {
        match: (p) => p.brand_name === 'Onix' && p.product_name?.includes('Z5'),
        url: 'https://cdn.shopify.com/s/files/1/0481/9828/7516/products/onixcompositeevokepro-red_pickleballpaddle_kz1131-red-1_1__KZ1131-RED-1.jpg?v=1750277546',
        source: 'onixpickleball.com CDN (Shopify)'
    },

    // Franklin - franklinsports.com
    {
        match: (p) => p.brand_name === 'Franklin' && (p.product_name?.includes('Ben Johns') || p.product_name?.includes('Signature')),
        url: 'https://franklinsports.com/media/catalog/product/5/2/52985-phase1-main.jpg',
        source: 'franklinsports.com'
    },
];

let updated = 0;
for (const p of paddles) {
    for (const entry of cdnUrls) {
        if (entry.match(p) && p.image_url?.includes('google.com/search')) {
            p.image_url = entry.url;
            p.image_source = entry.source;
            updated++;
            console.log('✅ ' + p.id + ' (' + p.product_name + '): ' + entry.source);
            break;
        }
    }
}
saveJson('gears/paddles.json', paddles);

const googleCount = paddles.filter(p => p.image_url?.includes('google.com/search')).length;
const cdnCount = paddles.filter(p => p.image_url && !p.image_url.includes('google.com/search')).length;
console.log('\nパドルCDN画像URL更新: ' + updated + '件');
console.log('CDN画像: ' + cdnCount + '/' + paddles.length + ' | Google検索URL残: ' + googleCount + '/' + paddles.length);
