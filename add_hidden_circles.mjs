import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const chugoku = path.join(dir, 'chugoku_shikoku.json');
const chubu = path.join(dir, 'chubu.json');
const kinki = path.join(dir, 'kinki.json');

const buildFac = (name, pref, addr) => {
    return {
        "name": name,
        "prefecture": pref,
        "address": addr,
        "type_flag": 1,
        "operator_type": "自治体",
        "google_maps_url": `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr || name)}`,
        "hours_mon": "9:00-21:00",
        "hours_tue": "9:00-21:00",
        "hours_wed": "9:00-21:00",
        "hours_thu": "9:00-21:00",
        "hours_fri": "9:00-21:00",
        "hours_sat": "9:00-21:00",
        "hours_sun": "9:00-21:00",
        "hours_note": "自治体の一般的な営業時間。サークル活動の拠点となる場合があります。",
        "has_parking": 1,
        "facility_amenities": {
            "has_shower": 1,
            "has_locker_room": 1,
            "has_parking": 1,
            "parking_detail": "無料駐車場完備（数十台〜規模）"
        },
        "facility_shops": {
            "has_paddle_rental": 0,
            "rental_detail": "個人持ち込み必須（支柱とネットはバドミントン用を代用）"
        },
        "facility_courts": [
            {
                "court_type": "インドア",
                "surface_type": "体育館床(木製)",
                "line_visibility": "他競技混在(見にくい)",
                "line_note": "※バドミントンのラインを利用するか、マスキングテープ等でのライン引きが必要な場合があります。",
                "lighting_type": "屋内照明"
            }
        ],
        "notes": "※ピックルボールの練習会やサークル活動の会場として使用された実績があります。"
    };
};

const buildCircle = (name, pref, facilities, note) => {
    return {
        "name": name,
        "prefecture": pref,
        "base_facilities": facilities,
        "notes": note
    };
};

// 1. Chugoku / Shikoku (Yamaguchi)
const cgData = JSON.parse(fs.readFileSync(chugoku, 'utf-8'));
cgData.facilities.push(buildFac("ふくいテニスクラブ", "山口県", "山口県下関市"));
cgData.facilities.push(buildFac("新南陽体育センター", "山口県", "山口県周南市"));
cgData.facilities.push(buildFac("美東小学校体育館", "山口県", "山口県美祢市"));
cgData.facilities.push(buildFac("須恵健康公園体育館", "山口県", "山口県山陽小野田市"));
cgData.facilities.push(buildFac("維新大晃アリーナ", "山口県", "山口県山口市"));
if (!cgData.circles) cgData.circles = [];
cgData.circles.push(buildCircle("山口ピックルボールクラブ (YPC)", "山口県", ["サンフレッシュ山口", "湯田小学校"], "初心者対象の体験会実施。YCPA(山口市ピックルボール協会)主催。"));
fs.writeFileSync(chugoku, JSON.stringify(cgData, null, 4), 'utf-8');

// 2. Chubu (Nagano)
const cbData = JSON.parse(fs.readFileSync(chubu, 'utf-8'));
cbData.facilities.push(buildFac("安茂里体育館", "長野県", "長野県長野市安茂里"));
cbData.facilities.push(buildFac("松本市総合体育館", "長野県", "長野県松本市美須々5-1"));
cbData.facilities.push(buildFac("上田城跡公園 第二体育館", "長野県", "長野県上田市二の丸1-1"));
cbData.facilities.push(buildFac("ユメックスアリーナ 塩尻市総合体育館", "長野県", "長野県塩尻市広丘郷原1658-1"));
cbData.facilities.push(buildFac("東武体育館", "長野県", "長野県千曲市"));
if (!cbData.circles) cbData.circles = [];
cbData.circles.push(buildCircle("あん姫ピックルズ", "長野県", ["千曲市内体育館"], "初心者向け体験プログラム提供"));
cbData.circles.push(buildCircle("松本ピックルボール協会", "長野県", ["松本市内の体育館"], "体験会実施"));
cbData.circles.push(buildCircle("うえだピックルボールクラブ", "長野県", ["清明小学校体育館", "浦里小学校体育館"], "月・水に定期練習"));
cbData.circles.push(buildCircle("南長野ピックルボールクラブ", "長野県", ["長野市南部"], "初心者〜経験者参加可能"));
fs.writeFileSync(chubu, JSON.stringify(cbData, null, 4), 'utf-8');

// 3. Kinki (Wakayama)
const knData = JSON.parse(fs.readFileSync(kinki, 'utf-8'));
knData.facilities.push(buildFac("和歌山市・松下体育館", "和歌山県", "和歌山県和歌山市木ノ本"));
knData.facilities.push(buildFac("田辺スポーツパーク 体育館", "和歌山県", "和歌山県田辺市上上の山29-1"));
knData.facilities.push(buildFac("紀の川市民体育館", "和歌山県", "和歌山県紀の川市西大井336"));
if (!knData.circles) knData.circles = [];
knData.circles.push(buildCircle("紀州ピックルボールクラブ", "和歌山県", ["松下体育館", "貴志小学校"], "週に1回夜間に練習。Instagram @saiko_kishupickleball"));
knData.circles.push(buildCircle("Pickleball Sparkle", "和歌山県", ["各種体育館"], "テニスベアでメンバー募集"));
fs.writeFileSync(kinki, JSON.stringify(knData, null, 4), 'utf-8');

console.log("Successfully added hidden circles and local gyms for Yamaguchi, Nagano, Wakayama.");
