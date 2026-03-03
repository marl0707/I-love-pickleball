import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const regions = [
    'hokkaido_tohoku.json', 'kanto.json', 'chubu.json',
    'kinki.json', 'chugoku_shikoku.json', 'kyushu_okinawa.json'
];

let surfaceAdded = 0;
let visitorAdded = 0;

for (const region of regions) {
    const file = path.join(dir, region);
    if (!fs.existsSync(file)) continue;

    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    let modified = false;

    if (data.facilities) {
        for (const fac of data.facilities) {

            if (!fac.facility_amenities) {
                fac.facility_amenities = {};
            }

            // 1. court_surface
            if (!fac.facility_amenities.court_surface) {
                let surface = "不明";
                const name = fac.name;

                // Rule 1: Public gyms use wood (ウッド/体育館床)
                if (name.includes("体育館") || name.includes("スポーツセンター") || name.includes("アリーナ") || name.includes("公民館") || name.includes("ドーム")) {
                    surface = "ウッド（木・体育館）";
                }
                // Rule 2: Outdoor public/private courts heavily lean on Omni (砂入り人工芝) or Hard in Japan
                else if (!fac.facility_amenities.is_indoor && (name.includes("公園") || name.includes("庭球場"))) {
                    surface = "オムニ（砂入り人工芝）推奨またはハード";
                }
                // Rule 3: Indoor Tennis Schools are often Carpet or Hard
                else if (fac.facility_amenities.is_indoor && (name.includes("スクール") || name.includes("インドア"))) {
                    surface = "カーペット または ハード";
                }
                // Known specific massive hard courts
                else if (name.includes("KPI")) {
                    surface = "ハード";
                }

                fac.facility_amenities.court_surface = surface;
                surfaceAdded++;
                modified = true;
            }

            // 2. visitor_welcome
            if (fac.facility_amenities.visitor_welcome === undefined) {
                let welcome = false;
                const name = fac.name;

                // Rule: "体験" "スクール" "クラブ" "ラウンドワン" usually highly welcome drop-in or trial
                if (name.includes("ラウンドワン") || name.includes("スクール") || name.includes("クラブ") || name.includes("DIVO") || name.includes("ノア")) {
                    welcome = true;
                }
                // Rule: If it's a huge established region it's likely welcome
                if (fac.has_school) welcome = true;

                fac.facility_amenities.visitor_welcome = welcome;
                visitorAdded++;
                modified = true;
            }
        }
    }

    if (modified) {
        data.last_updated = new Date().toISOString().split('T')[0];
        fs.writeFileSync(file, JSON.stringify(data, null, 4), 'utf-8');
    }
}

console.log(`--- PLAYER EXPERIENCE EXPANSION COMPLETE ---`);
console.log(`Assigned inferred 'court_surface': ${surfaceAdded} facilities`);
console.log(`Assigned inferred 'visitor_welcome': ${visitorAdded} facilities`);
