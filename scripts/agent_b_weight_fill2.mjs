/**
 * パドル残りweight_oz最終補完 + 新モデルスペック
 * 自動実行対応。嘘は一切つかない。
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
const specs = {
    // JOOLA Solaire FAS 13 - ソース: joola.com, tennisnerd.net, pickleballgalaxy.com
    'pdl_joola_solaire': {
        weight_oz: '8.2', length_in: 16, width_in: 8,
        grip_length_in: 5.5, grip_circumference_in: 4.125,
        face_material: 'Fiberglass Abrasion Surface (FAS - サンドブラスト加工)',
        core_material: 'Response Honeycomb Polymer', core_thickness: 13,
        usapa_approved: true,
        unique_tech: 'Aero-Curve head design',
    },
    // JOOLA Collin Johns Scorpeus - ソース: joola.com
    'pdl_joola_collin_johns': {
        weight_oz: '7.8', length_in: 16.5, width_in: 7.5,
        grip_length_in: 5.5, grip_circumference_in: 4.125,
        face_material: 'Carbon Friction Surface (CFS)',
        core_material: 'Propulsion Core Polymer', core_thickness: 14,
        usapa_approved: true,
    },
    // CRBN 1X Power 16mm - ソース: crbnpickleball.com, fromuthtennis.com
    'pdl_crbn_1x_16': {
        weight_oz: '7.8-8.1', length_in: 16.5, width_in: 7.25,
        grip_length_in: 5.5, grip_circumference_in: 4.25,
        face_material: 'T700 Toray Raw Carbon Fiber',
        core_material: 'Polypropylene Honeycomb (Foam Injected Edge Walls, Thermoformed Unibody)',
        core_thickness: 16, usapa_approved: true,
    },
    // CRBN 2X Power 14mm - ソース: crbnpickleball.com, badmintonwarehouse.com
    'pdl_crbn_2x_14': {
        weight_oz: '7.8-8.1', length_in: 15.75, width_in: 8,
        grip_length_in: 4.75, grip_circumference_in: 4.125,
        face_material: 'T700 Toray Raw Carbon Fiber',
        core_material: 'Polypropylene Honeycomb (Foam Injected Edge Walls, Thermoformed Unibody)',
        core_thickness: 14, usapa_approved: true,
    },
    // CRBN 3X Power 16mm - ソース: crbnpickleball.com, pickleballwarehouse.com
    'pdl_crbn_3x_16': {
        weight_oz: '7.8-8.1', length_in: 16.5, width_in: 7.5,
        grip_length_in: 5.25, grip_circumference_in: 4.25,
        face_material: 'T700 Toray Raw Carbon Fiber',
        core_material: 'Polypropylene Honeycomb (Foam Injected Edge Walls, Thermoformed Unibody)',
        core_thickness: 16, usapa_approved: true,
    },
    // SixZero DBD 16mm - ソース: sixzeropickleball.com, pickleballdepot.ca
    'pdl_sixzero_dbd_16': {
        weight_oz: '8.1', length_in: 16.3, width_in: 7.7,
        grip_length_in: 5.5, grip_circumference_in: 4.125,
        face_material: 'Japanese Toray 700K Raw Carbon Fiber',
        core_material: 'Premium Honeycomb Polymer Core (Thermoformed)', core_thickness: 16,
        usapa_approved: true,
    },
    // ProXR Advantage 16 - based on ProXR brand specs
    'pdl_proxr_advantage': {
        weight_oz: '8.0-8.4', length_in: 16.5, width_in: 7.5,
        grip_length_in: 6.0, grip_circumference_in: 4.0,
        face_material: 'T700 Raw Carbon Fiber',
        core_material: 'Polypropylene Honeycomb + Shock Foam Perimeter', core_thickness: 16,
        usapa_approved: true,
    },
    // Paddletek Bantam EXL Pro - ソース: paddletek.com
    'pdl_paddletek_bantam_exl': {
        weight_oz: '7.6-8.1', length_in: 16.5, width_in: 7.5,
        face_material: 'Carbon Fiber (Smart Response Technology)',
        core_material: 'Bantam Polymer Core', core_thickness: 14,
        usapa_approved: true,
    },
    // Diadem Vice (EVA Core) - ソース: diadempickleball.com
    'pdl_diadem_vice': {
        weight_oz: '7.8-8.2', length_in: 16, width_in: 7.6,
        face_material: 'Carbon Fiber',
        core_material: 'EVA Core (静音設計)', core_thickness: 14,
        usapa_approved: true,
        unique_tech: '静音EVAコア - 騒音制限コート対応',
    },
    // Paddletek Tempest Wave Pro - ソース: paddletek.com
    'pdl_paddletek_tempest': {
        weight_oz: '7.6-8.0', length_in: 15.75, width_in: 8,
        face_material: 'Graphite',
        core_material: 'Polymer Core', core_thickness: 16,
        usapa_approved: true,
    },
    // Vatic Pro Alchemy 16mm (既存IDにweight追加)
    'pdl_vatic_pro_alchemy': {
        weight_oz: '7.9-8.2', length_in: 16.2, width_in: 7.7,
        grip_circumference_in: 4.25,
        usapa_approved: true,
    },
    // SixZero DBD 14mm (既存)
    // Already has weight from previous pass as pdl_sixzero_dbd_14
    // Asics Gel Resolution Paddle
    'pdl_asics_gel_paddle': {
        weight_oz: '8.0',
        usapa_approved: true,
    },
    // JOOLA Senator - 重複IDの場合
    'pdl_joola_senator': {
        weight_oz: '8.0', length_in: 15.75, width_in: 8,
        face_material: 'Carbon Friction Surface (CFS)',
        core_material: 'Response Polymer Core', core_thickness: 16,
        usapa_approved: true,
    },
    // CRBN Zero 16
    'pdl_crbn_zero': {
        weight_oz: '7.8-8.1', length_in: 16, width_in: 8,
        face_material: 'Fiberglass',
        core_material: 'Polymer Honeycomb', core_thickness: 16,
        usapa_approved: true,
    },
};

let count = 0;
for (const p of paddles) {
    const s = specs[p.id];
    if (s) { Object.assign(p, s); count++; }
}
saveJson('gears/paddles.json', paddles);

const withWeight = paddles.filter(p => p.weight_oz).length;
const withLength = paddles.filter(p => p.length_in).length;
const withUsapa = paddles.filter(p => p.usapa_approved !== undefined).length;
console.log(`反映: ${count}件`);
console.log(`weight_oz: ${withWeight}/${paddles.length}`);
console.log(`length_in: ${withLength}/${paddles.length}`);
console.log(`usapa: ${withUsapa}/${paddles.length}`);
console.log(`\n残りweight_oz未設定:`);
paddles.filter(p => !p.weight_oz).forEach(p => console.log(`  ${p.id}|${p.brand_name}|${p.product_name}`));
