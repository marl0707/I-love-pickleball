import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const files = {
    tohoku: path.join(dir, 'hokkaido_tohoku.json'),
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

function addFacs(data, facList) {
    if (!data.facilities) data.facilities = [];
    let added = 0;
    for (const facObj of facList) {
        if (!data.facilities.find(f => f.name.includes(facObj.name))) {
            if (!facObj.facility_amenities) facObj.facility_amenities = {};
            if (facObj.facility_amenities.has_parking === undefined) facObj.facility_amenities.has_parking = 1;
            data.facilities.push(facObj);
            added++;
        }
    }
    return added;
}

const tohokuFacilities = [
    { name: "ルスツリゾート", prefecture: "北海道", address: "北海道虻田郡留寿都村", type_flag: 3, operator_type: "民間", facility_amenities: { is_indoor: false, paddle_rental: true }, notes: "PJF公認の屋外専用ピックルボールコートが8面あるリゾート施設。" },
    { name: "PLACE OF SPORTS NEO", prefecture: "北海道", address: "北海道札幌市白石区", type_flag: 1, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, notes: "ボール、ネット、ラインマーカー無料貸出。屋内スポーツ施設。" },
    { name: "セントラルスポーツ・ピックルボールクラブ 札幌", prefecture: "北海道", address: "北海道札幌市中央区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "スポーツクラブNAS 札幌", prefecture: "北海道", address: "北海道札幌市中央区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true } },
    { name: "ライジングテニスクラブ 北野校", prefecture: "北海道", address: "北海道札幌市清田区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "北ガスアリーナ札幌46", prefecture: "北海道", address: "北海道札幌市中央区", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true, paddle_rental: false }, notes: "バドミントンコートの空き枠で利用可能な場合あり。" }
];

const chushikokuFacilities = [
    { name: "NBテニスガーデン", prefecture: "広島県", address: "広島県広島市西区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: false, paddle_rental: true }, notes: "屋外テニスコートに専用ラインとネットを設置・レンタル提供。" },
    { name: "IHIアリーナ呉（呉市体育館）", prefecture: "広島県", address: "広島県呉市", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "二葉公民館", prefecture: "広島県", address: "広島県広島市東区", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "倉敷体育館", prefecture: "岡山県", address: "岡山県倉敷市", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "倉敷運動公園 ウエイトリフティング場", prefecture: "岡山県", address: "岡山県倉敷市", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "水島体育館", prefecture: "岡山県", address: "岡山県倉敷市", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "玉島の森", prefecture: "岡山県", address: "岡山県倉敷市", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } }
];

const kyushuFacilities = [
    { name: "ピヴォーレ福岡", prefecture: "福岡県", address: "福岡県福岡市東区", type_flag: 3, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, notes: "4面の屋内ピックルボールコートを持つ専用スポーツ施設。" },
    { name: "スポーツクラブNAS 六本松", prefecture: "福岡県", address: "福岡県福岡市", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true } },
    { name: "セントラルスポーツ・ピックルボールクラブ 福岡", prefecture: "福岡県", address: "福岡県福岡市中央区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true } },
    { name: "田川テニスクラブ", prefecture: "福岡県", address: "福岡県田川郡香春町", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: false, paddle_rental: true } },
    { name: "福岡市民体育館", prefecture: "福岡県", address: "福岡県福岡市博多区", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "飯塚市総合体育館", prefecture: "福岡県", address: "福岡県飯塚市", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "ピックルボールくまもと", prefecture: "熊本県", address: "熊本県宇城市", type_flag: 3, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, notes: "喫茶店を併設した専用ピックルボールコートレンタル施設。" },
    { name: "COSMOS 熊本県フットボールセンター", prefecture: "熊本県", address: "熊本県上益城郡", type_flag: 1, operator_type: "民間", facility_amenities: { is_indoor: false, paddle_rental: true }, notes: "2面の専用ピックルボールコートが屋外に設置されている。" },
    { name: "テニスDIVO熊本", prefecture: "熊本県", address: "熊本県熊本市北区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "サングリーンテニススクール", prefecture: "鹿児島県", address: "鹿児島県鹿児島市", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true }
];

let totalAdded = 0;

let tohokuData = readJson(files.tohoku);
if (tohokuData) {
    let count = addFacs(tohokuData, tohokuFacilities);
    totalAdded += count;
    writeJson(files.tohoku, tohokuData);
    console.log(`Hokkaido/Tohoku: Added ${count} new facilities.`);
}

let chushikokuData = readJson(files.chushikoku);
if (chushikokuData) {
    let count = addFacs(chushikokuData, chushikokuFacilities);
    totalAdded += count;
    writeJson(files.chushikoku, chushikokuData);
    console.log(`Chushikoku: Added ${count} new facilities.`);
}

let kyushuData = readJson(files.kyushu);
if (kyushuData) {
    let count = addFacs(kyushuData, kyushuFacilities);
    totalAdded += count;
    writeJson(files.kyushu, kyushuData);
    console.log(`Kyushu/Okinawa: Added ${count} new facilities.`);
}

console.log(`Mega Expansion Phase 9 (Sub) Complete! Massively injected ${totalAdded} facilities into the regional databases.`);
