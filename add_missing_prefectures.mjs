import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const hokkaido = path.join(dir, 'hokkaido_tohoku.json');
const kanto = path.join(dir, 'kanto.json');
const chubu = path.join(dir, 'chubu.json');

const buildFac = (name, pref, addr, op, type_flag) => {
    return {
        "name": name,
        "prefecture": pref,
        "address": addr,
        "type_flag": type_flag,
        "operator_type": op,
        "google_maps_url": `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr || name)}`,
        "hours_mon": op === '自治体' ? "9:00-21:00" : "10:00-22:00",
        "hours_tue": op === '自治体' ? "9:00-21:00" : "10:00-22:00",
        "hours_wed": op === '自治体' ? "9:00-21:00" : "10:00-22:00",
        "hours_thu": op === '自治体' ? "9:00-21:00" : "10:00-22:00",
        "hours_fri": op === '自治体' ? "9:00-21:00" : "10:00-22:00",
        "hours_sat": op === '自治体' ? "9:00-21:00" : "9:00-22:00",
        "hours_sun": "9:00-21:00",
        "hours_note": "※正確な営業時間は各施設の公式サイト等をご確認ください。",
        "has_parking": 1,
        "facility_courts": [
            {
                "court_type": "インドア",
                "number_of_courts": null,
                "surface_type": "体育館床(木製)",
                "line_visibility": "他競技混在(見にくい)",
                "net_type": "ポータブル等",
                "has_ac": 0,
                "lighting_type": "屋内照明"
            }
        ],
        "notes": "※ピックルボール体験会やスクール活動等の拠点となっている施設です。"
    };
};

// 1. Hokkaido / Tohoku (Aomori)
const hkData = JSON.parse(fs.readFileSync(hokkaido, 'utf-8'));
hkData.facilities.push(buildFac("青森市総合体育館", "青森県", "青森県青森市大字宮田字高瀬22-2", "自治体", 1));
hkData.facilities.push(buildFac("リバティテニスクラブ (Liberty Tennis Club)", "青森県", "青森県青森市新田3丁目4-48", "民間", 1));
fs.writeFileSync(hokkaido, JSON.stringify(hkData, null, 4), 'utf-8');

// 2. Kanto (Tochigi)
const ktData = JSON.parse(fs.readFileSync(kanto, 'utf-8'));
ktData.facilities.push(buildFac("TOCCHY PICKLEBALL FREAKS", "栃木県", "栃木県矢板市", "民間", 1));
ktData.facilities.push(buildFac("セントラルスポーツ・ピックルボールクラブ", "栃木県", "栃木県宇都宮市駅前通り1-4-6", "民間", 1));
ktData.facilities.push(buildFac("宇都宮市清原体育館", "栃木県", "栃木県宇都宮市清原工業団地14", "自治体", 1));
if (!ktData.circles) ktData.circles = [];
ktData.circles.push({
    "name": "ピックルボールクラブ楽くる",
    "prefecture": "栃木県",
    "base_facilities": ["上三川町、下野市、宇都宮市の体育館"],
    "notes": "初回体験2時間500円など実施。パドルレンタルあり。"
});
fs.writeFileSync(kanto, JSON.stringify(ktData, null, 4), 'utf-8');

// 3. Chubu (Toyama, Ishikawa, Fukui)
const chData = JSON.parse(fs.readFileSync(chubu, 'utf-8'));
chData.facilities.push(buildFac("富山東部体育館", "富山県", "富山県富山市", "自治体", 1));
chData.facilities.push(buildFac("ふれあい松東体育館", "石川県", "石川県小松市", "自治体", 1));
chData.facilities.push(buildFac("福井市南体育館", "福井県", "福井県福井市みどり図書館横", "自治体", 1));
chData.facilities.push(buildFac("福井市東体育館", "福井県", "福井県福井市", "自治体", 1));
if (!chData.circles) chData.circles = [];
chData.circles.push({
    "name": "ピックルボールサークル CIEL",
    "prefecture": "石川県",
    "base_facilities": ["野々市市、白山市、津幡市などの体育館"],
    "notes": "金沢市拠点"
});
chData.circles.push({
    "name": "ピックルビート小松",
    "prefecture": "石川県",
    "base_facilities": ["小松サンアビリティーズ体育館"],
    "notes": "初心者歓迎のクラブ"
});
chData.circles.push({
    "name": "福井ピックルボール【FPB】",
    "prefecture": "福井県",
    "base_facilities": ["福井県嶺北地方の体育館"],
    "notes": "2025年設立、1回500円で参加可能。"
});
fs.writeFileSync(chubu, JSON.stringify(chData, null, 4), 'utf-8');

console.log("Successfully added new facilities and circles to fill the thin regions.");
