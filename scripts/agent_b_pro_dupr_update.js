const fs = require('fs');

const PROS_FILE = 'production_data/players/pro_players.json';
let players = JSON.parse(fs.readFileSync(PROS_FILE, 'utf-8'));

const duprData = {
    'pro_ben_johns': { s: 7.066, d: 7.411 },
    'pro_anna_leigh_waters': { s: 6.570, d: 6.850 },
    'pro_tyson_mcguffin': { s: 6.861, d: 6.737 },
    'pro_riley_newman': { s: null, d: 6.815 },
    'pro_federico_staksrud': { s: 7.168, d: 7.011 },
    'pro_jack_sock': { s: 6.564, d: 6.499 },
    'pro_catherine_parenteau': { s: 6.025, d: 6.198 },
    'pro_lea_jansen': { s: 5.894, d: 5.874 },
    'pro_collin_johns': { s: 6.967, d: 6.497 },
    'pro_matt_wright': { s: null, d: 6.620 },
    'pro_jw_johnson': { s: 6.749, d: 7.153 },
    'pro_jorja_johnson': { s: 5.732, d: 6.253 },
    'pro_jackie_kawamoto': { s: 3.500, d: 6.082 },
    'pro_callie_smith': { s: 5.945, d: 5.914 },
    'pro_vivienne_david': { s: 5.525, d: 5.862 },
    'pro_dylan_frazier': { s: 6.386, d: 6.630 },
    'pro_andrei_daescu': { s: 6.617, d: 7.061 },
    'pro_thomas_wilson': { s: 6.504, d: 6.904 },
    'pro_dekel_bar': { s: 7.014, d: 6.517 },
    'pro_irina_tereschenko': { s: 5.453, d: 5.654 },
    'pro_zane_navratil': { s: 5.921, d: 6.425 },
    'pro_etta_wright': { s: 5.525, d: 6.051 },
    'pro_dayne_gingrich': { s: null, d: 5.914 },
    'pro_scott_moore': { s: null, d: 5.950 },
    'pro_beth_bellamy': { s: null, d: 5.771 },
    'pro_salome_devidze': { s: 6.002, d: 5.392 },
    'pro_jesse_irvine': { s: 5.120, d: 5.871 },
    'pro_lucy_kovalova': { s: 5.915, d: 5.804 }
};

let updated = 0;
players.forEach(p => {
    if (duprData[p.id]) {
        if (!p.career_stats) {
            p.career_stats = {};
        }
        p.career_stats.dupr_singles = duprData[p.id].s;
        p.career_stats.dupr_doubles = duprData[p.id].d;
        p.career_stats.data_source = "PPA Tour Official / DUPR.com / PickleWave (2026 Verified)";
        updated++;
    }
});

fs.writeFileSync(PROS_FILE, JSON.stringify(players, null, 2) + '\n', 'utf-8');
console.log(`Updated DUPR ratings for ${updated} players.`);
