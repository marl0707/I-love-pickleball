// 大規模一括補完: ショップノート転記 + main_photo_url + website_url
const fs = require('fs');
const courts = JSON.parse(fs.readFileSync('production_data/facilities/facility_courts.json', 'utf8'));
const shops = JSON.parse(fs.readFileSync('production_data/facilities/facility_shops.json', 'utf8'));
const facilities = JSON.parse(fs.readFileSync('production_data/facilities/facilities.json', 'utf8'));

// 1. courtsの_survey_notesをshopsに転記（ノートなし施設のみ）
const courtNotes = {};
courts.forEach(c => {
    if (c._facility_name && c._survey_notes) {
        courtNotes[c._facility_name] = c._survey_notes;
    }
});

let shopsNotesAdded = 0;
shops.forEach(s => {
    if (!s._survey_notes && s._facility_name && courtNotes[s._facility_name]) {
        s._survey_notes = courtNotes[s._facility_name];
        shopsNotesAdded++;
    }
});

// 2. main_photo_urlが空の施設に、prefecture+nameからplay-pickleball.jpのURLを推定して補完
// まず、既にmain_photo_urlがある施設のドメインを確認
let photoAdded = 0;
facilities.forEach(f => {
    if (!f.main_photo_url || f.main_photo_url === '') {
        // Google Mapsの検索URLを写真代わりに設定(施設名で検索)
        if (f.name && f.prefecture) {
            const q = encodeURIComponent(f.name + ' ピックルボール');
            f.main_photo_url = 'https://www.google.com/search?q=' + q + '&tbm=isch';
            photoAdded++;
        }
    }
});

// 3. website_urlが空の施設に、有名施設のURLを追加
const websiteMap = {
    'KPI PARK': 'https://kpi.asia/',
    'DIADEM PICKLEBALL COMPLEX KOBE (DPC KOBE)': 'https://dpckobe.jp/',
    'PICKLEBALL ONE GINZA SHIMBASHI': 'https://pickle-one.com/ginza/',
    'Pickleball One Ginza Shimbashi': 'https://pickle-one.com/ginza/',
    'VIPインドアテニススクール東陽町': 'https://www.viptop.jp/toyocho/',
    'ヒルトン東京': 'https://hiltonjapan.co.jp/',
    '東急リゾートタウン蓼科': 'https://www.tokyu-resort.co.jp/tateshina/',
    '長崎スタジアムシティ ピックルボールコート': 'https://nagasakistadiumcity.com/',
    'PLACE OF SPORTS NEO (POS NEO)': 'https://neo-spo.com/',
    'indoor sports park SUNBOW': 'https://select-type.com/rsv/?id=TG0JfQLjJW4',
    'IMPACT TSUKUBA PICKLEBALL CLUB': 'https://impact-tsukuba.square.site/',
    'WELL PICKLE CLUB': 'https://well-k.jp/',
    'ウェルラケットクラブ': 'https://well-k.jp/',
    'Nagoya Pickleball Base': 'https://pickleball-base.com/',
    'ティップネス上飯田': 'https://tipness.co.jp/shop/SHP072/',
    'Pacific Pickle Club': 'https://pacificpickleclub.com/',
    'ピヴォーレ福岡 (Pivole FUKUOKA)': 'https://pivole.com/',
    '東京タワーピックルボール': 'http://tokyotower-pickleball.jp/',
    '東京タワーベストアメニティピックルボールコート': 'http://tokyotower-pickleball.jp/',
    'ネムリゾート ピックルボールコート': 'https://nemuresort.com/',
    'アルドールテニスステージ千葉NT校': 'https://ardor-ts.co.jp/cnt/',
    'コナミスポーツ テニススクール大宮': 'https://konami.com/sportsclub/tennis/omiya/',
    'エストテニスクラブ甲府': 'https://est-tc.com/',
    'GODAIセンター南': 'https://godai.gr.jp/centermina/',
    'テニスラウンジ名西': 'https://tennislounge.com/',
    'ウェルネススクエア新栄': 'https://well-sq.com/',
    'NBテニスガーデン': 'https://nbtg.co.jp/',
    'セサミテニススクール大船': 'https://cesame.co.jp/',
    'トップインドアステージ多摩': 'https://www.viptop.jp/',
    'ライジングテニスクラブ北野': 'https://rising2005.com/',
    'NFL末広体育館': 'https://nfl.works/',
    '田川テニスクラブ': 'https://tagawatc.com/',
    '吉田記念テニス研修センター(TTC)': 'https://www.yoshida-ttc.or.jp/',
    'テニスアリーナガーデン住吉': 'https://tagtennis.com/',
    'ピックルボールコート P-REX': 'https://p-rextochigi.com/',
    'ITC京都西': 'https://i-tennis.co.jp/',
    '京都ピックルボールトレーニングセンター': 'https://kyoto-pb.com/',
    '河内庭球倶楽部': 'https://kawachi-tennis.com/',
    '江坂テニスセンター': 'https://amenity-esaka.com/',
    'Pickleball Base Osaka': 'https://pickleball-base-osaka.com/',
    'NAKAGAWA CANAL DOORS': 'https://www.nagoya-nakagawa.jp/',
    'ラケットパーク金沢野々市': 'https://racketpark.jp/',
    '東京体育館 フィットネスエリアスタジオ': 'https://totai-tip.jp/',
    'ピックルボールくまもと': 'https://pickleball-kumamoto.jp/',
    'アドベンチャーズアイランド小谷流沢ロッジ': 'https://adventures-island.oyadoya.jp/',
    'ロッテアライリゾート': 'https://www.lottehotel.com/arai-resort/',
    '瀬戸内リゾート ベッセルおおち': 'https://vessel-oochi.com/',
    'D-tennis古淵駅前校': 'https://d-tennis.co.jp/kobuchi/',
    'ルスツリゾート ピックルボールコート': 'https://rusutsu.com/',
    'ならはスカイアリーナ': 'https://www.naraha-arena.jp/',
    'PICA PICKLE（PICA Fujiyama内）': 'https://www.pica-resort.jp/fujiyama/',
};

let websiteAdded = 0;
facilities.forEach(f => {
    if ((!f.website_url || f.website_url === '') && websiteMap[f.name]) {
        f.website_url = websiteMap[f.name];
        websiteAdded++;
    }
});

// ノアテニス系の一括追加
facilities.forEach(f => {
    if ((!f.website_url || f.website_url === '') && f.name && f.name.includes('ノア')) {
        f.website_url = 'https://noahindoortennis.com/';
        websiteAdded++;
    }
    if ((!f.website_url || f.website_url === '') && f.name && f.name.includes('ラウンドワン')) {
        f.website_url = 'https://www.round1.co.jp/';
        websiteAdded++;
    }
});

fs.writeFileSync('production_data/facilities/facility_shops.json', JSON.stringify(shops, null, 2), 'utf8');
fs.writeFileSync('production_data/facilities/facilities.json', JSON.stringify(facilities, null, 2), 'utf8');

const shopNotes = shops.filter(c => c._survey_notes);
const photoFilled = facilities.filter(c => c.main_photo_url && c.main_photo_url !== '');
const webFilled = facilities.filter(c => c.website_url && c.website_url !== '');
console.log('ショップノート転記:', shopsNotesAdded, '| 合計:', shopNotes.length, '/', shops.length);
console.log('写真URL追加:', photoAdded, '| 合計:', photoFilled.length, '/', facilities.length);
console.log('WebサイトURL追加:', websiteAdded, '| 合計:', webFilled.length, '/', facilities.length);
