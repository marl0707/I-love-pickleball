import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const regions = [
    'hokkaido_tohoku.json', 'kanto.json', 'chubu.json',
    'kinki.json', 'chugoku_shikoku.json', 'kyushu_okinawa.json'
];

// Top tier media channels
const mediaChannels = [
    { name: "Pickleball Japan TV (船水雄太選手)", url: "https://www.youtube.com/@pickleballjapantv", description: "日本初のプロピックルボールプレーヤー船水雄太選手の公式チャンネル。MLPの裏側やプレイスタイルが学べる最高峰メディア" },
    { name: "ピックルボールワン | Pickleball one", url: "https://www.youtube.com/@pickle-one", description: "日本最大級の総合ピックルボールメディア公式チャンネル。" },
    { name: "JPAピックルボール", url: "https://www.youtube.com/@japanpickleballassociation", description: "JPA（日本ピックルボール協会）公式。ルール解説や大会ハイライト。" }
];

const beginnerVideo = {
    name: "初心者向けピックルボール基礎・ルール解説",
    url: "https://www.youtube.com/@pickleballjapantv", // Using top channel as main reference point
    description: "これから始める方向けの完璧なルール解説や基礎動画は、JPA公式やPickleball Japan TVから直接視聴できます。"
};

for (const region of regions) {
    const file = path.join(dir, region);
    if (!fs.existsSync(file)) continue;

    let data = JSON.parse(fs.readFileSync(file, 'utf-8'));

    // Inject global top-tier media info at the root of each region
    if (!data.top_media_channels) {
        data.top_media_channels = mediaChannels;
    }
    if (!data.beginner_guide_video) {
        data.beginner_guide_video = beginnerVideo;
    }

    if (data.facilities) {
        for (const fac of data.facilities) {
            // Upgrade existing "search urls" to direct channel integrations for sacred places
            if (fac.media_info && fac.media_info.youtube_search_url) {
                // Keep the search but add direct official channel link
                fac.media_info.official_channels = [mediaChannels[0].url, mediaChannels[2].url];
                fac.media_info.description = `※このアリーナでの白熱のプレイ風景検索に加え、日本トッププロの最新動画は ${mediaChannels[0].url} で直接視聴可能です。`;
            }
        }
    }

    // Write back
    data.last_updated = new Date().toISOString().split('T')[0];
    fs.writeFileSync(file, JSON.stringify(data, null, 4), 'utf-8');
}

console.log("Successfully integrated Direct YouTube URLs (Pickleball Japan TV, JPA, Pickleball One) to all regional databases.");
