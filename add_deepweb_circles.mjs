import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';

// --- 北海道・東北 ---
const hokkaidoFile = path.join(dir, 'hokkaido_tohoku.json');
let hokkaidoData = JSON.parse(fs.readFileSync(hokkaidoFile, 'utf-8'));
hokkaidoData.circles.push({
    "name": "ピックルクルNEO札幌",
    "prefecture": "北海道",
    "location": "札幌市内",
    "schedule": "週末中心",
    "description": "初心者サークルも新設されている、ピックルボールを通じて仲間と楽しむ場を提供するサークル",
    "url": "https://neo-spo.com",
    "beginner_friendly": true,
    "play_style": "エンジョイ（レクリエーション）",
    "activity_frequency": "週1回以上"
});
hokkaidoData.circles.push({
    "name": "札幌ピックルズ",
    "prefecture": "北海道",
    "location": "札幌市内",
    "schedule": "不定期",
    "description": "ラケット競技経験者を中心に募集し活動しているクラブ",
    "url": "https://randaall.com",
    "beginner_friendly": false,
    "play_style": "競技志向・大会向け",
    "activity_frequency": "月2回程度"
});
fs.writeFileSync(hokkaidoFile, JSON.stringify(hokkaidoData, null, 4), 'utf-8');

// --- 関東 ---
const kantoFile = path.join(dir, 'kanto.json');
let kantoData = JSON.parse(fs.readFileSync(kantoFile, 'utf-8'));
kantoData.circles.push({
    "name": "きたざわピックル",
    "prefecture": "東京都",
    "location": "世田谷区",
    "schedule": "不定期",
    "description": "世田谷区を中心に活動するピックルボールサークル",
    "url": "https://pickleball-portal.jp",
    "beginner_friendly": true,
    "play_style": "エンジョイ〜競技志向混合",
    "activity_frequency": "月2回程度"
});
kantoData.circles.push({
    "name": "WELL PICKLE CLUB",
    "prefecture": "東京都",
    "location": "葛飾区",
    "schedule": "定期開催",
    "description": "葛飾区に専用コートを持ち、交流会やゲーム大会を積極的に開催",
    "url": "https://well-k.jp",
    "beginner_friendly": true,
    "play_style": "エンジョイ〜競技志向混合",
    "activity_frequency": "週1回以上"
});
kantoData.circles.push({
    "name": "Tegapicks（テガピックス）",
    "prefecture": "千葉県",
    "location": "我孫子市",
    "schedule": "定期",
    "description": "我孫子市で活動するピックルボールクラブ",
    "url": "https://pickleball-chiba.com",
    "beginner_friendly": true,
    "play_style": "エンジョイ（レクリエーション）",
    "activity_frequency": "月2回程度"
});
fs.writeFileSync(kantoFile, JSON.stringify(kantoData, null, 4), 'utf-8');

// --- 中部 ---
const chubuFile = path.join(dir, 'chubu.json');
let chubuData = JSON.parse(fs.readFileSync(chubuFile, 'utf-8'));
chubuData.circles.push({
    "name": "名西ピックルズ",
    "prefecture": "愛知県",
    "location": "名古屋市西区",
    "schedule": "不定期",
    "description": "テニス経験者が中心となって活動しているサークル",
    "url": "https://tennisbear.net",
    "beginner_friendly": true,
    "play_style": "競技志向・大会向け",
    "activity_frequency": "週1回以上"
});
fs.writeFileSync(chubuFile, JSON.stringify(chubuData, null, 4), 'utf-8');

// --- 九州・沖縄 ---
const kyushuFile = path.join(dir, 'kyushu_okinawa.json');
let kyushuData = JSON.parse(fs.readFileSync(kyushuFile, 'utf-8'));
kyushuData.circles.push({
    "name": "福岡ピックルボールクラブ（通称ふくぴ）",
    "prefecture": "福岡県",
    "location": "福岡市内",
    "schedule": "週1〜2回",
    "description": "福岡市内の体育館や公園施設で週1〜2回の定期練習やイベントを開催",
    "url": "https://play-pickleball.jp",
    "beginner_friendly": true,
    "play_style": "エンジョイ〜競技志向混合",
    "activity_frequency": "週1回以上"
});
kyushuData.circles.push({
    "name": "筥松ピックルボールクラブ（通称：はこぴ）",
    "prefecture": "福岡県",
    "location": "福岡市東区",
    "schedule": "不定期",
    "description": "箱崎・筥松エリアを拠点とするクラブ。初心者も歓迎",
    "url": "https://pickle-one.com",
    "beginner_friendly": true,
    "play_style": "エンジョイ（レクリエーション）",
    "activity_frequency": "月2回程度"
});
fs.writeFileSync(kyushuFile, JSON.stringify(kyushuData, null, 4), 'utf-8');

console.log("Deep Web Grassroots Circles Injection Complete.");
