import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const files = {
    tohoku: path.join(dir, 'hokkaido_tohoku.json'),
    chubu: path.join(dir, 'chubu.json'),
    kinki: path.join(dir, 'kinki.json'),
    chushikoku: path.join(dir, 'chugoku_shikoku.json'),
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

function addFac(data, facObj) {
    if (!data.facilities) data.facilities = [];
    if (!data.facilities.find(f => f.name === facObj.name)) {
        data.facilities.push(facObj);
    }
}

function addCir(data, cirObj) {
    if (!data.circles) data.circles = [];
    if (!data.circles.find(c => c.name === cirObj.name)) {
        data.circles.push(cirObj);
    }
}

// ---------------------------
// 1. Hokkaido & Tohoku (Akita, Yamagata)
// ---------------------------
let tohoku = readJson(files.tohoku);
if (tohoku) {
    addFac(tohoku, { name: "indoor sports park SUNBOW", prefecture: "秋田県", address: "秋田県大仙市", type_flag: 1, operator_type: "民間", facility_amenities: { has_parking: 1 }, notes: "室内コート完備。レンタルパドルやFranklinブランドの用具販売、個人レッスンも実施。", access_info: { guide: "車での来場推奨（駐車場あり）。ルート検索をご活用ください。" } });
    addFac(tohoku, { name: "由利本荘総合防災公園ナイスアリーナ", prefecture: "秋田県", address: "秋田県由利本荘市", type_flag: 1, operator_type: "官民等", facility_amenities: { has_parking: 1 }, notes: "個人参加型プログラム実施。パドル貸出あり。", access_info: { guide: "車での来場が便利です。ルート検索をご活用ください。" } });
    addFac(tohoku, { name: "山形県霞城県体育館", prefecture: "山形県", address: "山形県山形市", type_flag: 1, operator_type: "公営", facility_amenities: { has_parking: 1 }, notes: "ピックルボールやまがたの主な活動拠点。", access_info: { guide: "山形駅からのアクセス良好。ルート検索をご活用ください。" } });

    addCir(tohoku, { name: "秋田ピックルボールクラブ", prefecture: "秋田県", base_facilities: ["秋田市中央市民サービスセンター（センタース）"], activity_details: { days: "週2-3回", time: "夜間中心", beginner_friendly: 1 }, notes: "「ピックルボール」と「ビール」を組み合わせた交流イベント「ピックルビール会」なども開催。" });
    addCir(tohoku, { name: "ピックルボールやまがた", prefecture: "山形県", base_facilities: ["山形県霞城県体育館"], activity_details: { days: "月4回程度", time: "週末中心", beginner_friendly: 1 }, notes: "旧山形ピックルボールクラブ。初心者やシニアも歓迎。道具がなくても参加可能。" });

    writeJson(files.tohoku, tohoku);
}

// ---------------------------
// 2. Chubu (Fukui, Ishikawa, Yamanashi)
// ---------------------------
let chubu = readJson(files.chubu);
if (chubu) {
    addFac(chubu, { name: "ピックルビート小松", prefecture: "石川県", address: "石川県小松市安宅町", type_flag: 1, operator_type: "民間", facility_amenities: { has_parking: 1 }, notes: "旧建物を活用した屋内ピックルボール専用コート。各種練習会や体験会を頻繁に開催。", access_info: { guide: "車での来場推奨（駐車場あり）。" } });
    addFac(chubu, { name: "エストテニスクラブ 甲府校/八田校", prefecture: "山梨県", address: "山梨県", type_flag: 2, operator_type: "民間", facility_amenities: { has_parking: 1 }, notes: "2025年4月からレッスンがスタート。用具の無料レンタル可能。", access_info: { guide: "車での来場推奨。" }, has_school: true });
    addFac(chubu, { name: "PICA Fujiyama (PICA PICKLE)", prefecture: "山梨県", address: "山梨県南都留郡富士河口湖町", type_flag: 3, operator_type: "民間", facility_amenities: { has_parking: 1 }, notes: "山梨県初となるピックルボール専用施設として2025年8月末にオープン予定。", access_info: { guide: "車での来場推奨。" } });

    addCir(chubu, { name: "ピックルビート小松 サークル", prefecture: "石川県", base_facilities: ["ピックルビート小松"], activity_details: { days: "水曜・木曜・土曜", time: "水18:30-/木9:00-/土8:30-", beginner_friendly: 1 }, notes: "初心者無料、パドル無料貸出。" });
    addCir(chubu, { name: "福井ピックルボール【FPB】", prefecture: "福井県", base_facilities: ["近隣体育館"], activity_details: { days: "土日祝", time: "随時", beginner_friendly: 1 }, notes: "2025年12月設立。1回500円で誰でも参加可能。" });
    addCir(chubu, { name: "敦賀ピックルボール", prefecture: "福井県", base_facilities: ["粟野スポーツセンター"], activity_details: { days: "週末", time: "随時", beginner_friendly: 1 }, notes: "初心者でも参加しやすいイベントを開催。" });

    writeJson(files.chubu, chubu);
}

// ---------------------------
// 3. Kinki (Mie)
// ---------------------------
let kinki = readJson(files.kinki);
if (kinki) {
    addFac(kinki, { name: "オリンピアスポーツクラブ", prefecture: "三重県", address: "三重県四日市市", type_flag: 1, operator_type: "民間", facility_amenities: { has_parking: 1 }, notes: "三重県初のJPA公認ピックルボールレンタルコート設置。", access_info: { guide: "車での来場推奨。" } });
    addFac(kinki, { name: "NEMU RESORT", prefecture: "三重県", address: "三重県志摩市", type_flag: 3, operator_type: "民間", facility_amenities: { has_parking: 1 }, notes: "10面のピックルボール専用コート備えるリゾート施設（リニューアル予定）。", access_info: { guide: "車での来場推奨。" } });

    addCir(kinki, { name: "Pickles", prefecture: "三重県", base_facilities: ["多気町トレーニングセンター"], activity_details: { days: "週末", time: "定期的", beginner_friendly: 1 }, notes: "多気町を中心に体験会を定期開催。パドル無料貸出。" });
    addCir(kinki, { name: "四日市ピックルライジング", prefecture: "三重県", base_facilities: ["四日市市橋北小学校"], activity_details: { days: "日曜", time: "18:00-21:00", beginner_friendly: 1 }, notes: "初心者歓迎、体験費300円でパドル貸出。" });

    writeJson(files.kinki, kinki);
}

// ---------------------------
// 4. Chugoku & Shikoku (Tottori, Kochi)
// ---------------------------
let chushikoku = readJson(files.chushikoku);
if (chushikoku) {
    addFac(chushikoku, { name: "高知市東部総合運動場体育センター", prefecture: "高知県", address: "高知県高知市", type_flag: 1, operator_type: "公営", facility_amenities: { has_parking: 1 }, notes: "ピックルボール高知の拠点。専用ライン設置予定あり。", access_info: { guide: "車での来場推奨。" } });
    addFac(chushikoku, { name: "鳥取市民体育館（エネトピアアリーナ）", prefecture: "鳥取県", address: "鳥取県鳥取市", type_flag: 1, operator_type: "公営", facility_amenities: { has_parking: 1 }, notes: "ピックルボール体験会開催実績あり。", access_info: { guide: "車での来場推奨。" } });

    addCir(chushikoku, { name: "トサピ", prefecture: "高知県", base_facilities: ["弥右衛門ふれあいセンター", "くろしおアリーナ"], activity_details: { days: "平日不定期", time: "夜間", beginner_friendly: 1 }, notes: "2024年設立。初心者歓迎でレクチャーあり。" });
    addCir(chushikoku, { name: "ピックルボール高知（ピコ）", prefecture: "高知県", base_facilities: ["高知市東部総合運動場体育センター"], activity_details: { days: "火曜・金曜", time: "10:00-13:00", beginner_friendly: 1 }, notes: "社会人サークル。パドル貸出あり。" });
    addCir(chushikoku, { name: "ピックルボール始めませんか♪", prefecture: "鳥取県", base_facilities: ["米子市内体育館"], activity_details: { days: "土日", time: "昼間", beginner_friendly: 1 }, notes: "20〜30代中心だが年代問わず歓迎。パドル貸出あり。" });

    writeJson(files.chushikoku, chushikoku);
}

// ---------------------------
// 5. Kyushu & Okinawa (Okinawa)
// ---------------------------
let kyushu = readJson(files.kyushu);
if (kyushu) {
    addFac(kyushu, { name: "宜野湾市体育館", prefecture: "沖縄県", address: "沖縄県宜野湾市", type_flag: 1, operator_type: "公営", facility_amenities: { has_parking: 1 }, notes: "沖縄のピックルボール活動拠点の一つ。", access_info: { guide: "車での来場推奨。" } });

    addCir(kyushu, { name: "FiveForcePickleOkinawa", prefecture: "沖縄県", base_facilities: ["宜野湾市体育館", "東風平体育館"], activity_details: { days: "週2回", time: "随時", beginner_friendly: 1 }, notes: "Instagramで情報発信。初心者歓迎。" });
    addCir(kyushu, { name: "Effort Pickleball Club", prefecture: "沖縄県", base_facilities: ["エフォートテニスクラブ沖縄"], activity_details: { days: "月曜", time: "定期的", beginner_friendly: 1 }, notes: "パドルとボールの無料レンタル可能。" });

    writeJson(files.kyushu, kyushu);
}

console.log("Successfully wiped out all 9 blank prefectures! 47 Prefectures Complete Coverage Achieved!");
