import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const files = {
    hokkaido: path.join(dir, 'hokkaido_tohoku.json'),
    kanto: path.join(dir, 'kanto.json'),
    chubu: path.join(dir, 'chubu.json'),
    kinki: path.join(dir, 'kinki.json'),
    kyushu: path.join(dir, 'kyushu_okinawa.json')
};

function readJson(file) {
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function writeJson(file, data) {
    data.last_updated = new Date().toISOString().split('T')[0];
    fs.writeFileSync(file, JSON.stringify(data, null, 4), 'utf-8');
}

function getOrAddCircle(data, name, pref) {
    if (!data.circles) data.circles = [];
    let circle = data.circles.find(c => c.name.includes(name));
    if (!circle) {
        circle = { name, prefecture: pref, base_facilities: [] };
        data.circles.push(circle);
    }
    return circle;
}

// Hokkaido
let data = readJson(files.hokkaido);
if (data) {
    let c = getOrAddCircle(data, "ピクルクルビギン", "北海道");
    c.base_facilities = ["PLACE OF SPORTS NEO"];
    c.activity_details = { days: "土曜・日曜", time: "土曜19:00〜 / 日曜9:00〜", beginner_friendly: 1 };
    c.notes = "ピックルボールを始めたい方や始めたばかりの方を対象とした初心者サークル。「ここからスタート！」という気持ちを込めています。パドルレンタル可能。";
    writeJson(files.hokkaido, data);
}

// Kanto
data = readJson(files.kanto);
if (data) {
    let c = getOrAddCircle(data, "FPC ふじみ野ピックルボールクラブ", "埼玉県");
    c.activity_details = { days: "土日中心", time: "09:00-11:00 または 18:00-20:00", beginner_friendly: 1 };
    c.notes = "初心者から小学生以上まで参加できるアットホームなクラブ。";

    let c2 = getOrAddCircle(data, "西湘ピックルボール倶楽部", "神奈川県");
    c2.activity_details = { days: "平日・土日祝", time: "朝昼夕", beginner_friendly: 1 };
    c2.notes = "幅広く活動中。初心者、経験者問わず歓迎。";

    writeJson(files.kanto, data);
}

// Chubu
data = readJson(files.chubu);
if (data) {
    let c = getOrAddCircle(data, "ピックルボール坂城", "長野県");
    c.activity_details = { days: "火曜・金曜", time: "19:00-21:00", beginner_friendly: 1 };
    c.notes = "初心者大歓迎。初回参加費は無料でパドル貸出あり（事前申込必須）。";

    let c2 = getOrAddCircle(data, "うえだピックルボールクラブ", "長野県");
    c2.activity_details = { days: "水曜", time: "19:00-21:00", beginner_friendly: 1 };
    if (!c2.notes.includes("初心者")) c2.notes += " 浦里練習会を中心に活動。初心者歓迎。";

    writeJson(files.chubu, data);
}

// Kinki
data = readJson(files.kinki);
if (data) {
    let c = getOrAddCircle(data, "BIKKURI PICKLE", "大阪府");
    c.activity_details = { days: "木曜", time: "夜間中心", beginner_friendly: 1 };
    c.notes = "「みんなで楽しむ」ことに協力できる方なら誰でも歓迎。未経験者も大歓迎で、途中参加・途中退出も可能。";
    writeJson(files.kinki, data);
}

// Kyushu
data = readJson(files.kyushu);
if (data) {
    let c = getOrAddCircle(data, "INFINITY -Pickleball Club-", "福岡県");
    c.activity_details = { days: "平日・土日", time: "随時", beginner_friendly: 1 };
    c.notes = "初心者コートとレギュラーコートに分けて練習を行っており、初心者も大歓迎。参加費は2時間500円。";

    let c2 = getOrAddCircle(data, "Shingu PBX", "福岡県");
    c2.activity_details = { days: "土曜・水曜・日曜", time: "主に土曜18:30-20:30", beginner_friendly: 1 };
    c2.notes = "初心者が多く、7歳から50代まで幅広い年齢層が参加。";

    writeJson(files.kyushu, data);
}

console.log("Successfully added detailed activity days, times, and beginner_friendly flags to circles across Japan.");
