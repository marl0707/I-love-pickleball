import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const files = {
    kanto: path.join(dir, 'kanto.json'),
    kinki: path.join(dir, 'kinki.json'),
    chubu: path.join(dir, 'chubu.json')
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
            // ensure facility_amenities exists
            if (!facObj.facility_amenities) facObj.facility_amenities = {};
            // default to having parking if not specified
            if (facObj.facility_amenities.has_parking === undefined) facObj.facility_amenities.has_parking = 1;
            data.facilities.push(facObj);
            added++;
        }
    }
    return added;
}

const kantoFacilities = [
    { name: "VIPインドアピックルボールクラブ", prefecture: "東京都", address: "東京都江東区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true, notes: "テニススクールからピックルボールクラスを新設。インドアで快適。" },
    { name: "東京体育館 フィットネスエリアスタジオ", prefecture: "東京都", address: "東京都渋谷区千駄ヶ谷", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true, notes: "フィットネスエリアにて本科スクール開催。" },
    { name: "ウェルラケットクラブ", prefecture: "東京都", address: "東京都葛飾区", type_flag: 2, operator_type: "民間", facility_amenities: { paddle_rental: true }, has_school: true, notes: "ピックルボールの練習会やスペシャルレッスンを開催。" },
    { name: "トップインドアステージ多摩", prefecture: "東京都", address: "東京都八王子市", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "桐ヶ丘体育館", prefecture: "東京都", address: "東京都北区", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true, paddle_rental: false }, notes: "北区のピックルボール愛好者が利用する体育館。" },
    { name: "千代田区立スポーツセンター", prefecture: "東京都", address: "東京都千代田区", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true }, notes: "ピックルボール体験教室などを開催。" },
    { name: "渋谷区スポーツセンター", prefecture: "東京都", address: "東京都渋谷区", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true }, has_school: true },
    { name: "世田谷区総合運動場体育館", prefecture: "東京都", address: "東京都世田谷区", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "烏山総合体育館", prefecture: "東京都", address: "東京都世田谷区", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "セントラルスポーツ 東十条店", prefecture: "東京都", address: "東京都北区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true } },
    { name: "KPI PARK", prefecture: "神奈川県", address: "神奈川県横浜市戸塚区", type_flag: 1, operator_type: "民間", facility_amenities: { is_indoor: false, paddle_rental: true }, notes: "ハードコートのレンタルあり。" },
    { name: "セサミテニススクール大船", prefecture: "神奈川県", address: "神奈川県横浜市栄区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "GODAIセンター南", prefecture: "神奈川県", address: "神奈川県横浜市都筑区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "テニス＆バドミントンスクール・ノア 川崎宮前平校", prefecture: "神奈川県", address: "神奈川県川崎市宮前区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "テニススクール・ノア 横浜東戸塚校", prefecture: "神奈川県", address: "神奈川県横浜市戸塚区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "Dテニススクール D-tennis-古淵駅前校", prefecture: "神奈川県", address: "神奈川県相模原市南区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "ティップネス川崎", prefecture: "神奈川県", address: "神奈川県川崎市川崎区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true } },
    { name: "レイムテニスセンター", prefecture: "埼玉県", address: "埼玉県川口市", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "戸塚スポーツセンター", prefecture: "埼玉県", address: "埼玉県川口市", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "コナミスポーツ テニススクール大宮", prefecture: "埼玉県", address: "埼玉県さいたま市", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "さいたま市与野体育館", prefecture: "埼玉県", address: "埼玉県さいたま市", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "テニス＆バドミントンスクール・ノア 和光成増校", prefecture: "埼玉県", address: "埼玉県和光市", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "埼玉県所沢市民体育館", prefecture: "埼玉県", address: "埼玉県所沢市", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "吉田記念テニス研修センター（TTC）", prefecture: "千葉県", address: "千葉県柏市", type_flag: 1, operator_type: "民間", facility_amenities: { is_indoor: false, paddle_rental: true } },
    { name: "アルドールテニスステージ 千葉NT校", prefecture: "千葉県", address: "千葉県印西市", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "SYSテニスクラブ・アカデミー松戸", prefecture: "千葉県", address: "千葉県松戸市", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: false, paddle_rental: true } }
];

const kinkiFacilities = [
    { name: "南港中央庭球場", prefecture: "大阪府", address: "大阪府大阪市住之江区", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: false, paddle_rental: false }, notes: "ピックルボール専用コートが4面ありリーズナブル。" },
    { name: "住吉スポーツセンター", prefecture: "大阪府", address: "大阪府大阪市住吉区", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "東淀川体育館", prefecture: "大阪府", address: "大阪府大阪市東淀川区", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "江坂テニスセンター", prefecture: "大阪府", address: "大阪府吹田市", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "福島スポーツセンター", prefecture: "大阪府", address: "大阪府大阪市福島区", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "セントラルウェルネスクラブ都島", prefecture: "大阪府", address: "大阪府大阪市都島区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true } },
    { name: "河内庭球倶楽部", prefecture: "大阪府", address: "大阪府八尾市", type_flag: 1, operator_type: "民間", facility_amenities: { paddle_rental: true } },
    { name: "テニスクラブ コ・ス・パ 神崎川", prefecture: "大阪府", address: "大阪府大阪市淀川区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "ラスティ高槻テニススクール", prefecture: "大阪府", address: "大阪府高槻市", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "テニス＆バドミントンスクール・ノア 大阪久宝寺校", prefecture: "大阪府", address: "大阪府八尾市", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "河内長野市立市民総合体育館", prefecture: "大阪府", address: "大阪府河内長野市", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "KTM河本工業総合体育館", prefecture: "大阪府", address: "大阪府枚方市", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "吹田市立山田市民体育館", prefecture: "大阪府", address: "大阪府吹田市", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "コープこうべ協同学苑テニススクール", prefecture: "兵庫県", address: "兵庫県三木市", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "テニススクール・ノア 宝塚伊丹校", prefecture: "兵庫県", address: "兵庫県宝塚市", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "DIADEM PICKLEBALL COMPLEX KOBE (DPC KOBE)", prefecture: "兵庫県", address: "兵庫県神戸市長田区", type_flag: 3, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, notes: "関西初の5面インドアピックルボール専用施設。" },
    { name: "ITC神戸インドアテニススクール", prefecture: "兵庫県", address: "兵庫県神戸市長田区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "テニス＆バドミントンスクール・ノア 西宮校", prefecture: "兵庫県", address: "兵庫県西宮市", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "北神戸田園スポーツ公園", prefecture: "兵庫県", address: "兵庫県神戸市北区", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } }
];

const chubuFacilities = [
    { name: "岡崎市体育館", prefecture: "愛知県", address: "愛知県岡崎市", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "テニス＆バドミントンスクール・ノア 名古屋瓢箪山校", prefecture: "愛知県", address: "愛知県名古屋市守山区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true }, has_school: true },
    { name: "諸の木テニス倶楽部", prefecture: "愛知県", address: "愛知県名古屋市緑区", type_flag: 1, operator_type: "民間", facility_amenities: { is_indoor: false, paddle_rental: true } },
    { name: "名古屋市千種スポーツセンター", prefecture: "愛知県", address: "愛知県名古屋市千種区", type_flag: 1, operator_type: "公営", facility_amenities: { is_indoor: true } },
    { name: "ティップネス上飯田", prefecture: "愛知県", address: "愛知県名古屋市北区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: true, paddle_rental: true } },
    { name: "Nagoya Pickleball Base", prefecture: "愛知県", address: "愛知県名古屋市", type_flag: 3, operator_type: "民間", facility_amenities: { paddle_rental: true } },
    { name: "テニスラウンジ ウェルネススクエア新栄校", prefecture: "愛知県", address: "愛知県名古屋市中区", type_flag: 2, operator_type: "民間", facility_amenities: { is_indoor: false, paddle_rental: true }, has_school: true }
];

let totalAdded = 0;

let kantoData = readJson(files.kanto);
if (kantoData) {
    let count = addFacs(kantoData, kantoFacilities);
    totalAdded += count;
    writeJson(files.kanto, kantoData);
    console.log(`Kanto: Added ${count} new facilities.`);
}

let kinkiData = readJson(files.kinki);
if (kinkiData) {
    let count = addFacs(kinkiData, kinkiFacilities);
    totalAdded += count;
    writeJson(files.kinki, kinkiData);
    console.log(`Kinki: Added ${count} new facilities.`);
}

let chubuData = readJson(files.chubu);
if (chubuData) {
    let count = addFacs(chubuData, chubuFacilities);
    totalAdded += count;
    writeJson(files.chubu, chubuData);
    console.log(`Chubu: Added ${count} new facilities.`);
}

console.log(`Mega Expansion Phase 9 Complete! Massively injected ${totalAdded} facilities into the database, adding 'is_indoor' and 'paddle_rental' coverage.`);
