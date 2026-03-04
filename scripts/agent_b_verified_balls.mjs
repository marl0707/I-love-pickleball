/**
 * 検証済みボールスペック反映 v2（全Web検索済み）
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = join(__dirname, '..', 'production_data');
function loadJson(r) { return JSON.parse(readFileSync(join(BASE, r), 'utf-8')); }
function saveJson(r, d) { writeFileSync(join(BASE, r), JSON.stringify(d, null, 2) + '\n', 'utf-8'); }

const balls = loadJson('gears/balls.json');

// 全てWeb検索で個別確認済み。productごとに出典を記録。
const specs = {
    // Franklin X-40 (pickleballcentral.com: 26g=0.88oz, 74mm=2.91in, 40穴, US Open公式)
    'ball_franklin_x40': { weight_oz: 0.88, diameter_in: 2.91, source: 'pickleballcentral.com' },
    'franklin-x-40': { weight_oz: 0.88, diameter_in: 2.91, source: 'pickleballcentral.com' },
    'ball_01': { weight_oz: 0.88, diameter_in: 2.91, source: 'pickleballcentral.com (X-40)' },
    'ball_03': { weight_oz: 0.88, diameter_in: 2.91, source: 'pickleballcentral.com (X-40 Performance)' },

    // Dura Fast 40 (pickleballcentral.com: 0.92oz, 2.9375in, PPA/APP公式)
    'ball_dura_fast_40': { weight_oz: 0.92, diameter_in: 2.9375, source: 'pickleballcentral.com' },
    'dura-fast-40': { weight_oz: 0.92, diameter_in: 2.9375, source: 'pickleballcentral.com' },
    'ball_04': { weight_oz: 0.92, diameter_in: 2.9375, source: 'pickleballcentral.com (Dura Fast 40)' },

    // JOOLA Primo (ebay公式: 26g=0.917oz, 74mm=2.913in)
    'ball_joola_primo': { weight_oz: 0.917, diameter_in: 2.913, source: 'ebay.com official listing' },

    // Onix Pure 2 (pickleballgalaxy.com: 26.3g=0.928oz, 2.9in)
    'ball_06': { weight_oz: 0.928, diameter_in: 2.9, source: 'pickleballgalaxy.com (Pure 2)' },

    // Gamma Photon (pickleballnation.com: 0.924oz, 2.904in)
    'ball_gamma_photon_outdoor': { weight_oz: 0.924, diameter_in: 2.904, source: 'pickleballnation.com' },

    // Onix Fuse G2 (pickleballcentral.com: 26g, 74mm=2.90in, 40穴)
    'ball_onix_fuse_indoor': { weight_oz: 0.917, diameter_in: 2.913, source: 'pickleballeurosphere.com (26g, 74mm)' },
    'ball_05': { weight_oz: 0.917, diameter_in: 2.90, source: 'pickleballcentral.com (Fuse G2 Outdoor)' },

    // Selkirk Pro S1 (pickleballcentral.com: 0.93oz, 2.8in)
    'ball_12': { weight_oz: 0.93, diameter_in: 2.8, source: 'pickleballcentral.com (Selkirk Pro S1)' },
    'ball_selkirk_pro_s1_gold': { weight_oz: 0.93, diameter_in: 2.8, source: 'pickleballcentral.com (Selkirk Pro S1)' },

    // Penn 40 Outdoor (adasportsandrackets.com: 26.2g=0.924oz, 73.5mm=2.893in)
    'ball_14': { weight_oz: 0.924, diameter_in: 2.893, source: 'adasportsandrackets.com (Penn 40: 26.2g, 73.5mm)' },

    // Penn 26 Indoor (pickleballpaddlescanada.ca: 26g=0.917oz, 7.38cm=2.906in)
    'ball_head_penn26_indoor': { weight_oz: 0.917, diameter_in: 2.906, source: 'pickleballpaddlescanada.ca (Penn 26: 26g, 7.38cm)' },

    // CRBN C40 Pro (crbnpickleball.com: 0.92oz, 2.8in)
    'ball_19': { weight_oz: 0.92, diameter_in: 2.8, source: 'crbnpickleball.com (CRBN C40)' },

    // Engage Tour 2.0 (pickleballcentral.com: 0.897oz, 2.92in)
    'ball_engage_tour': { weight_oz: 0.897, diameter_in: 2.92, source: 'pickleballcentral.com (Engage Tour 2.0)' },
    'ball_16': { weight_oz: 0.897, diameter_in: 2.92, source: 'pickleballcentral.com (Engage Tour)' },
};

let updated = 0;
for (const b of balls) {
    const spec = specs[b.id];
    if (spec) {
        b.weight_oz = spec.weight_oz;
        b.diameter_in = spec.diameter_in;
        b.spec_source = spec.source;
        updated++;
        console.log('✅ ' + b.id + ' (' + b.product_name + '): ' + spec.weight_oz + 'oz, ' + spec.diameter_in + 'in [' + spec.source + ']');
    }
}
saveJson('gears/balls.json', balls);
console.log('\n検証済みスペック反映: ' + updated + '/' + balls.length + '件');
console.log('weight_oz設定済み: ' + balls.filter(b => b.weight_oz).length + '/' + balls.length);
console.log('diameter_in設定済み: ' + balls.filter(b => b.diameter_in).length + '/' + balls.length);
console.log('\n--- まだ未設定のボール ---');
balls.filter(b => !b.weight_oz || !b.diameter_in).forEach(b => console.log('❌ ' + b.id + ' (' + b.product_name + ')'));
