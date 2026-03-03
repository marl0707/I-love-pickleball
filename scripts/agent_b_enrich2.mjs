/**
 * エージェントB 追加Web調査結果反映 + レビュー紐付け修正
 * Web検索で確認した実在情報のみ反映。不明はnull。
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = join(__dirname, '..', 'production_data');

function loadJson(relPath) {
    return JSON.parse(readFileSync(join(BASE, relPath), 'utf-8'));
}
function saveJson(relPath, data) {
    writeFileSync(join(BASE, relPath), JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

// ============================================================
// 追加パドルスペック（Web検索確認済み）
// ============================================================
function enrichPaddlesExtra() {
    console.log('\n=== 追加パドルスペック反映 ===');
    const paddles = loadJson('gears/paddles.json');

    const verifiedSpecs = {
        // Vatic Pro Prism Flash 16mm
        // ソース: vaticpro.com, pickleballeffect.com, fromuthtennis.com
        'pdl_vatic_pro_prism_flash': {
            face_material: 'Raw Toray T700 Carbon Fiber (Heat-Compressed Texture)',
            core_material: 'C7 Polymers Honeycomb + Unibody Foam Injected Walls',
            core_thickness: 16,
            weight_oz: '7.9-8.2',
            length_in: 16.2,
            width_in: 7.7,
            grip_length_in: 5.3,
            grip_circumference_in: 4.125,
            usapa_approved: true,
            price_usd: 99.99,
        },
        // JOOLA Hyperion CFS 14mm
        // ソース: joola.com, pickleballstudio.com, academy.com
        'paddle_joola_hyperion_14': {
            face_material: 'Carbon Friction Surface (CFS)',
            core_material: 'Reactive Honeycomb Polymer Core',
            core_thickness: 14,
            weight_oz: '8.0-8.5',
            length_in: 16.5,
            width_in: 7.5,
            grip_length_in: 5.5,
            grip_circumference_in: 4.125,
            usapa_approved: true,
            price_usd: 219.95,
        },
        // Engage Pursuit Pro EX 16mm
        // ソース: engagepickleball.com, pickleballnation.com, epicsports.com
        'pdl_engage_pursuit_pro_ex': {
            face_material: '摩擦フリクション(Friction Surface Technology)',
            core_material: 'ControlPro Black Core',
            core_thickness: 16,
            weight_oz: '7.8-8.3',
            length_in: 16,
            width_in: 8,
            usapa_approved: true,
        },
        // Paddletek Bantam TS-5 Pro
        // ソース: paddletek.com, pickleballcentral.com, pickleballdepot.us
        'pdl_paddletek_bantam_ts5': {
            face_material: 'ポリカーボネート(Smart Response Technology)',
            core_material: 'Bantam Polymer Core',
            core_thickness: 14.3,
            weight_oz: '7.6-8.1',
            length_in: 16,
            width_in: 7.875,
            grip_length_in: 4.75,
            grip_circumference_in: 4.375,
            usapa_approved: true,
            price_usd: 149.99,
        },
        // Diadem Icon v2
        // ソース: diademsports.eu, pickleballcentral.com, pgatoursuperstore.com
        'pdl_diadem_icon': {
            face_material: 'RP2 Technology (Polyurethane Grit Paint)',
            core_material: '3XL Core (Multi-Layer Polypropylene Honeycomb)',
            core_thickness: 13.7,
            weight_oz: '8.0',
            length_in: 16,
            width_in: 7.6,
            grip_length_in: 5.25,
            grip_circumference_in: 4.125,
            usapa_approved: true,
        },
        // Six Zero Black Diamond 16mm （既にenrich済みだが追加情報）
        'pdl_sixzero_bd_16': {
            face_material: 'Raw Carbon Fiber (Japanese Toray 700K)',
            core_material: 'Premium Honeycomb Polymer Core + Carbon Fusion Edge',
            core_thickness: 16,
            weight_oz: '8.0-8.2',
            length_in: 16.3,
            width_in: 7.7,
            grip_length_in: 5.5,
            grip_circumference_in: 4.125,
            usapa_approved: true,
        },
    };

    let enriched = 0;
    for (const paddle of paddles) {
        const spec = verifiedSpecs[paddle.id];
        if (spec) {
            Object.assign(paddle, spec);
            enriched++;
        }
    }

    saveJson('gears/paddles.json', paddles);
    console.log(`  追加スペック反映: ${enriched}件`);
    return enriched;
}

// ============================================================
// 追加シューズスペック
// ============================================================
function enrichShoesExtra() {
    console.log('\n=== 追加シューズスペック反映 ===');
    const shoes = loadJson('gears/shoes.json');

    const verifiedSpecs = {
        // K-Swiss Express Light
        // ソース: kswiss.com, pickleballcentral.com, pickleballwarehouse.com
        'shoe_k_swiss_express_light': {
            outsole: 'Aosta 7.0 High-Density Rubber (Herringbone Tread)',
            midsole: 'K-EVA Cushioning',
            insole: 'Ortholite Liner',
            stability: 'Thermal Plastic Plantar Support Chassis (180° protection)',
            dragguard: true,
            court_type: 'オールコート',
            price_usd: 110,
        },
        // Skechers Viper Court Pro (既にenrich済みだが追加情報)
        'shoe_skechers_viper_court': {
            outsole: 'Goodyear® Gold Compound Rubber',
            insole: 'Arch Fit® (Podiatrist-certified, APMA Seal)',
            midsole: 'ULTRA FLIGHT® Cushioning',
            fit: 'Relaxed Fit®',
            weight_grams: 375,
            court_type: 'オールコート',
            price_usd: 109.95,
        },
    };

    let enriched = 0;
    for (const shoe of shoes) {
        const spec = verifiedSpecs[shoe.id];
        if (spec) {
            Object.assign(shoe, spec);
            enriched++;
        }
    }

    saveJson('gears/shoes.json', shoes);
    console.log(`  追加スペック反映: ${enriched}件`);
    return enriched;
}

// ============================================================
// レビュー紐付け修正
// ============================================================
function fixReviewLinks() {
    console.log('\n=== レビュー紐付け修正 ===');
    const reviews = loadJson('players/expert_reviews.json');

    // review_001: paddle_joola_perseus → paddle_joola_perseus_16 に修正
    // rev_11: shoe_05 → 該当シューズIDを確認必要 → nullに設定
    let fixed = 0;
    for (const r of reviews) {
        if (r.id === 'review_001' && r.item_id === 'paddle_joola_perseus') {
            r.item_id = 'paddle_joola_perseus_16';
            fixed++;
            console.log(`  修正: review_001 → paddle_joola_perseus → paddle_joola_perseus_16`);
        }
        if (r.id === 'rev_11' && r.item_id === 'shoe_05') {
            // shoe_05はshoes.jsonに存在しないIDのため、紐付け不可→nullに
            r.item_id = null;
            fixed++;
            console.log(`  修正: rev_11 → shoe_05 → null (対象シューズID不存在のため)`);
        }
    }

    saveJson('players/expert_reviews.json', reviews);
    console.log(`  紐付け修正: ${fixed}件`);
    return fixed;
}

// ============================================================
// メイン実行
// ============================================================
console.log('========================================');
console.log('追加Web調査結果反映 + レビュー修正');
console.log('========================================');

const p = enrichPaddlesExtra();
const s = enrichShoesExtra();
const r = fixReviewLinks();

console.log('\n========================================');
console.log('追加反映サマリー');
console.log('========================================');
console.log(`パドル追加スペック: ${p}件`);
console.log(`シューズ追加スペック: ${s}件`);
console.log(`レビュー紐付け修正: ${r}件`);
