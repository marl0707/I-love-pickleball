import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const regions = [
    'hokkaido_tohoku.json', 'kanto.json', 'chubu.json',
    'kinki.json', 'chugoku_shikoku.json', 'kyushu_okinawa.json'
];

const prefectures = [
    "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
    "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
    "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
    "静岡県", "愛知県", "三重県",
    "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
    "鳥取県", "島根県", "岡山県", "広島県", "山口県",
    "徳島県", "香川県", "愛媛県", "高知県",
    "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

const counts = {};
prefectures.forEach(p => counts[p] = { facilities: 0, circles: 0 });

for (const region of regions) {
    const file = path.join(dir, region);
    if (!fs.existsSync(file)) continue;
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));

    if (data.facilities) {
        for (const fac of data.facilities) {
            const pref = fac.prefecture;
            if (counts[pref]) counts[pref].facilities++;
        }
    }
    if (data.circles) {
        for (const cir of data.circles) {
            const pref = cir.prefecture;
            if (counts[pref]) counts[pref].circles++;
        }
    }
}

console.log("=== 47都道府県 データ網羅状況 ===");
const scarcePrefs = [];
prefectures.forEach(p => {
    const f = counts[p].facilities;
    const c = counts[p].circles;
    if (f <= 1 || c === 0) {
        scarcePrefs.push(p);
        console.log(`[要注意/空白] ${p}: 施設 ${f}件, サークル ${c}件`);
    } else {
        // console.log(`[充実] ${p}: 施設 ${f}件, サークル ${c}件`);
    }
});

console.log(`\n空白・情報不足の要注意県（${scarcePrefs.length}県）: ${scarcePrefs.join(', ')}`);
