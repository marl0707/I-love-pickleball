/**
 * 検証済みスペック＋シューズ画像URL反映スクリプト
 * 全てWeb検索で個別確認済みのデータ(出典付き)
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
// 1. パドル grip_length_in / width_in (Web検索で個別確認済み)
// ============================================
const paddles = loadJson('gears/paddles.json');

const verifiedSpecs = {
    // JOOLA Perseus CFS 16: joola.com/dickssportinggoods.com - grip 5.5in
    'paddle_joola_perseus_16': { grip_length_in: 5.5, source: 'joola.com' },

    // CRBN 1X Power Series 16mm: fromuthtennis.com/pickleballwarehouse.com - grip 5.5in, width 7.5in
    'pdl_crbn_1x_16': { grip_length_in: 5.5, width_in: 7.5, source: 'fromuthtennis.com/pickleballwarehouse.com' },

    // Selkirk VANGUARD Power Air Invikta: pickleballcentral.com/selkirk.com - grip 5.25in, width 7.375in
    'paddle_selkirk_vanguard_16': { grip_length_in: 5.25, width_in: 7.375, source: 'pickleballcentral.com/selkirk.com' },
};

let specUpdated = 0;
for (const p of paddles) {
    const spec = verifiedSpecs[p.id];
    if (spec) {
        if (spec.grip_length_in) { p.grip_length_in = spec.grip_length_in; }
        if (spec.width_in) { p.width_in = spec.width_in; }
        p.spec_source = spec.source;
        specUpdated++;
        console.log('✅ パドル ' + p.id + ': grip=' + (spec.grip_length_in || 'N/A') + 'in, width=' + (spec.width_in || 'N/A') + 'in [' + spec.source + ']');
    }
}
saveJson('gears/paddles.json', paddles);
console.log('パドルスペック更新: ' + specUpdated + '件');
console.log('grip_length_in設定済み: ' + paddles.filter(p => p.grip_length_in).length + '/' + paddles.length);
console.log('width_in設定済み: ' + paddles.filter(p => p.width_in).length + '/' + paddles.length);

// ============================================
// 2. シューズ CDN画像URL (ブラウザで公式サイトから取得)
// ============================================
const shoes = loadJson('gears/shoes.json');

const shoeImages = [
    // ASICS - images.asics.com CDN (ブラウザで取得 2026-03-04)
    {
        match: (s) => s.product_name?.includes('GEL-DEDICATE 8') || s.product_name?.includes('Gel-Dedicate 8'),
        url: 'https://images.asics.com/is/image/asics/1041A410_108_SR_RT_GLB', source: 'images.asics.com CDN'
    },
    {
        match: (s) => s.product_name?.includes('GEL-RESOLUTION') || s.product_name?.includes('Gel-Resolution'),
        url: 'https://images.asics.com/is/image/asics/1041A487_100_SR_RT_GLB', source: 'images.asics.com CDN'
    },
    {
        match: (s) => s.product_name?.includes('GEL-GAME') || s.product_name?.includes('Gel-Game'),
        url: 'https://images.asics.com/is/image/asics/1041A486_020_SR_RT_GLB', source: 'images.asics.com CDN'
    },

    // Skechers - images.skechers.com CDN (ブラウザで取得 2026-03-04)
    {
        match: (s) => s.brand_name === 'Skechers' && s.product_name?.includes('Viper'),
        url: 'https://images.skechers.com/image;width=600,format=auto/246109_WBLP_HERO_LG', source: 'images.skechers.com CDN'
    },
];

let shoeUpdated = 0;
for (const s of shoes) {
    for (const entry of shoeImages) {
        if (entry.match(s) && s.image_url?.includes('google.com/search')) {
            s.image_url = entry.url;
            s.image_source = entry.source;
            shoeUpdated++;
            console.log('✅ シューズ ' + s.id + ' (' + s.product_name + '): ' + entry.source);
            break;
        }
    }
}
saveJson('gears/shoes.json', shoes);
console.log('\nシューズCDN画像URL更新: ' + shoeUpdated + '件');

const shoeGoogleCount = shoes.filter(s => s.image_url?.includes('google.com/search')).length;
console.log('Google検索URL残: ' + shoeGoogleCount + '/' + shoes.length);
