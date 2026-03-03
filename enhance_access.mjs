import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const regions = [
    'hokkaido_tohoku.json', 'kanto.json', 'chubu.json',
    'kinki.json', 'chugoku_shikoku.json', 'kyushu_okinawa.json'
];

for (const region of regions) {
    const file = path.join(dir, region);
    if (!fs.existsSync(file)) continue;

    let data = JSON.parse(fs.readFileSync(file, 'utf-8'));

    // Process Facilities
    if (data.facilities) {
        for (const fac of data.facilities) {
            const dest = fac.address || fac.name;
            // Provide a direct "Calculate Route" link compatible with Google Maps Web and Mobile App
            fac.directions_url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;

            // Generate smart access note
            let accessMsg = "最寄り駅・バス停からの経路はルート検索（ナビ）をご利用ください。";

            // Special hardcoded know-how
            if (fac.name.includes("港区スポーツセンター")) accessMsg = "田町駅東口から徒歩約5分。駅直結のペデストリアンデッキ経由でアクセス良好。";
            if (fac.name.includes("東京タワー")) accessMsg = "赤羽橋駅から徒歩5分、神谷町駅から徒歩7分。東京タワー直下です。";
            if (fac.name.includes("有明テニスの森")) accessMsg = "国際展示場駅から徒歩8分、有明駅から徒歩8分。";
            if (fac.name.includes("日環アリーナ")) accessMsg = "西川田駅から徒歩約15分。またはJR宇都宮駅からバス（総合運動公園西行き等）。";

            // Combining with parking know-how
            if (fac.facility_amenities && fac.facility_amenities.has_parking === 1) {
                accessMsg = "車での来場が便利です（駐車場あり）。電車・バスの場合はルート検索をご活用ください。 " + (accessMsg.includes("ルート検索") ? "" : accessMsg);
            }

            fac.access_info = {
                "guide": accessMsg.trim()
            };
        }
    }

    // Write back
    data.last_updated = new Date().toISOString().split('T')[0];
    fs.writeFileSync(file, JSON.stringify(data, null, 4), 'utf-8');
}

// Special treatment for chain nationwide
const chainFile = path.join(dir, 'chain_nationwide.json');
if (fs.existsSync(chainFile)) {
    let chainData = JSON.parse(fs.readFileSync(chainFile, 'utf-8'));
    for (const c of chainData.chains) {
        for (const b of c.branches) {
            const dest = b.address || b.name;
            b.directions_url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
        }
    }
    fs.writeFileSync(chainFile, JSON.stringify(chainData, null, 4), 'utf-8');
}

console.log("Successfully added God-level Transit & Navigation URLs to all facilities across Japan.");
