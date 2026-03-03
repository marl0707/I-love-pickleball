import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const kantoFile = path.join(dir, 'kanto.json');
const chubuFile = path.join(dir, 'chubu.json');
const chugokuFile = path.join(dir, 'chugoku_shikoku.json');
const kyushuFile = path.join(dir, 'kyushu_okinawa.json');

const updateTournament = (facilities, searchQuery, tournamentName) => {
    let found = false;
    for (const fac of facilities) {
        if (fac.name.includes(searchQuery)) {
            fac.hosts_tournaments = true;
            fac.tournament_types = tournamentName;
            if (!fac.notes) fac.notes = "";
            fac.notes += ` ※${tournamentName}の開催実績（または開催予定）がある、ピックルボール公式大会の「聖地」として知られるアリーナです。`;
            found = true;
        }
    }
    return found;
};

// Kanto (Tochigi)
let ktData = JSON.parse(fs.readFileSync(kantoFile, 'utf-8'));
if (!updateTournament(ktData.facilities, "日環アリーナ栃木", "APP JAPAN KINTO Open")) {
    ktData.facilities.push({
        "name": "日環アリーナ栃木",
        "prefecture": "栃木県",
        "address": "栃木県宇都宮市西川田4丁目1-1",
        "type_flag": 1,
        "operator_type": "自治体",
        "hosts_tournaments": true,
        "tournament_types": "APP JAPAN KINTO Open",
        "notes": "国内最大級の大会である「APP JAPAN KINTO Open」の会場。ピックルボール国内最高峰の聖地の一つです。"
    });
}
fs.writeFileSync(kantoFile, JSON.stringify(ktData, null, 4), 'utf-8');

// Chubu (Mie)
let cbData = JSON.parse(fs.readFileSync(chubuFile, 'utf-8'));
if (!updateTournament(cbData.facilities, "サオリーナ", "APP JAPAN SKECHERS Open")) {
    // 日硝アリーナ (サオリーナ)
    cbData.facilities.push({
        "name": "津市産業・スポーツセンター（サオリーナ / 日硝アリーナ）",
        "prefecture": "三重県",
        "address": "三重県津市北河路町19番地1",
        "type_flag": 1,
        "operator_type": "自治体",
        "hosts_tournaments": true,
        "tournament_types": "APP JAPAN SKECHERS Open 2026",
        "notes": "超大型公式大会「APP JAPAN SKECHERS Open 2026」の舞台となったアリーナ。日本におけるピックルボールの聖地の一つ。"
    });
}
fs.writeFileSync(chubuFile, JSON.stringify(cbData, null, 4), 'utf-8');

// Chugoku (Yamaguchi)
let cgData = JSON.parse(fs.readFileSync(chugokuFile, 'utf-8'));
updateTournament(cgData.facilities, "維新大晃アリーナ", "PJF ピックルボール ジャパン オープン in 山口 2026");
fs.writeFileSync(chugokuFile, JSON.stringify(cgData, null, 4), 'utf-8');

// Kyushu (Fukuoka)
let kyuData = JSON.parse(fs.readFileSync(kyushuFile, 'utf-8'));
if (!updateTournament(kyuData.facilities, "粕屋町総合体育館", "全農エネルギー福岡オープン2026")) {
    kyuData.facilities.push({
        "name": "粕屋町総合体育館（かすやドーム）",
        "prefecture": "福岡県",
        "address": "福岡県糟屋郡粕屋町駕与丁3丁目2-1",
        "type_flag": 1,
        "operator_type": "自治体",
        "hosts_tournaments": true,
        "tournament_types": "全農エネルギー福岡オープン2026",
        "notes": "「全農エネルギー福岡オープン2026」の会場となった九州地方における公式戦の拠点アリーナです。"
    });
}
if (!updateTournament(kyuData.facilities, "糸島市運動公園", "PICKLEBALL FUKUOKA OPEN 2026 ITOSHIMA")) {
    kyuData.facilities.push({
        "name": "糸島市運動公園 体育館",
        "prefecture": "福岡県",
        "address": "福岡県糸島市蔵持686-1",
        "type_flag": 1,
        "operator_type": "自治体",
        "hosts_tournaments": true,
        "tournament_types": "PICKLEBALL FUKUOKA OPEN 2026 ITOSHIMA",
        "notes": "PICKLEBALL FUKUOKA OPEN 2026 ITOSHIMAの舞台。"
    });
}
fs.writeFileSync(kyushuFile, JSON.stringify(kyuData, null, 4), 'utf-8');

console.log("Successfully tagged Official Tournament Sacred Places in regional JSON files.");
