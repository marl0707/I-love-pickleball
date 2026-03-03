import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const regions = [
    'hokkaido_tohoku.json', 'kanto.json', 'chubu.json',
    'kinki.json', 'chugoku_shikoku.json', 'kyushu_okinawa.json'
];

let totalFacilities = 0;
let missingDirectionsUrl = [];
let missingIndoorInfo = [];
let missingAccessInfo = [];
let shortAddress = [];

for (const region of regions) {
    const file = path.join(dir, region);
    if (!fs.existsSync(file)) continue;

    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));

    if (data.facilities) {
        for (const fac of data.facilities) {
            totalFacilities++;

            // 1. Missing directions_url
            if (!fac.access_info || !fac.access_info.directions_url) {
                missingDirectionsUrl.push({ region, name: fac.name, prefecture: fac.prefecture });
            }

            // 2. Missing access_info entirely or guide
            if (!fac.access_info || !fac.access_info.guide) {
                missingAccessInfo.push({ region, name: fac.name });
            }

            // 3. Missing is_indoor in facility_amenities
            if (!fac.facility_amenities || fac.facility_amenities.is_indoor === undefined) {
                missingIndoorInfo.push({ region, name: fac.name });
            }

            // 4. Short address (just prefecture name, implies lacking exact city/street)
            if (fac.address === fac.prefecture) {
                shortAddress.push({ region, name: fac.name, address: fac.address });
            }
        }
    }
}

console.log(`--- DATA AUDIT REPORT ---`);
console.log(`Total Facilities Scanned: ${totalFacilities}`);
console.log(`\n1. Missing Navigation URL (directions_url): ${missingDirectionsUrl.length} facilities`);
console.log(missingDirectionsUrl.map(f => `  - [${f.prefecture}] ${f.name}`).join('\n'));

console.log(`\n2. Missing Access Guide: ${missingAccessInfo.length} facilities`);
console.log(`\n3. Missing Indoor/Outdoor Flag (is_indoor): ${missingIndoorInfo.length} facilities`);
// console.log(missingIndoorInfo.map(f => `  - ${f.name}`).join('\n'));

console.log(`\n4. Incomplete Address (City/Street missing): ${shortAddress.length} facilities`);
console.log(shortAddress.map(f => `  - ${f.name} (Address: ${f.address})`).join('\n'));
