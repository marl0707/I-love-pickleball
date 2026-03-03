/**
 * エージェントB 最終深掘りスペック反映（シューズ・ボール正しいID + 追加パドル）
 * Web検索で確認した公式スペックのみ。捏造禁止。
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = join(__dirname, '..', 'production_data');

function loadJson(relPath) { return JSON.parse(readFileSync(join(BASE, relPath), 'utf-8')); }
function saveJson(relPath, data) { writeFileSync(join(BASE, relPath), JSON.stringify(data, null, 2) + '\n', 'utf-8'); }
function enrichRecords(data, specs) {
    let count = 0;
    for (const item of data) {
        const spec = specs[item.id];
        if (spec) { Object.assign(item, spec); count++; }
    }
    return count;
}

// ============================================================
// シューズ（正しいID で反映）
// ============================================================
console.log('\n=== シューズ深掘り反映（正しいID） ===');
const shoes = loadJson('gears/shoes.json');
const shoeSpecs = {
    // FILA Volley Zone - ソース: fila.com, tennis-warehouse.com
    'shoe_03': {
        outsole: 'Evergrind Rubber (Herringbone + Pivot Areas)',
        midsole: 'Energized EVA Cushioning',
        insole: 'Removable Molded EVA Sockliner',
        stability: 'TPU Midfoot Stabilizer + Molded Forefoot Cage',
        court_type: 'オールコート',
        weight_grams: 391,
        price_usd: 110,
    },
    // FILA Double Bounce 3 - ソース: fila.com
    'shoe_04': {
        outsole: 'Evergrind Rubber',
        midsole: 'EVA Cushioning',
        court_type: 'オールコート',
    },
    // Skechers Viper Court Luxe
    'shoe_06': {
        outsole: 'Goodyear® Gold Compound Rubber',
        midsole: 'ULTRA GO® Foam',
        insole: 'Arch Fit® (Podiatrist-certified)',
        court_type: 'オールコート',
    },
    // ASICS Gel-Renma
    'shoe_07': {
        outsole: 'AHAR Rubber',
        midsole: 'EVA',
        gel: 'GEL® Technology',
        court_type: 'オールコート',
    },
    // ASICS Gel-Dedicate 9
    'shoe_08': {
        outsole: 'AHAR+ Rubber',
        midsole: 'EVA',
        gel: 'GEL® Technology (Rear)',
        court_type: 'オールコート',
    },
    // ASICS Gel-Resolution 10
    'shoe_09': {
        outsole: 'AHAR+ Rubber (Herringbone)',
        midsole: 'FF BLAST PLUS Cushioning',
        gel: 'GEL® Technology',
        court_type: 'オールコート',
        stability: 'DYNAWRAP Counter + Heel Clutching System',
    },
    // Babolat Pulsion
    'shoe_10': {
        outsole: 'Michelin Performance Rubber',
        midsole: 'EVA Cushioning',
        court_type: 'オールコート',
    },
    // Babolat Jet Tere AC
    'shoe_11': {
        outsole: 'Michelin XM Outsole Compound',
        midsole: 'Ortholite® X40 + EVA',
        court_type: 'オールコート',
        features: 'Matryx® upper (Kevlar + Polyamide weave)',
    },
    // New Balance Fresh Foam X Lav v2
    'shoe_12': {
        outsole: 'Non-Marking Rubber (Herringbone)',
        midsole: 'Fresh Foam X Cushioning',
        court_type: 'オールコート',
    },
    // New Balance FuelCell 996v5.5
    'shoe_13': {
        outsole: 'Ndurance Rubber',
        midsole: 'FuelCell Cushioning',
        court_type: 'オールコート',
        stability: 'TPU Midfoot Shank',
    },
    // Nike Court Air Zoom Vapor Pro 2
    'shoe_14': {
        outsole: 'High-Wear Rubber (Herringbone)',
        midsole: 'Zoom Air (Forefoot)',
        court_type: 'オールコート（ハードコート設計）',
        features: 'Flyknit Upper + Dynamic Fit System',
    },
    // Nike Court Lite 4
    'shoe_15': {
        outsole: 'Non-Marking Rubber (Modified Herringbone)',
        midsole: 'Phylon™ Foam',
        court_type: 'オールコート',
    },
    // adidas SoleMatch Control 2
    'shoe_16': {
        outsole: 'Adiwear Rubber (Herringbone)',
        midsole: 'ADITUFF + EVA',
        court_type: 'オールコート',
        stability: 'TORSION® System',
    },
    // adidas Barricade 16
    'shoe_17': {
        outsole: 'Adiwear Rubber',
        midsole: 'BOUNCE Cushioning',
        court_type: 'オールコート（高耐久）',
        stability: 'ADITUFF toe protection',
    },
    // HEAD Sprint Pro 3.5
    'shoe_18': {
        outsole: 'Hybrasion+ Rubber',
        midsole: 'TORXFRAME™ Midfoot Support',
        court_type: 'オールコート',
        features: 'TRI-NRG Technology',
    },
    // Wilson Rush Pro 4.0
    'shoe_19': {
        outsole: 'Duralast® Rubber',
        midsole: 'ProTorque Chassis 2.0',
        court_type: 'オールコート',
        features: 'Endofit™ Internal Bootie',
    },
    // Yonex Power Cushion Fusionrev 5
    'shoe_20': {
        outsole: 'Rubber (Radial Blade)',
        midsole: 'POWER CUSHION™ + POWER CUSHION+™',
        court_type: 'オールコート',
        features: '3-Layer Power Cushion Insole',
    },
    // Yonex Power Cushion Sonicage 3
    'shoe_21': {
        outsole: 'Rubber (Non-Marking)',
        midsole: 'POWER CUSHION™',
        court_type: 'オールコート',
    },
    // Mizuno Wave Exceed Light 3 AC
    'shoe_23': {
        outsole: 'X10 Rubber',
        midsole: 'Mizuno ENERZY Cushioning',
        court_type: 'オールコート',
        stability: 'Mizuno Wave Plate',
    },
    // K-Swiss Express Light 3 (shoe_01 - 別モデル)
    'shoe_01': {
        outsole: 'Aosta 7.0 High-Density Rubber (Herringbone)',
        midsole: 'K-EVA Cushioning',
        insole: 'Ortholite Liner',
        stability: 'Thermal Plastic Plantar Support',
        dragguard: true,
        court_type: 'オールコート',
    },
    // K-Swiss Speedex
    'shoe_02': {
        outsole: 'Aosta 7.0 Rubber',
        midsole: 'K-EVA Cushioning',
        dragguard: true,
        court_type: 'オールコート',
    },
    // Babolat SFX3
    'babolat-sfx3': {
        outsole: 'Michelin Outdoor Compound',
        midsole: 'EVA + Ortholite X40',
        court_type: 'オールコート',
        features: 'SFX Fit System',
    },
    // FILA Axilus 3 Energized
    'shoe_27': {
        outsole: 'Evergrind Rubber',
        midsole: 'Energized Rubber Cushioning',
        court_type: 'オールコート',
        stability: 'TPU Midfoot Shank',
    },
    // Skechers Viper Court Casual
    'shoe_28': {
        outsole: 'Goodyear® Rubber',
        midsole: 'ULTRA GO® Foam',
        court_type: 'オールコート',
    },
    // adidas Stycon Pickleball
    'shoe_29': {
        outsole: 'Adiwear Rubber (Laceless)',
        midsole: 'BOUNCE Cushioning',
        court_type: 'オールコート',
        features: 'Laceless Design',
    },
};

const sE = enrichRecords(shoes, shoeSpecs);
saveJson('gears/shoes.json', shoes);
console.log(`  シューズスペック反映: ${sE}件`);

// ============================================================
// ボール（追加スペック）
// ============================================================
console.log('\n=== ボール深掘り反映 ===');
const balls = loadJson('gears/balls.json');
const ballSpecs = {
    // Franklin X-26 Indoor
    'ball_02': {
        weight_grams: 24,
        hole_count: 26,
        ball_type: 'インドア用(26穴)',
        usapa_approved: true,
    },
    // Franklin X-40 Performance
    'ball_03': {
        weight_grams: 26,
        hole_count: 40,
        ball_type: 'アウトドア用(40穴)',
        usapa_approved: true,
    },
    // Dura Fast 40 (重複ID)
    'ball_04': {
        weight_grams: 26,
        hole_count: 40,
        ball_type: 'アウトドア用(40穴)',
        usapa_approved: true,
    },
    // Onix Fuse G2 Outdoor
    'ball_05': {
        hole_count: 40,
        ball_type: 'アウトドア用(40穴)',
        usapa_approved: true,
    },
    // Onix Pure 2 Indoor
    'ball_06': {
        hole_count: 26,
        ball_type: 'インドア用(26穴)',
        usapa_approved: true,
    },
    // CORE Indoor
    'ball_07': {
        hole_count: 26,
        ball_type: 'インドア用(26穴)',
    },
    // CORE Outdoor
    'ball_08': {
        hole_count: 40,
        ball_type: 'アウトドア用(40穴)',
    },
    // JOOLA Radius Outdoor
    'ball_10': {
        hole_count: 40,
        ball_type: 'アウトドア用(40穴)',
        usapa_approved: true,
    },
    // JOOLA Junior Soft
    'ball_11': {
        ball_type: 'ジュニア/練習用(ソフト)',
    },
    // Selkirk Pro S1 Outdoor
    'ball_12': {
        hole_count: 40,
        ball_type: 'アウトドア用(40穴)',
        usapa_approved: true,
    },
    // Gamma Foam Quiet Ball
    'ball_13': {
        ball_type: '静音ボール(フォーム)',
        features: '騒音制限コート向け静音フォームボール',
    },
    // HEAD Penn 40 Outdoor
    'ball_14': {
        hole_count: 40,
        ball_type: 'アウトドア用(40穴)',
        usapa_approved: true,
        official_tournament: 'USA Pickleball認定ボール',
    },
    // Wilson Tru 32 Pro
    'ball_15': {
        hole_count: 32,
        ball_type: 'ハイブリッド(32穴)',
        usapa_approved: true,
    },
    // Engage Tour Ball
    'ball_16': {
        hole_count: 40,
        ball_type: 'アウトドア用(40穴)',
    },
    // Franklin X-40 Outdoor (重複ID ball_01)
    'ball_01': {
        weight_grams: 26,
        hole_count: 40,
        ball_type: 'アウトドア用(40穴)',
        usapa_approved: true,
        official_tournament: 'US Open Pickleball Championships 公式球',
    },
    // CRBN Pro Outdoor
    'ball_19': {
        hole_count: 40,
        ball_type: 'アウトドア用(40穴)',
        usapa_approved: true,
    },
    // ProKennex Ultra Soft Indoor
    'ball_20': {
        hole_count: 26,
        ball_type: 'インドア用(26穴)',
        features: '超ソフトタッチ',
    },
};

const bE = enrichRecords(balls, ballSpecs);
saveJson('gears/balls.json', balls);
console.log(`  ボールスペック反映: ${bE}件`);

// ============================================================
// 統計レポート
// ============================================================
console.log('\n========================================');
console.log('最終深掘り反映 完了サマリー');
console.log('========================================');
console.log(`シューズ: ${sE}件のスペック反映`);
console.log(`ボール: ${bE}件のスペック反映`);

// シューズ充実度
const sWithCourt = shoes.filter(s => s.court_type).length;
const sWithOutsole = shoes.filter(s => s.outsole).length;
console.log(`\n--- シューズ充実度 ---`);
console.log(`court_type あり: ${sWithCourt}/${shoes.length}件`);
console.log(`outsole あり: ${sWithOutsole}/${shoes.length}件`);

// ボール充実度
const bWithType = balls.filter(b => b.ball_type).length;
const bWithHoles = balls.filter(b => b.hole_count).length;
console.log(`\n--- ボール充実度 ---`);
console.log(`ball_type あり: ${bWithType}/${balls.length}件`);
console.log(`hole_count あり: ${bWithHoles}/${balls.length}件`);
