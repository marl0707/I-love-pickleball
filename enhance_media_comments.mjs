import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const regions = [
    'hokkaido_tohoku.json', 'kanto.json', 'chubu.json',
    'kinki.json', 'chugoku_shikoku.json', 'kyushu_okinawa.json'
];

for (const region of regions) {
    const file = path.join(dir, region);
    if (!fs.existsSync(file)) continue;

    let data = JSON.parse(fs.readFileSync(file, 'utf-8'));

    // Add comments to root media info
    if (data.top_media_channels) {
        data.top_media_channels.forEach(ch => {
            if (ch.name.includes("船水")) {
                ch.comment = "熱狂的なファン必見！日本初のプロ選手の生のプレイやMLP（メジャーリーグピックルボール）の裏側を知ることができる、全プレイヤー必見の神チャンネルです。";
            } else if (ch.name.includes("Pickleball one")) {
                ch.comment = "日本のピックルボール界全体の動向や大会情報、さまざまなプレイヤーのインタビューまで網羅する、まさに情報の宝庫！";
            } else if (ch.name.includes("JPA")) {
                ch.comment = "公式ならではの正確なルール解説や全国大会の白熱したハイライトは、初心者から上級者まで全員のバイブルとなります。";
            }
        });
    }

    if (data.beginner_guide_video) {
        data.beginner_guide_video.comment = "文字で読むより動画が一番！ピックルボール独特の「ノンボレーゾーン（キッチン）」や「2バウンドルール」が視覚的に一発で理解できる超絶おすすめの入門動画です。";
    }

    // Add comments to facility media_info
    if (data.facilities) {
        for (const fac of data.facilities) {
            if (fac.media_info && fac.media_info.official_channels) {
                fac.media_info.comment = "このアリーナはまさに『聖地』。実際にこのコートで繰り広げられたトップレベルの試合動画を見ることで、次に行くときのモチベーションが爆上がりすること間違いなしです！";
            }
        }
    }

    // Write back
    data.last_updated = new Date().toISOString().split('T')[0];
    fs.writeFileSync(file, JSON.stringify(data, null, 4), 'utf-8');
}

console.log("Successfully added enthusiastic comments to all media infos in the databases.");
