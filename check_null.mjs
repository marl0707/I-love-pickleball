import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const regions = ['hokkaido_tohoku.json', 'kanto.json', 'chubu.json', 'kinki.json', 'chugoku_shikoku.json', 'kyushu_okinawa.json'];

let nullCount = 0;
let total = 0;

for (const region of regions) {
    const file = path.join(dir, region);
    if (!fs.existsSync(file)) continue;

    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    if (data.facilities) {
        for (const fac of data.facilities) {
            total++;
            if (!fac.access_info || !fac.access_info.directions_url) {
                console.log(`[NULL dir_url] ${fac.name}`);
                nullCount++;
            }
            if (fac.facility_amenities === undefined || fac.facility_amenities.is_indoor === undefined) {
                console.log(`[NULL is_indoor] ${fac.name}`);
                nullCount++;
            }
        }
    }
}

console.log(`Check complete. Total: ${total}, Missing items: ${nullCount}`);
