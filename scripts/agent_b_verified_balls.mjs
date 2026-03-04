/**
 * 検証済みボールスペック反映スクリプト
 * 各ボールのweight_oz / diameter_in をWeb検索で個別確認した値のみ入力
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

// 全てWeb検索で個別確認済みのスペック (出典はコメントに記載)
const verifiedBallSpecs = {
    // Franklin X-40: pickleballcentral.com - 26g(0.88oz), 74mm(2.91in), 40穴
    'ball_franklin_x40_outdoor': { weight_oz: 0.88, diameter_in: 2.91, source: 'pickleballcentral.com' },
    // Franklin X-26 Indoor: 同シリーズ、franklin公式 - 26穴 の場合はindoor
    // ※X-26のスペックは今回未検索のため設定しない

    // Onix Pure 2 Outdoor: pickleballgalaxy.com - 26.3g, 2.9in
    'ball_onix_pure2_outdoor': { weight_oz: 0.93, diameter_in: 2.9, source: 'pickleballgalaxy.com' },

    // Dura Fast 40: pickleballcentral.com - 0.92oz, 2.9375in
    'ball_dura_fast40_outdoor': { weight_oz: 0.92, diameter_in: 2.9375, source: 'pickleballcentral.com' },

    // GAMMA Photon Outdoor: pickleballnation.com - 0.924oz, 2.904in
    'ball_gamma_photon_outdoor': { weight_oz: 0.924, diameter_in: 2.904, source: 'pickleballnation.com' },

    // JOOLA Primo (Ben Johns): ebay公式リスト - 26g(0.917oz), 74mm(2.913in)
    'ball_joola_primo_outdoor': { weight_oz: 0.917, diameter_in: 2.913, source: 'ebay.com official listing' },
};

let updated = 0;
for (const b of balls) {
    const spec = verifiedBallSpecs[b.id];
    if (spec) {
        if (!b.weight_oz && spec.weight_oz) { b.weight_oz = spec.weight_oz; }
        if (!b.diameter_in && spec.diameter_in) { b.diameter_in = spec.diameter_in; }
        b.spec_source = spec.source;
        updated++;
        console.log('✅ ' + b.id + ': ' + spec.weight_oz + 'oz, ' + spec.diameter_in + 'in (出典: ' + spec.source + ')');
    }
}
saveJson('gears/balls.json', balls);
console.log('\n検証済みボールスペック反映: ' + updated + '件');
console.log('ボールweight_oz: ' + balls.filter(b => b.weight_oz).length + '/' + balls.length);
console.log('ボールdiameter_in: ' + balls.filter(b => b.diameter_in).length + '/' + balls.length);
