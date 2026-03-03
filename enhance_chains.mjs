import fs from 'fs';
import path from 'path';

const chainFile = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities\\chain_nationwide.json';

const raw = fs.readFileSync(chainFile, 'utf-8');
const data = JSON.parse(raw);

const existingChains = data.chains.map(c => c.chain_name);

const newChains = [
    {
        "chain_name": "テニスラウンジ",
        "type": "テニススクール",
        "operator_type": "民間",
        "has_paddle_rental": 1,
        "note": "日本最大級のテニススクール。一部店舗（名西、ウェルネススクエア新栄など）でピックルボールコートのレンタルやスクールを実施。パドル・ボールレンタルあり。",
        "branches": [
            { "name": "テニスラウンジ名西", "prefecture": "愛知県", "city": "名古屋市西区" },
            { "name": "ウェルネススクエア新栄 (テニスラウンジ)", "prefecture": "愛知県", "city": "名古屋市中区" }
        ]
    },
    {
        "chain_name": "VIP・TOPインドアテニススクール",
        "type": "テニススクール",
        "operator_type": "民間",
        "has_paddle_rental": 1,
        "note": "VIPインドアピックルボールクラブとして展開。冷房完備の快適なインドアコート。パドルレンタルあり。",
        "branches": [
            { "name": "VIPインドアピックルボールクラブ (東陽町)", "prefecture": "東京都", "city": "江東区" },
            { "name": "TOPインドアステージ横浜コットンハーバー", "prefecture": "神奈川県", "city": "横浜市神奈川区" }
        ]
    },
    {
        "chain_name": "テニススクール・ノア (Noah)",
        "type": "テニススクール",
        "operator_type": "民間",
        "has_paddle_rental": 1,
        "note": "室内コートでピックルボールの初心者向けレッスンを提供。",
        "branches": [
            { "name": "テニススクール・ノア 京都洛西校", "prefecture": "京都府", "city": "京都市" },
            { "name": "テニススクール・ノア センター南校", "prefecture": "神奈川県", "city": "横浜市都筑区" }
        ]
    },
    {
        "chain_name": "ITCテニススクール",
        "type": "テニススクール",
        "operator_type": "民間",
        "has_paddle_rental": 1,
        "note": "DIADEM PICKLEBALL KOBEなど、専門施設をオープン。",
        "branches": [
            { "name": "ITC神戸インドアテニススクール (DIADEM PICKLEBALL KOBE)", "prefecture": "兵庫県", "city": "神戸市長田区" }
        ]
    },
    {
        "chain_name": "レックインドアテニススクール (REC)",
        "type": "テニススクール",
        "operator_type": "民間",
        "has_paddle_rental": 1,
        "note": "RECピックルボールスクールを開講。",
        "branches": [
            { "name": "レックインドアテニススクール西東京", "prefecture": "東京都", "city": "西東京市" }
        ]
    }
];

for (const nc of newChains) {
    if (!existingChains.includes(nc.chain_name)) {
        data.chains.push(nc);
    }
}

// Ensure all branches have an address property (even if empty initially) and a valid google_maps_url
for (const c of data.chains) {
    for (const b of c.branches) {
        if (!b.address) {
            b.address = b.prefecture + (b.city || "");
        }
        if (!b.google_maps_url) {
            b.google_maps_url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.name)}`;
        }
    }
}

data.last_updated = new Date().toISOString().split('T')[0];
fs.writeFileSync(chainFile, JSON.stringify(data, null, 4), 'utf-8');

console.log("Successfully enhanced chain_nationwide.json with new tennis school chains and baseline properties.");
