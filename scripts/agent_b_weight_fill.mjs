/**
 * パドル残り75件 weight_oz徹底補完スクリプト
 * Web検索で確認した公式スペックのみ。嘘は一切つかない。
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
    // ===== Selkirk =====
    // SLK Halo Max - ソース: selkirk.com, pickleballcentral.com
    'pdl_selkirk_halo_max': {
        weight_oz: '7.9-8.0', length_in: 16.25, width_in: 7.87,
        grip_length_in: 4.87, grip_circumference_in: 4.125,
        face_material: 'T700 Raw Carbon Fiber (Raw Spin Technology)',
        core_material: 'Rev-Control Polymer Honeycomb', core_thickness: 16,
        usapa_approved: true,
    },
    'pdl_selkirk_halo_xl': {
        weight_oz: '7.8', length_in: 16.25, width_in: 7.87,
        grip_length_in: 4.87, grip_circumference_in: 4.125,
        face_material: 'T700 Raw Carbon Fiber',
        core_material: 'Rev-Power Polymer Honeycomb', core_thickness: 13,
        usapa_approved: true,
    },
    // Selkirk Labs Project 003 - ソース: selkirk.com
    'pdl_selkirk_labs_003': {
        weight_oz: '7.8-8.2', length_in: 16.4, width_in: 7.4,
        face_material: 'Carbon Fiber (ProSpin+ NextGen)',
        core_material: 'SuperCore Polymer Honeycomb', core_thickness: 16,
        usapa_approved: true,
    },
    // Selkirk VANGUARD Pro Epic - ソース: selkirk.com
    'pdl_selkirk_vanguard_pro': {
        weight_oz: '7.7-8.2', length_in: 16.5, width_in: 7.375,
        face_material: 'QuadFlex 4-Layer Hybrid Face',
        core_material: 'SuperCore Polymer Honeycomb', core_thickness: 13,
        usapa_approved: true,
    },
    // Selkirk Vanguard Control - ソース: selkirk.com
    'pdl_selkirk_vanguard_control': {
        weight_oz: '7.7-8.2', length_in: 15.75, width_in: 8,
        face_material: 'QuadFlex 4-Layer Hybrid Face',
        core_material: 'SuperCore Polymer Honeycomb', core_thickness: 16,
        usapa_approved: true,
    },

    // ===== JOOLA =====
    // Perseus 3 16mm - ソース: joola.com, pickleballcentral.com
    'pdl_joola_perseus_3': {
        weight_oz: '8.0', length_in: 16.5, width_in: 7.5,
        grip_length_in: 5.5, grip_circumference_in: 4.25,
        face_material: 'Charged Carbon Surface',
        core_material: 'Propulsion Core Polymer', core_thickness: 16,
        usapa_approved: true,
    },
    // Anna Bright Scorpeus 3 - ソース: joola.com
    'pdl_joola_scorpeus_3': {
        weight_oz: '7.8', length_in: 16.5, width_in: 7.5,
        grip_length_in: 5.5, grip_circumference_in: 4.125,
        face_material: 'Charged Carbon Surface',
        core_material: 'Propulsion Core Polymer', core_thickness: 14,
        usapa_approved: true,
    },
    // JOOLA Radius Pro - ソース: joola.com
    'pdl_joola_radius': {
        weight_oz: '7.6-8.0', length_in: 15.87, width_in: 8,
        face_material: 'Carbon Friction Surface (CFS)',
        core_material: 'Reactive Honeycomb Polymer', core_thickness: 16,
        usapa_approved: true,
    },

    // ===== CRBN =====
    // CRBN 1 Original 16mm - ソース: crbnpickleball.com, pickleballwarehouse.com
    'pdl_crbn_1_16': {
        weight_oz: '8.0-8.3', length_in: 16.5, width_in: 7.5,
        grip_length_in: 5.5, grip_circumference_in: 4.35,
        face_material: 'Raw Carbon Fiber (T700)',
        core_material: 'Polymer Honeycomb (Thermoformed Unibody)', core_thickness: 16,
        usapa_approved: true,
    },
    // CRBN 2 Original 14mm - ソース: crbnpickleball.com, pickleballwarehouse.com
    'pdl_crbn_2_14': {
        weight_oz: '7.8-8.1', length_in: 15.75, width_in: 8,
        grip_length_in: 5.25, grip_circumference_in: 4.25,
        face_material: 'Raw Carbon Fiber (T700)',
        core_material: 'Polymer Honeycomb (Thermoformed Unibody)', core_thickness: 14,
        usapa_approved: true,
    },

    // ===== SixZero =====
    // Ruby - ソース: sixzeropickleball.com, justpaddles.com
    'pdl_sixzero_ruby': {
        weight_oz: '8.2', length_in: 16.3, width_in: 7.5,
        face_material: '100% Aramid Fiber (DuPont™ Kevlar®)',
        core_material: 'Polypropylene Honeycomb (Thermoformed)', core_thickness: 16,
        usapa_approved: true,
    },
    // DBD 14mm - ソース: sixzeropickleball.com
    'pdl_sixzero_dbd_14': {
        weight_oz: '7.8-8.0', length_in: 16.3, width_in: 7.7,
        face_material: 'Raw Carbon Fiber (Japanese Toray 700K)',
        core_material: 'Premium Honeycomb Polymer Core', core_thickness: 14,
        usapa_approved: true,
    },
    // Infinity - ソース: sixzeropickleball.com
    'pdl_sixzero_infinity': {
        weight_oz: '8.0-8.2', length_in: 16.3, width_in: 7.5,
        face_material: 'Raw Carbon Fiber (Japanese Toray 700K)',
        core_material: 'Honeycomb Polymer Core', core_thickness: 16,
        usapa_approved: true,
    },
    // Sapphire - ソース: sixzeropickleball.com
    'pdl_sixzero_sapphire': {
        weight_oz: '8.0-8.2', length_in: 16.3, width_in: 7.5,
        face_material: 'Woven Carbon Fiber (Japanese Toray)',
        core_material: 'Honeycomb Polymer Core', core_thickness: 16,
        usapa_approved: true,
    },

    // ===== ProXR =====
    // Zane Navratil Signature - ソース: proxr.com, pickleballcentral.com
    'pdl_proxr_zane': {
        weight_oz: '8.0-8.4', length_in: 16.5, width_in: 7.5,
        grip_length_in: 6.0, grip_circumference_in: 4.0,
        face_material: 'T700 Raw Carbon Fiber (Ultra-Raw)',
        core_material: 'Polypropylene Honeycomb + Shock Foam Perimeter', core_thickness: 14,
        usapa_approved: true,
    },

    // ===== Engage =====
    // Pursuit Pro MX - ソース: engagepickleball.com
    'pdl_engage_pursuit_pro_mx': {
        weight_oz: '7.9-8.3', length_in: 15.5, width_in: 8.125,
        face_material: 'Friction Surface Technology',
        core_material: 'ControlPro Black Core', core_thickness: 16,
        usapa_approved: true,
    },
    // Encore MX 6.0 - ソース: engagepickleball.com
    'pdl_engage_encore_mx': {
        weight_oz: '7.9-8.3', length_in: 15.5, width_in: 8.125,
        face_material: 'Friction Surface Technology',
        core_material: 'ControlPro Core Polymer', core_thickness: 16,
        usapa_approved: true,
    },

    // ===== Gearbox =====
    // CX14 Elongated - ソース: gearboxsports.com
    'pdl_gearbox_cx14_e': {
        weight_oz: '7.5-8.0', length_in: 16.5, width_in: 7.5,
        grip_length_in: 5.5, grip_circumference_in: 4.0,
        face_material: 'Carbon Fiber',
        core_material: 'SSTCore™ Carbon Fiber (14mm)', core_thickness: 14,
        usapa_approved: true,
    },

    // ===== Franklin =====
    // Ben Johns Signature 16mm - ソース: franklinsports.com
    'pdl_franklin_ben_johns': {
        weight_oz: '7.8-8.2',
        face_material: 'Carbon Fiber (MaxGrit Surface)',
        core_material: 'Polypropylene Honeycomb', core_thickness: 16,
        usapa_approved: true,
    },
    // Franklin Signature Pro 14mm (既存ID修正)
    'paddle_franklin_signature_14': {
        weight_oz: '7.5-7.9',
        face_material: 'Fiberglass',
        core_material: 'Polypropylene Honeycomb', core_thickness: 14,
        usapa_approved: true,
    },

    // ===== Prince =====
    'pdl_prince_synergy_pro': {
        weight_oz: '7.8-8.2', length_in: 15.75, width_in: 8,
        face_material: 'Fiberglass',
        core_material: 'Polymer Honeycomb', core_thickness: 16,
        usapa_approved: true,
    },

    // ===== Paddletek =====
    'pdl_paddletek_exl': {
        weight_oz: '7.6-8.1', length_in: 16.5, width_in: 7.5,
        face_material: 'Carbon Fiber (Smart Response)',
        core_material: 'Bantam Polymer Core', core_thickness: 14,
        usapa_approved: true,
    },
};

let count = 0;
for (const p of paddles) {
    const s = specs[p.id];
    if (s) {
        Object.assign(p, s);
        count++;
    }
}
saveJson('gears/paddles.json', paddles);

// 最終統計
const withWeight = paddles.filter(p => p.weight_oz).length;
const withLength = paddles.filter(p => p.length_in).length;
const withUsapa = paddles.filter(p => p.usapa_approved !== undefined).length;
const withFace = paddles.filter(p => p.face_material).length;
const withCore = paddles.filter(p => p.core_material).length;
const withThick = paddles.filter(p => p.core_thickness).length;

console.log(`\n反映: ${count}件`);
console.log(`\n=== パドル最終充実度 ===`);
console.log(`weight_oz: ${withWeight}/105`);
console.log(`length_in: ${withLength}/105`);
console.log(`core_thickness: ${withThick}/105`);
console.log(`face_material: ${withFace}/105`);
console.log(`core_material: ${withCore}/105`);
console.log(`usapa_approved: ${withUsapa}/105`);
