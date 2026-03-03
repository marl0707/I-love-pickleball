import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = join(__dirname, '..', 'production_data');
const d = JSON.parse(readFileSync(join(BASE, 'gears/paddles.json'), 'utf-8'));
const specs = {
    'pdl_paddletek_tsunami': { weight_oz: '7.6-8.0', length_in: 15.875, width_in: 8, grip_length_in: 5.25, core_thickness: 14, face_material: 'Textured Graphite', core_material: 'Tempest SRT Core (Advanced Polymer)', usapa_approved: true },
    'pdl_vulcan_v520_control': { weight_oz: '7.8-8.2', core_thickness: 13, usapa_approved: true },
    'pdl_vulcan_v900': { weight_oz: '7.6-8.0', length_in: 16.5, width_in: 7.5, grip_length_in: 5.5, grip_circumference_in: 4.25, core_thickness: 16, usapa_approved: true },
    'pdl_franklin_carbon_stk': { weight_oz: '7.5-8.0', core_thickness: 14, usapa_approved: true },
    'pdl_diadem_warrior': { weight_oz: '8.0-8.4', core_thickness: 16, usapa_approved: true },
    'pdl_volair_mach1_forza': { weight_oz: '8.2', length_in: 16.3, width_in: 7.5, grip_length_in: 5.5, grip_circumference_in: 4.125, face_material: 'T700 Raw Carbon Fiber', core_material: 'Polypropylene Honeycomb (Foam Walls, Thermoformed)', core_thickness: 16, usapa_approved: true },
    'pdl_volair_mach2_forza': { weight_oz: '8.0', length_in: 16, width_in: 8, grip_length_in: 5.5, grip_circumference_in: 4.125, face_material: 'T700 Raw Carbon Fiber', core_material: 'Polypropylene Honeycomb (Foam Walls, Thermoformed)', core_thickness: 16, usapa_approved: true },
    'pdl_ronbus_r3_pulsar': { weight_oz: '7.8-8.2', length_in: 16.5, width_in: 7.5, grip_length_in: 5.5, grip_circumference_in: 4.125, core_thickness: 16, usapa_approved: true },
    'pdl_vatic_pro_v7': { weight_oz: '8.2-8.5', core_thickness: 16, usapa_approved: true },
    'pdl_gruvn_mula': { weight_oz: '7.9', length_in: 16.5, width_in: 7.375, grip_length_in: 5.875, grip_circumference_in: 4.125, face_material: 'T700 Raw Carbon Fiber', core_material: 'Polypropylene Honeycomb (Thermoformed)', core_thickness: 16, usapa_approved: true },
    'pdl_hudef_viva_pro': { weight_oz: '7.8-8.2', core_thickness: 16, usapa_approved: true },
};
let c = 0;
for (const p of d) { const s = specs[p.id]; if (s) { Object.assign(p, s); c++; } }
writeFileSync(join(BASE, 'gears/paddles.json'), JSON.stringify(d, null, 2) + '\n');
const wt = d.filter(p => p.weight_oz).length;
const ln = d.filter(p => p.length_in).length;
const us = d.filter(p => p.usapa_approved !== undefined).length;
console.log('Reflected: ' + c);
console.log('weight_oz: ' + wt + '/' + d.length);
console.log('length_in: ' + ln + '/' + d.length);
console.log('usapa: ' + us + '/' + d.length);
const remaining = d.filter(p => !p.weight_oz);
console.log('Remaining: ' + remaining.length);
remaining.forEach(p => console.log('  ' + p.id + '|' + p.brand_name));
