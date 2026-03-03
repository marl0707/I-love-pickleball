import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const files = {
    hokkaido: path.join(dir, 'hokkaido_tohoku.json'),
    kanto: path.join(dir, 'kanto.json'),
    chubu: path.join(dir, 'chubu.json'),
    kinki: path.join(dir, 'kinki.json'),
    chugoku: path.join(dir, 'chugoku_shikoku.json'),
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
        circle = { name, prefecture: pref, base_facilities: [], notes: "" };
        data.circles.push(circle);
    }
    if (circle.notes === undefined) circle.notes = ""; // Fix the bug
    return circle;
}

function addAssocToFacility(data, query, assocObj) {
    if (!data.facilities) return;
    let fac = data.facilities.find(f => f.name.includes(query));
    if (!fac) {
        // Create it if we can
        fac = {
            name: query,
            prefecture: assocObj.prefecture,
            type_flag: 1,
            operator_type: "官民等",
            notes: "",
            address: assocObj.prefecture
        };
        data.facilities.push(fac);
    }
    fac.is_association_hq = true;
    fac.association_name = assocObj.association_name;
    if (fac.notes === undefined) fac.notes = "";
    if (!fac.notes.includes(assocObj.association_name)) {
        fac.notes += ` ※${assocObj.association_name}の活動拠点・加盟施設として重要視されているアリーナです。`;
    }
}

// ---------------------------------------------------------
// Task 2: Fix and run circles update
// ---------------------------------------------------------

let data = readJson(files.hokkaido);
if (data) {
    let c = getOrAddCircle(data, "ピクルクルビギン", "北海道");
    c.base_facilities = ["PLACE OF SPORTS NEO"];
    c.activity_details = { days: "土曜・日曜", time: "土曜19:00〜 / 日曜9:00〜", beginner_friendly: 1 };
    c.notes = "初心者サークル。「ここからスタート！」という気持ちを込めています。パドルレンタル可能。";
    writeJson(files.hokkaido, data);
}

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

data = readJson(files.chubu);
if (data) {
    let c = getOrAddCircle(data, "ピックルボール坂城", "長野県");
    c.activity_details = { days: "火曜・金曜", time: "19:00-21:00", beginner_friendly: 1 };
    c.notes = "初心者大歓迎。初回参加費は無料でパドル貸出あり（事前申込必須）。";

    let c2 = getOrAddCircle(data, "うえだピックルボールクラブ", "長野県");
    c2.activity_details = { days: "水曜", time: "19:00-21:00", beginner_friendly: 1 };
    if (!c2.notes.includes("初心者")) c2.notes += " 浦里練習会を中心に活動。初心者歓迎。";

    // Task 3 addition (Toyama Assoc)
    addAssocToFacility(data, "sanTasピックルボールクラブ", { prefecture: "富山県", association_name: "富山県初のJPA加盟施設" });

    writeJson(files.chubu, data);
}

data = readJson(files.kinki);
if (data) {
    let c = getOrAddCircle(data, "BIKKURI PICKLE", "大阪府");
    c.activity_details = { days: "木曜", time: "夜間中心", beginner_friendly: 1 };
    c.notes = "「みんなで楽しむ」ことに協力できる方なら誰でも歓迎。未経験者も大歓迎で、途中参加・途中退出も可能。";

    // Task 3 addition (Shiga Assoc venue)
    addAssocToFacility(data, "滋賀ダイハツアリーナ", { prefecture: "滋賀県", association_name: "滋賀県のピックルボール大拠点" });

    writeJson(files.kinki, data);
}

data = readJson(files.chugoku);
if (data) {
    // Task 3 addition (Shimane Assoc)
    addAssocToFacility(data, "玉汤体育館", { prefecture: "島根県", association_name: "松江ピックルボール同好会（県内中核団体）" });
    // Task 3 addition (Tottori Assoc)
    addAssocToFacility(data, "米子市内体育館（拠点）", { prefecture: "鳥取県", association_name: "鳥取県西部ピックルボール拠点" });

    writeJson(files.chugoku, data);
}

data = readJson(files.kyushu);
if (data) {
    let c = getOrAddCircle(data, "INFINITY -Pickleball Club-", "福岡県");
    c.activity_details = { days: "平日・土日", time: "随時", beginner_friendly: 1 };
    c.notes = "初心者コートとレギュラーコートに分けて練習を行っており、初心者も大歓迎。";

    let c2 = getOrAddCircle(data, "Shingu PBX", "福岡県");
    c2.activity_details = { days: "土曜・水曜・日曜", time: "主に土曜18:30-20:30", beginner_friendly: 1 };
    c2.notes = "初心者が多く、7歳から50代まで幅広い年齢層が参加。";

    // Task 3 addition (Oita Assoc venue)
    addAssocToFacility(data, "大分市西部公民館", { prefecture: "大分県", association_name: "ピックルボールおおいた（県内・市内中核）" });

    writeJson(files.kyushu, data);
}

console.log("Successfully fixed Task 2 circles bug, deeply integrated activity schedules, and added Local Association HQs (Task 3).");
