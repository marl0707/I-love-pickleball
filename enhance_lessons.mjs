import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const kantoFile = path.join(dir, 'kanto.json');
const kinkiFile = path.join(dir, 'kinki.json');

// Kanto Enrichemnt
let kantoData = JSON.parse(fs.readFileSync(kantoFile, 'utf-8'));

const kantoFacilities = kantoData.facilities;
const vipIndex = kantoFacilities.findIndex(f => f.name.includes('VIPインドアピックルボールクラブ'));
if (vipIndex !== -1) {
    kantoFacilities[vipIndex].notes += " ※JPA公認コーチ在籍、定期的なスクール・レッスンを開講中。トップクラスの指導を受けられる環境です。";
    kantoFacilities[vipIndex].has_school = 1;
}

// Add newly discovered major facilities to Kanto
kantoFacilities.push({
    "name": "Pickleball One Ginza Shimbashi",
    "prefecture": "東京都",
    "city": "千代田区",
    "address": "東京都千代田区",
    "type_flag": 1,
    "operator_type": "民間",
    "google_maps_url": "https://www.google.com/maps/search/?api=1&query=Pickleball+One+Ginza+Shimbashi",
    "has_school": 1,
    "facility_shops": {
        "rental_detail": "日本最大級のピックルボールショップ併設。パドルの試打や購入が可能。"
    },
    "notes": "専用インドアコートとショップを併設したピックルボールの総合拠点。初心者向けレッスンやスクールも充実。"
});

kantoFacilities.push({
    "name": "テニス＆バドミントンスクール ノア南町田校",
    "prefecture": "東京都",
    "city": "町田市",
    "address": "東京都町田市",
    "type_flag": 1,
    "operator_type": "民間",
    "google_maps_url": "https://www.google.com/maps/search/?api=1&query=ノア南町田校+ピックルボール",
    "has_school": 1,
    "notes": "初心者向けのピックルボールクラスを定期開講。インドア環境でのレッスンが受けられます。"
});

kantoData.last_updated = new Date().toISOString().split('T')[0];
fs.writeFileSync(kantoFile, JSON.stringify(kantoData, null, 4), 'utf-8');

// Kinki Enrichment
let kinkiData = JSON.parse(fs.readFileSync(kinkiFile, 'utf-8'));
const kinkiFacilities = kinkiData.facilities;

kinkiFacilities.push({
    "name": "ラスティ高槻 テニススクール",
    "prefecture": "大阪府",
    "city": "高槻市",
    "address": "大阪府高槻市",
    "type_flag": 1,
    "operator_type": "民間",
    "google_maps_url": "https://www.google.com/maps/search/?api=1&query=ラスティ高槻",
    "has_school": 1,
    "notes": "日本ピックルボール協会(JPA)に加盟しているスクール。公認コーチによるレッスンを受講可能。"
});

kinkiFacilities.push({
    "name": "ラスティ寝屋川 テニススクール",
    "prefecture": "大阪府",
    "city": "寝屋川市",
    "address": "大阪府寝屋川市",
    "type_flag": 1,
    "operator_type": "民間",
    "google_maps_url": "https://www.google.com/maps/search/?api=1&query=ラスティ寝屋川",
    "has_school": 1,
    "notes": "日本ピックルボール協会(JPA)に加盟しているスクール。冷暖房完備のインドアコートで指導を受けられます。"
});

kinkiFacilities.push({
    "name": "Pickleball Base Osaka (2026年4月オープン)",
    "prefecture": "大阪府",
    "city": "堺市",
    "address": "大阪府堺市",
    "type_flag": 1,
    "operator_type": "民間",
    "google_maps_url": "https://www.google.com/maps/search/?api=1&query=Pickleball+Base+Osaka",
    "facility_courts": [{
        "court_type": "インドア",
        "number_of_courts": 6,
        "surface_type": "国際基準コート"
    }],
    "notes": "2026年4月1日オープン予定。西日本最大級となる国際基準コート6面を備えた大阪初のピックルボール専門施設。"
});

kinkiData.last_updated = new Date().toISOString().split('T')[0];
fs.writeFileSync(kinkiFile, JSON.stringify(kinkiData, null, 4), 'utf-8');

console.log("Successfully enhanced Kanto and Kinki JSONs with Professional JPA coaching, school info, and dedicated new facilities.");
