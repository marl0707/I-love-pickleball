const fs = require('fs');
const f = JSON.parse(fs.readFileSync('production_data/facilities/facilities.json', 'utf8'));

const urls = {
    'TOCCHY PICKLEBALL FREAKS': 'https://www.tocchypickle.com/',
    'セントラルスポーツ・ピックルボールクラブ': 'https://www.central.co.jp/club/utsunomiya-f/',
    'Dテニススクール D-tennis-古淵駅前校': 'https://www.d-tennis.co.jp/',
    'ティップネス川崎': 'https://tip.tipness.co.jp/shop_info/SHP056/',
    'コナミスポーツ テニススクール大宮': 'https://www.konamisportsclub.jp/',
    'さいたま市与野体育館': 'https://www.dunlopsportsclub.jp/yonotaiikukan/',
    '埼玉県所沢市民体育館': 'https://www.city.tokorozawa.saitama.jp/',
    '吉田記念テニス研修センター（TTC）': 'https://tennis-ttc.or.jp/',
    'アルドールテニスステージ 千葉NT校': 'https://www.ardor-ts.co.jp/chibant/',
    'SYSテニスクラブ・アカデミー松戸': 'https://www.systca.com/'
};

let count = 0;
f.forEach(x => {
    if (urls[x.name]) {
        x.website_url = urls[x.name];
        count++;
    }
});

fs.writeFileSync('production_data/facilities/facilities.json', JSON.stringify(f, null, 2), 'utf8');

const missingWeb = f.filter(x => (!x.website_url || x.website_url === '') && !['横浜市緑区山下みどり台小学校体育館', '千葉市立弁天小学校体育館', '磯辺スポーツセンター体育館'].includes(x.name));
console.log('公式URLなし(スキップ除外):', missingWeb.length, '件');
missingWeb.slice(0, 10).forEach((x, i) => console.log((i + 1) + '|' + x.name + '|' + (x.prefecture || '')));
