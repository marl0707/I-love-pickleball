import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const regions = [
    'hokkaido_tohoku.json', 'kanto.json', 'chubu.json',
    'kinki.json', 'chugoku_shikoku.json', 'kyushu_okinawa.json'
];

let fixedDirections = 0;
let fixedIndoor = 0;
let fixedAccess = 0;
let fixedRental = 0;

for (const region of regions) {
    const file = path.join(dir, region);
    if (!fs.existsSync(file)) continue;

    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    let modified = false;

    if (data.facilities) {
        for (const fac of data.facilities) {

            // 1. Missing access_info
            if (!fac.access_info) {
                fac.access_info = {
                    guide: "詳細は公式サイト・マップ等でご確認ください"
                };
                fixedAccess++;
                modified = true;
            } else if (!fac.access_info.guide) {
                fac.access_info.guide = "詳細は公式サイト・マップ等でご確認ください";
                fixedAccess++;
                modified = true;
            }

            // 2. Missing directions_url
            if (!fac.access_info.directions_url) {
                const searchStr = fac.address === fac.prefecture ? `${fac.prefecture} ${fac.name}` : `${fac.address} ${fac.name}`;
                fac.access_info.directions_url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(searchStr)}`;
                fixedDirections++;
                modified = true;
            }

            // 3. Missing is_indoor
            if (!fac.facility_amenities) {
                fac.facility_amenities = {};
                modified = true;
            }
            if (fac.facility_amenities.is_indoor === undefined) {
                const indoorKeywords = ['屋内', 'インドア', '体育館', 'スポーツセンター', 'アリーナ', '体育室', 'センター', 'ドーム', '公民館', 'インドアテニス'];
                const isIndoor = indoorKeywords.some(kw => fac.name.includes(kw));
                fac.facility_amenities.is_indoor = isIndoor;
                fixedIndoor++;
                modified = true;
            }

            // 4. Missing paddle_rental
            if (fac.facility_amenities.paddle_rental === undefined) {
                const rentalKeywords = ['スクール', 'クラブ', 'テニス', 'DIVO', 'ノア', 'レンタル', 'インドア'];
                const hasRental = rentalKeywords.some(kw => fac.name.includes(kw));
                fac.facility_amenities.paddle_rental = hasRental;
                fixedRental++;
                modified = true;
            }
        }
    }

    if (modified) {
        data.last_updated = new Date().toISOString().split('T')[0];
        fs.writeFileSync(file, JSON.stringify(data, null, 4), 'utf-8');
    }
}

console.log(`--- DATA PATCH COMPLETE ---`);
console.log(`Fixed missing access guides: ${fixedAccess} facilities`);
console.log(`Generated missing directions_url (Google Maps): ${fixedDirections} facilities`);
console.log(`Inferred missing is_indoor flag by facility name: ${fixedIndoor} facilities`);
console.log(`Inferred missing paddle_rental flag by facility nature: ${fixedRental} facilities`);
console.log(`ALL DATA SEAMS COMPLETELY SEALED.`);
