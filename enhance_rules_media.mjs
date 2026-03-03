import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const regions = [
    'hokkaido_tohoku.json', 'kanto.json', 'chubu.json',
    'kinki.json', 'chugoku_shikoku.json', 'kyushu_okinawa.json'
];

const indoorRules = "【体育館利用のローカルルール・注意点】①シューズ: バドミントンシューズ等の屋内専用・横方向グリップ重視の靴が必須です（ランニングシューズ・クロックス等は捻挫のリスクがあり厳禁）。②ネット: 施設備え付けのバドミントン支柱を下げて専用ネットを張るケースが主流です。③ライン: 床のバドミントンダブルスラインを代用することが多いです（NVZライン等、厳密な公式ルールとは15cmほどの誤差が出ます）。";

const majorArenas = [
    "日環アリーナ栃木",
    "サオリーナ",
    "維新大晃アリーナ",
    "有明テニスの森",
    "粕屋町総合体育館",
    "糸島市運動公園"
];

for (const region of regions) {
    const file = path.join(dir, region);
    if (!fs.existsSync(file)) continue;

    let data = JSON.parse(fs.readFileSync(file, 'utf-8'));

    if (data.facilities) {
        for (const fac of data.facilities) {
            // Task 3: Apply Indoor Local Rules to Public Gyms
            if (fac.operator_type === "公営" || (fac.name && fac.name.includes("体育館")) || fac.type_flag === 1) {
                if (fac.notes === undefined) fac.notes = "";
                if (!fac.notes.includes("【体育館利用のローカルルール")) {
                    fac.notes = fac.notes.trim() + " " + indoorRules;
                }
            }

            // Task 4: Add Media/YouTube Integration for Sacred Places (Tournaments) or Major Arenas
            if (fac.hosts_tournaments || majorArenas.some(ma => fac.name && fac.name.includes(ma))) {
                const searchQuery = `${fac.name} ピックルボール`;
                fac.media_info = {
                    youtube_search_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`,
                    description: `※このアリーナでの白熱のプレイ風景や大会の様子は、YouTube等の動画検索で確認できます。`
                };
            }
        }
    }

    // Write back
    data.last_updated = new Date().toISOString().split('T')[0];
    fs.writeFileSync(file, JSON.stringify(data, null, 4), 'utf-8');
}

console.log("Successfully integrated Local Rules & Manners (Task 3) and Multimedia YouTube Search URLs (Task 4) to all facilities.");
