/**
 * 検証済みスペック一括反映 Batch3
 * 全てWeb検索で個別確認済みのgrip_length_in / width_in（出典付き）
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

// 全てWeb検索で個別確認済み（出典付き）
const specs = [
    // Engage Pursuit Pro MX: pickleballgalaxy.com/pickleballcentral.com - grip 5.75in, width 7.5in
    {
        match: (p) => p.id === 'pdl_engage_pursuit_pro_mx' || (p.brand_name === 'Engage' && p.product_name?.includes('Pursuit')),
        grip_length_in: 5.75, width_in: 7.5, source: 'pickleballgalaxy.com/pickleballcentral.com'
    },

    // HEAD Radical Pro: pickleballdepot.us/pickleballcentral.com - grip 5in, width 7.875in
    {
        match: (p) => p.id === 'pdl_head_radical_pro' || (p.brand_name === 'HEAD' && p.product_name?.includes('Radical')),
        grip_length_in: 5.0, width_in: 7.875, source: 'pickleballdepot.us/pickleballcentral.com'
    },

    // HEAD Gravity Tour: 同じHEADのGravityも標準的に5inグリップだが未検索なので設定しない

    // GAMMA Hellbender: pickleballclearance.com/lcpickleball.com - grip 4.5in, width 7.625in
    {
        match: (p) => p.id === 'pdl_gamma_hellbender' || (p.brand_name === 'GAMMA' && p.product_name?.includes('Hellbender')),
        grip_length_in: 4.5, width_in: 7.625, source: 'pickleballclearance.com/lcpickleball.com'
    },

    // Onix Evoke Premier: pickleballcentral.com/onixpickleball.com - grip 5in, width 8in
    {
        match: (p) => p.id === 'pdl_onyx_evoke_premier' || (p.brand_name === 'Onix' && p.product_name?.includes('Evoke')),
        grip_length_in: 5.0, width_in: 8.0, source: 'pickleballcentral.com/onixpickleball.com'
    },

    // Onix Z5: 同じくOnixだがZ5の具体的スペックは未検索

    // Vatic Pro V7: picklefox.com/justpaddles.com - grip 5.3in, width 7.5in
    {
        match: (p) => p.id === 'pdl_vatic_pro_v7' || (p.brand_name === 'Vatic Pro' && p.product_name?.includes('V7')),
        grip_length_in: 5.3, width_in: 7.5, source: 'picklefox.com/justpaddles.com'
    },

    // Paddletek Bantam EX-L: pickleballgalaxy.com/pickleballcentral.com - grip 5in, width 7.875in
    {
        match: (p) => p.id === 'pdl_paddletek_bantam_exl' || (p.brand_name === 'Paddletek' && p.product_name?.includes('Bantam')),
        grip_length_in: 5.0, width_in: 7.875, source: 'pickleballgalaxy.com/pickleballcentral.com'
    },
];

let updated = 0;
for (const p of paddles) {
    for (const s of specs) {
        if (s.match(p)) {
            if (s.grip_length_in && !p.grip_length_in) { p.grip_length_in = s.grip_length_in; }
            if (s.width_in && !p.width_in) { p.width_in = s.width_in; }
            if (!p.spec_source) p.spec_source = s.source;
            updated++;
            console.log('✅ ' + p.id + ': grip=' + (s.grip_length_in || '-') + 'in, width=' + (s.width_in || '-') + 'in [' + s.source + ']');
            break;
        }
    }
}
saveJson('gears/paddles.json', paddles);
console.log('\nBatch3 スペック更新: ' + updated + '件');
console.log('grip_length_in: ' + paddles.filter(p => p.grip_length_in).length + '/' + paddles.length);
console.log('width_in: ' + paddles.filter(p => p.width_in).length + '/' + paddles.length);
