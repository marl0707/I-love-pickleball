import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const regions = [
    'hokkaido_tohoku.json', 'kanto.json', 'chubu.json',
    'kinki.json', 'chugoku_shikoku.json', 'kyushu_okinawa.json'
];

let addedMetaCount = 0;

for (const region of regions) {
    const file = path.join(dir, region);
    if (!fs.existsSync(file)) continue;

    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    let modified = false;

    if (data.circles) {
        for (const circle of data.circles) {

            // 1. Beginner friendly flag
            if (circle.beginner_friendly === undefined) {
                let friendly = true; // default assume friendly unless stated otherwise
                const desc = circle.description || "";
                if (desc.includes("経験者") || desc.includes("中級") || desc.includes("上級")) {
                    // Check if it's strictly experienced
                    if (!desc.includes("初心者") && !desc.includes("未経験")) {
                        friendly = false;
                    }
                }
                circle.beginner_friendly = friendly;
                modified = true;
                addedMetaCount++;
            }

            // 2. Play style inference
            if (!circle.play_style) {
                let style = "エンジョイ（レクリエーション）";
                const desc = circle.description || "";

                if (desc.includes("大会") || desc.includes("競技") || desc.includes("強化") || desc.includes("ガチ")) {
                    style = "競技志向・大会向け";
                } else if (desc.includes("練習") && desc.includes("試合")) {
                    style = "エンジョイ〜競技志向混合";
                }
                circle.play_style = style;
                modified = true;
            }

            // 3. Activity Frequency inference
            if (!circle.activity_frequency) {
                let freq = "不定期";
                const sched = circle.schedule || "";

                if (sched.includes("毎週") || sched.includes("月4") || sched.includes("月曜日") || sched.includes("火曜日") || sched.includes("水曜日") || sched.includes("木曜日") || sched.includes("金曜日") || sched.includes("土曜日") || sched.includes("日曜日")) {
                    freq = "週1回以上";
                } else if (sched.includes("月2") || sched.includes("隔週")) {
                    freq = "月2回程度";
                } else if (sched.includes("月1")) {
                    freq = "月1回程度";
                }

                circle.activity_frequency = freq;
                modified = true;
            }
        }
    }

    if (modified) {
        data.last_updated = new Date().toISOString().split('T')[0];
        fs.writeFileSync(file, JSON.stringify(data, null, 4), 'utf-8');
    }
}

console.log(`--- CIRCLE METADATA EXPANSION COMPLETE ---`);
console.log(`Assigned advanced community metadata to: ${addedMetaCount} circles/communities`);
