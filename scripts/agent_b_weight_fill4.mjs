import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = join(__dirname, '..', 'production_data');
const d = JSON.parse(readFileSync(join(BASE, 'gears/paddles.json'), 'utf-8'));
const specs = {
    'pdl_niupipo_explorer': { weight_oz: '8.0-8.2', length_in: 15.94, width_in: 7.91, grip_length_in: 4.96, grip_circumference_in: 4.45, face_material: 'Graphite Carbon Fiber', core_material: 'Polymer Honeycomb', usapa_approved: true },
    'pdl_head_radical_pro': { weight_oz: '8.1', length_in: 16, width_in: 7.875, grip_length_in: 5, grip_circumference_in: 4.125, usapa_approved: true },
    'pdl_head_gravity_tour': { weight_oz: '8.4-8.5', length_in: 15.75, width_in: 8.1, grip_length_in: 4.9, face_material: '12K Raw Carbon / Hybrid Hitting Surface', core_material: 'FoamedCore PP Honeycomb', core_thickness: 17, usapa_approved: true },
    'pdl_onyx_evoke_premier': { weight_oz: '7.8-8.2', length_in: 16, width_in: 8, grip_length_in: 5, grip_circumference_in: 4.125, face_material: 'DF Composite (Textured Fiberglass)', core_material: 'Polypropylene Honeycomb', core_thickness: 13, usapa_approved: true, unique_tech: 'Atomic 13 Edge Guard' },
    'pdl_onyx_z5': { weight_oz: '7.5-8.2', length_in: 15.5, width_in: 8.125, grip_length_in: 5, grip_circumference_in: 4.25, face_material: 'Graphite', core_material: 'Nomex Honeycomb', usapa_approved: true },
    'pdl_amazin_aces': { weight_oz: '7.8-8.2', face_material: 'Graphite', core_material: 'Polymer Honeycomb', usapa_approved: true },
    'pdl_vinsguir_carbon': { weight_oz: '7.76-8.11', face_material: 'Carbon Fiber', core_material: 'Polymer Honeycomb', usapa_approved: true },
    'pdl_legacy_pro': { weight_oz: '8.0-8.4', face_material: 'Raw Carbon Fiber', core_material: 'Polypropylene Honeycomb (Thermoformed, Foam Injected)', core_thickness: 16, usapa_approved: true },
    'pdl_electrum_pro_ii': { weight_oz: '7.9-8.2', length_in: 16, width_in: 8, grip_length_in: 5.25, grip_circumference_in: 4.25, face_material: 'Composite', core_material: 'Polymer Honeycomb', core_thickness: 11, usapa_approved: true },
    'pdl_prince_response_pro': { weight_oz: '7.7-8.2', length_in: 15.75, width_in: 8, usapa_approved: true },
    'pdl_prince_spectrum_pro': { weight_oz: '7.6-8.0', usapa_approved: true },
    'pdl_gamma_never_stop': { weight_oz: '7.6-8.0', face_material: 'Fiberglass', core_material: 'NeuCore Polypropylene Honeycomb', usapa_approved: true },
    'pdl_joola_gen3_alpha': { weight_oz: '8.0', usapa_approved: true },
    'pdl_crbn_magnum': { weight_oz: '8.0-8.3', usapa_approved: true },
    'pdl_engage_omega': { weight_oz: '7.9-8.3', usapa_approved: true },
    'pdl_macgregor_classic': { weight_oz: '7.5', usapa_approved: false },
    'pdl_bigdill_original': { weight_oz: '7.5-7.8', face_material: 'Fiberglass', core_material: 'Polymer Honeycomb', usapa_approved: true },
    'pdl_franklin_christina': { weight_oz: '7.5-8.0', face_material: 'Carbon Fiber', core_material: 'Polypropylene Honeycomb', usapa_approved: true },
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
