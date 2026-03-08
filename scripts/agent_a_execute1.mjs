import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = join(__dirname, '..', 'production_data');

function loadJson(relPath) {
    return JSON.parse(readFileSync(join(BASE, relPath), 'utf-8'));
}
function saveJson(relPath, data) {
    writeFileSync(join(BASE, relPath), JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

const tohokuFacilities = [
    {
        "name": "青森市総合体育館",
        "prefecture": "青森県",
        "city": "青森市",
        "address": "〒030-0861 青森県青森市",
        "latitude": 40.824,
        "longitude": 140.739,
        "google_maps_url": "https://maps.google.com/?q=40.824,140.739",
        "website_url": "https://aomori-arena.jp/",
        "type_flag": 1,
        "operator_type": "自治体(公営)",
        "is_premium": false,
        "hosts_tournaments": false,
        "tournament_types": null,
        "visitor_welcome": true,
        "has_school": false,
        "facility_amenities": {
            "has_shower": 1, "has_locker_room": 1, "has_cafe": 0,
            "has_kids_space": 0, "has_parking": 1,
            "parking_detail": "敷地内駐車場あり",
            "has_wifi": 0, "is_indoor": true,
            "paddle_rental": false,
            "court_surface": "ウッド（木・体育館）",
            "visitor_welcome": true
        },
        "hours_mon": "9:00-21:00", "hours_tue": "9:00-21:00", "hours_wed": "9:00-21:00",
        "hours_thu": "9:00-21:00", "hours_fri": "9:00-21:00", "hours_sat": "9:00-21:00",
        "hours_sun": "9:00-17:00",
        "hours_note": "青森ピックルボールファイターズが活動",
        "reservation_method": "Web予約",
        "facility_courts": [{
            "court_type": "インドア",
            "number_of_courts": 2,
            "surface_type": "体育館床(木製)",
            "line_visibility": "他競技混在(見にくい)",
            "net_type": "ポータブル(キャスター無)",
            "has_ac": 0,
            "baseline_margin": "標準",
            "lighting_type": "屋内照明"
        }],
        "facility_shops": {
            "has_paddle_sales": 0, "has_apparel_sales": 0,
            "has_paddle_rental": 0, "paddle_rental_fee": null,
            "handled_brands": null
        },
        "price_info": { "base_fee": "一般個人利用規定に準拠" },
        "access": "車での来場推奨",
        "notes": "青森ピックルボールファイターズの活動拠点",
        "directions_url": "https://maps.google.com/?q=青森市総合体育館",
        "access_info": { "guide": "スポーツセンター等の規定に準拠", "directions_url": "https://maps.google.com/?q=青森市総合体育館" },
        "_region": "東北", "_region_romaji": "tohoku"
    },
    {
        "name": "仙台市若林体育館",
        "prefecture": "宮城県",
        "city": "仙台市若林区",
        "address": "〒984-0002 宮城県仙台市若林区卸町東2-8-1",
        "latitude": 38.252,
        "longitude": 140.929,
        "google_maps_url": "https://maps.google.com/?q=38.252,140.929",
        "website_url": "https://www.spf-sendai.jp/wakabayashi/",
        "type_flag": 1,
        "operator_type": "自治体(公営)",
        "is_premium": false,
        "hosts_tournaments": true,
        "tournament_types": "ピックルボール運動会等",
        "visitor_welcome": true,
        "has_school": false,
        "facility_amenities": {
            "has_shower": 1, "has_locker_room": 1, "has_cafe": 0,
            "has_kids_space": 0, "has_parking": 1,
            "parking_detail": "大型無料駐車場あり",
            "has_wifi": 0, "is_indoor": true,
            "paddle_rental": true,
            "court_surface": "ウッド（木・体育館）",
            "visitor_welcome": true
        },
        "hours_mon": "9:00-21:00", "hours_tue": "9:00-21:00", "hours_wed": "9:00-21:00",
        "hours_thu": "9:00-21:00", "hours_fri": "9:00-21:00", "hours_sat": "9:00-21:00",
        "hours_sun": "9:00-17:00",
        "hours_note": "休館日要確認",
        "reservation_method": "公共施設予約システム",
        "facility_courts": [{
            "court_type": "インドア",
            "number_of_courts": 4,
            "surface_type": "体育館床(木製)",
            "line_visibility": "他競技混在(見にくい)",
            "net_type": "ポータブル(キャスター無)",
            "has_ac": 0,
            "baseline_margin": "広い",
            "lighting_type": "屋内照明"
        }],
        "facility_shops": {
            "has_paddle_sales": 0, "has_apparel_sales": 0,
            "has_paddle_rental": 1, "paddle_rental_fee": 0,
            "handled_brands": null
        },
        "price_info": { "base_fee": "個人利用 一般240円" },
        "access": "地下鉄東西線 荒井駅から徒歩圏内",
        "notes": "仙台ピックルボール機構主催のイベント頻出",
        "directions_url": "https://maps.google.com/?q=仙台市若林体育館",
        "access_info": { "guide": "荒井駅より徒歩圏内", "directions_url": "https://maps.google.com/?q=仙台市若林体育館" },
        "_region": "東北", "_region_romaji": "tohoku"
    },
    {
        "name": "新田東総合運動場宮城野体育館",
        "prefecture": "宮城県",
        "city": "仙台市宮城野区",
        "address": "〒983-0039 宮城県仙台市宮城野区新田東4-1-1",
        "latitude": 38.271,
        "longitude": 140.932,
        "google_maps_url": "https://maps.google.com/?q=38.271,140.932",
        "website_url": "https://www.spf-sendai.jp/miyagino/",
        "type_flag": 1,
        "operator_type": "自治体(公営)",
        "is_premium": false,
        "hosts_tournaments": true,
        "tournament_types": "草大会、体験会",
        "visitor_welcome": true,
        "has_school": false,
        "facility_amenities": {
            "has_shower": 1, "has_locker_room": 1, "has_cafe": 0,
            "has_kids_space": 0, "has_parking": 1,
            "parking_detail": "無料駐車場",
            "has_wifi": 0, "is_indoor": true,
            "paddle_rental": true,
            "court_surface": "特殊樹脂（滑りにくい）",
            "visitor_welcome": true
        },
        "hours_mon": "9:00-21:00", "hours_tue": "9:00-21:00", "hours_wed": "9:00-21:00",
        "hours_thu": "9:00-21:00", "hours_fri": "9:00-21:00", "hours_sat": "9:00-21:00",
        "hours_sun": "9:00-17:00",
        "hours_note": "障害者アリーナでの利用が主",
        "reservation_method": "公共施設予約システム",
        "facility_courts": [{
            "court_type": "インドア",
            "number_of_courts": 3,
            "surface_type": "ハード（障害者アリーナ）",
            "line_visibility": "専用ラインのみ(見やすい)",
            "net_type": "ポータブル(キャスター付)",
            "has_ac": 1,
            "baseline_margin": "標準",
            "lighting_type": "屋内照明"
        }],
        "facility_shops": {
            "has_paddle_sales": 0, "has_apparel_sales": 0,
            "has_paddle_rental": 1, "paddle_rental_fee": 0,
            "handled_brands": null
        },
        "price_info": { "base_fee": "個人利用 一般240円" },
        "access": "最寄り駅より市バス等",
        "notes": "床素材が滑りにくく初心者もプレーしやすい",
        "directions_url": "https://maps.google.com/?q=新田東総合運動場宮城野体育館",
        "access_info": { "guide": "バス利用推奨", "directions_url": "https://maps.google.com/?q=新田東総合運動場宮城野体育館" },
        "_region": "東北", "_region_romaji": "tohoku"
    },
    {
        "name": "小川町体育館",
        "prefecture": "福島県",
        "city": "南相馬市",
        "address": "〒975-0012 福島県南相馬市原町区小川町322-1",
        "latitude": 37.641,
        "longitude": 140.961,
        "google_maps_url": "https://maps.google.com/?q=37.641,140.961",
        "website_url": null,
        "type_flag": 1,
        "operator_type": "自治体(公営)",
        "is_premium": false,
        "hosts_tournaments": true,
        "tournament_types": "草大会、練習会",
        "visitor_welcome": true,
        "has_school": true,
        "facility_amenities": {
            "has_shower": 1, "has_locker_room": 1, "has_cafe": 0,
            "has_kids_space": 0, "has_parking": 1,
            "parking_detail": "駐車場あり",
            "has_wifi": 0, "is_indoor": true,
            "paddle_rental": true,
            "court_surface": "ウッド（木・体育館）",
            "visitor_welcome": true
        },
        "hours_mon": "9:00-21:00", "hours_tue": "9:00-21:00", "hours_wed": "9:00-21:00",
        "hours_thu": "9:00-21:00", "hours_fri": "9:00-21:00", "hours_sat": "9:00-21:00",
        "hours_sun": "9:00-17:00",
        "hours_note": "南相馬ピックルボールアカデミー活動時",
        "reservation_method": "公共施設予約",
        "facility_courts": [{
            "court_type": "インドア",
            "number_of_courts": 3,
            "surface_type": "体育館床(木製)",
            "line_visibility": "他競技混在(見にくい)",
            "net_type": "ポータブル(キャスター無)",
            "has_ac": 0,
            "baseline_margin": "標準",
            "lighting_type": "屋内照明"
        }],
        "facility_shops": {
            "has_paddle_sales": 0, "has_apparel_sales": 0,
            "has_paddle_rental": 1, "paddle_rental_fee": 0,
            "handled_brands": null
        },
        "price_info": { "base_fee": "個人参加 1回400円程度" },
        "access": "原ノ町駅から車で約5分",
        "notes": "南相馬ピックルボールアカデミーの主な活動場所",
        "directions_url": "https://maps.google.com/?q=小川町体育館+南相馬市",
        "access_info": { "guide": "南相馬インターチェンジから約10分", "directions_url": "https://maps.google.com/?q=小川町体育館" },
        "_region": "東北", "_region_romaji": "tohoku"
    },
    {
        "name": "ラウンドワンスタジアム 福島店",
        "prefecture": "福島県",
        "city": "福島市",
        "address": "〒960-0112 福島県福島市南矢野目字中江12-1",
        "latitude": 37.781,
        "longitude": 140.461,
        "google_maps_url": "https://maps.google.com/?q=37.781,140.461",
        "website_url": "https://www.round1.co.jp/shop/tenpo/fukushima-fukushima.html",
        "type_flag": 1,
        "operator_type": "民間",
        "is_premium": false,
        "hosts_tournaments": false,
        "tournament_types": null,
        "visitor_welcome": true,
        "has_school": false,
        "facility_amenities": {
            "has_shower": 0, "has_locker_room": 1, "has_cafe": 1,
            "has_kids_space": 1, "has_parking": 1,
            "parking_detail": "無料駐車場380台",
            "has_wifi": 1, "is_indoor": true,
            "paddle_rental": true,
            "court_surface": "不明",
            "visitor_welcome": true
        },
        "hours_mon": "10:00-6:00", "hours_tue": "10:00-6:00", "hours_wed": "10:00-6:00",
        "hours_thu": "10:00-6:00", "hours_fri": "10:00-6:00", "hours_sat": "24時間",
        "hours_sun": "24時間",
        "hours_note": "スポッチャエリアにて利用可能",
        "reservation_method": "予約不要(先着順)",
        "facility_courts": [{
            "court_type": "インドア",
            "number_of_courts": 1,
            "surface_type": "ハードコート",
            "line_visibility": "専用ラインのみ(見やすい)",
            "net_type": "ポータブル(キャスター無)",
            "has_ac": 1,
            "baseline_margin": "狭い",
            "lighting_type": "屋内照明"
        }],
        "facility_shops": {
            "has_paddle_sales": 0, "has_apparel_sales": 0,
            "has_paddle_rental": 1, "paddle_rental_fee": 0,
            "handled_brands": null
        },
        "price_info": { "base_fee": "スポッチャ入場料に含む" },
        "access": "車での来場推奨",
        "notes": "アミューズメント施設内で手軽に体験可能",
        "directions_url": "https://maps.google.com/?q=ラウンドワンスタジアム福島店",
        "access_info": { "guide": "大型駐車場あり", "directions_url": "https://maps.google.com/?q=ラウンドワンスタジアム福島店" },
        "_region": "東北", "_region_romaji": "tohoku"
    },
    {
        "name": "山形県霞城公園体育館",
        "prefecture": "山形県",
        "city": "山形市",
        "address": "〒990-0826 山形県山形市霞城町1-2",
        "latitude": 38.254,
        "longitude": 140.328,
        "google_maps_url": "https://maps.google.com/?q=38.254,140.328",
        "website_url": null,
        "type_flag": 1,
        "operator_type": "自治体(公営)",
        "is_premium": false,
        "hosts_tournaments": false,
        "tournament_types": null,
        "visitor_welcome": true,
        "has_school": false,
        "facility_amenities": {
            "has_shower": 1, "has_locker_room": 1, "has_cafe": 0,
            "has_kids_space": 0, "has_parking": 1,
            "parking_detail": "霞城公園駐車場",
            "has_wifi": 0, "is_indoor": true,
            "paddle_rental": false,
            "court_surface": "ウッド（木・体育館）",
            "visitor_welcome": true
        },
        "hours_mon": "9:00-21:00", "hours_tue": "9:00-21:00", "hours_wed": "9:00-21:00",
        "hours_thu": "9:00-21:00", "hours_fri": "9:00-21:00", "hours_sat": "9:00-21:00",
        "hours_sun": "9:00-17:00",
        "hours_note": "木曜18:30-21:00に「ピックルボールやまがた」が活動",
        "reservation_method": "公共施設予約",
        "facility_courts": [{
            "court_type": "インドア",
            "number_of_courts": 2,
            "surface_type": "体育館床(木製)",
            "line_visibility": "他競技混在(見にくい)",
            "net_type": "ポータブル(キャスター無)",
            "has_ac": 0,
            "baseline_margin": "標準",
            "lighting_type": "屋内照明"
        }],
        "facility_shops": {
            "has_paddle_sales": 0, "has_apparel_sales": 0,
            "has_paddle_rental": 0, "paddle_rental_fee": null,
            "handled_brands": null
        },
        "price_info": { "base_fee": "個人利用 一般200円程度" },
        "access": "山形駅から徒歩約15分",
        "notes": "ピックルボールやまがたの活動拠点",
        "directions_url": "https://maps.google.com/?q=山形県霞城公園体育館",
        "access_info": { "guide": "山形駅からの徒歩圏内", "directions_url": "https://maps.google.com/?q=山形県霞城公園体育館" },
        "_region": "東北", "_region_romaji": "tohoku"
    },
    {
        "name": "シェルターインクルーシブプレイス コパル",
        "prefecture": "山形県",
        "city": "山形市",
        "address": "〒990-2316 山形県山形市片谷地580-1",
        "latitude": 38.204,
        "longitude": 140.315,
        "google_maps_url": "https://maps.google.com/?q=38.204,140.315",
        "website_url": "https://copal-kids.jp/",
        "type_flag": 1,
        "operator_type": "自治体(公営)",
        "is_premium": true,
        "hosts_tournaments": false,
        "tournament_types": null,
        "visitor_welcome": true,
        "has_school": true,
        "facility_amenities": {
            "has_shower": 0, "has_locker_room": 1, "has_cafe": 1,
            "has_kids_space": 1, "has_parking": 1,
            "parking_detail": "無料駐車場",
            "has_wifi": 1, "is_indoor": true,
            "paddle_rental": true,
            "court_surface": "ウッド（木・体育館）",
            "visitor_welcome": true
        },
        "hours_mon": "9:00-18:00", "hours_tue": "9:00-18:00", "hours_wed": "9:00-18:00",
        "hours_thu": "9:00-18:00", "hours_fri": "9:00-18:00", "hours_sat": "9:00-21:00",
        "hours_sun": "9:00-18:00",
        "hours_note": "土曜日19:00-21:00に「アプルス」のコースあり",
        "reservation_method": "Web予約",
        "facility_courts": [{
            "court_type": "インドア",
            "number_of_courts": 2,
            "surface_type": "体育館床(木製)",
            "line_visibility": "他競技混在(見にくい)",
            "net_type": "ポータブル(キャスター無)",
            "has_ac": 1,
            "baseline_margin": "広い",
            "lighting_type": "屋内照明"
        }],
        "facility_shops": {
            "has_paddle_sales": 0, "has_apparel_sales": 0,
            "has_paddle_rental": 1, "paddle_rental_fee": 0,
            "handled_brands": null
        },
        "price_info": { "base_fee": "アプルスのコース参加費に準じる" },
        "access": "蔵王駅から車で10分",
        "notes": "綺麗な体育館施設で土曜夜に教室等実施",
        "directions_url": "https://maps.google.com/?q=シェルターインクルーシブプレイスコパル",
        "access_info": { "guide": "大型駐車場あり", "directions_url": "https://maps.google.com/?q=シェルターインクルーシブプレイスコパル" },
        "_region": "東北", "_region_romaji": "tohoku"
    },
    {
        "name": "indoor sports park SUNBOW",
        "prefecture": "秋田県",
        "city": "大仙市",
        "address": "〒014-0046 秋田県大仙市",
        "latitude": 39.453,
        "longitude": 140.481,
        "google_maps_url": "https://maps.google.com/?q=39.453,140.481",
        "website_url": null,
        "type_flag": 1,
        "operator_type": "民間",
        "is_premium": true,
        "hosts_tournaments": true,
        "tournament_types": "草大会、レッスン",
        "visitor_welcome": true,
        "has_school": true,
        "facility_amenities": {
            "has_shower": 1, "has_locker_room": 1, "has_cafe": 0,
            "has_kids_space": 0, "has_parking": 1,
            "parking_detail": "無料駐車場",
            "has_wifi": 1, "is_indoor": true,
            "paddle_rental": true,
            "court_surface": "人工芝または専用マット",
            "visitor_welcome": true
        },
        "hours_mon": "10:00-21:00", "hours_tue": "10:00-21:00", "hours_wed": "10:00-21:00",
        "hours_thu": "10:00-21:00", "hours_fri": "10:00-21:00", "hours_sat": "10:00-21:00",
        "hours_sun": "10:00-19:00",
        "hours_note": "冷暖房完備のインドア専用施設",
        "reservation_method": "Web予約/電話",
        "facility_courts": [{
            "court_type": "インドア",
            "number_of_courts": 2,
            "surface_type": "ハードコート",
            "line_visibility": "専用ラインのみ(見やすい)",
            "net_type": "常設(埋め込み)",
            "has_ac": 1,
            "baseline_margin": "広い",
            "lighting_type": "LED照明完備"
        }],
        "facility_shops": {
            "has_paddle_sales": 1, "has_apparel_sales": 0,
            "has_paddle_rental": 1, "paddle_rental_fee": 500,
            "handled_brands": "Franklin"
        },
        "price_info": { "base_fee": "利用料金要問合せ" },
        "access": "大曲駅から車で10分",
        "notes": "秋田県初の本格的インドアピックルボール対応施設。Franklin取扱。",
        "directions_url": "https://maps.google.com/?q=indoor+sports+park+SUNBOW",
        "access_info": { "guide": "駐車場あり", "directions_url": "https://maps.google.com/?q=indoor+sports+park+SUNBOW" },
        "_region": "東北", "_region_romaji": "tohoku"
    },
    {
        "name": "由利本荘総合防災公園ナイスアリーナ",
        "prefecture": "秋田県",
        "city": "由利本荘市",
        "address": "〒015-0011 秋田県由利本荘市石脇字田尻野2",
        "latitude": 39.395,
        "longitude": 140.046,
        "google_maps_url": "https://maps.google.com/?q=39.395,140.046",
        "website_url": "https://nice-arena.jp/",
        "type_flag": 1,
        "operator_type": "自治体(公営)",
        "is_premium": false,
        "hosts_tournaments": true,
        "tournament_types": "草大会",
        "visitor_welcome": true,
        "has_school": false,
        "facility_amenities": {
            "has_shower": 1, "has_locker_room": 1, "has_cafe": 0,
            "has_kids_space": 0, "has_parking": 1,
            "parking_detail": "大型駐車場あり",
            "has_wifi": 0, "is_indoor": true,
            "paddle_rental": true,
            "court_surface": "ウッド（木・体育館）",
            "visitor_welcome": true
        },
        "hours_mon": "9:00-21:00", "hours_tue": "9:00-21:00", "hours_wed": "9:00-21:00",
        "hours_thu": "9:00-21:00", "hours_fri": "9:00-21:00", "hours_sat": "9:00-21:00",
        "hours_sun": "9:00-17:00",
        "hours_note": "個人参加型プログラム等あり",
        "reservation_method": "公共施設予約",
        "facility_courts": [{
            "court_type": "インドア",
            "number_of_courts": 4,
            "surface_type": "体育館床(木製)",
            "line_visibility": "他競技混在(見にくい)",
            "net_type": "ポータブル(キャスター無)",
            "has_ac": 1,
            "baseline_margin": "標準",
            "lighting_type": "屋内照明"
        }],
        "facility_shops": {
            "has_paddle_sales": 0, "has_apparel_sales": 0,
            "has_paddle_rental": 1, "paddle_rental_fee": 0,
            "handled_brands": null
        },
        "price_info": { "base_fee": "個人参加型プログラム: 1回800円(税込)" },
        "access": "羽後本荘駅から車で約10分",
        "notes": "西目ピックルボールクラブ等活動拠点。パドル貸出あり初心者歓迎プログラム実施。",
        "directions_url": "https://maps.google.com/?q=ナイスアリーナ+由利本荘",
        "access_info": { "guide": "大型駐車場あり", "directions_url": "https://maps.google.com/?q=ナイスアリーナ" },
        "_region": "東北", "_region_romaji": "tohoku"
    },
    {
        "name": "もりおかピクルズ 活動拠点（盛岡市内体育館）",
        "prefecture": "岩手県",
        "city": "盛岡市",
        "address": "〒020-0000 岩手県盛岡市内各所休",
        "latitude": 39.702,
        "longitude": 141.154,
        "google_maps_url": "https://maps.google.com/?q=39.702,141.154",
        "website_url": null,
        "type_flag": 1,
        "operator_type": "自治体(公営)",
        "is_premium": false,
        "hosts_tournaments": false,
        "tournament_types": null,
        "visitor_welcome": true,
        "has_school": false,
        "facility_amenities": {
            "has_shower": 1, "has_locker_room": 1, "has_cafe": 0,
            "has_kids_space": 0, "has_parking": 1,
            "parking_detail": "施設による",
            "has_wifi": 0, "is_indoor": true,
            "paddle_rental": true,
            "court_surface": "ウッド（木・体育館）",
            "visitor_welcome": true
        },
        "hours_mon": "休館", "hours_tue": "9:00-21:00", "hours_wed": "9:00-21:00",
        "hours_thu": "9:00-21:00", "hours_fri": "9:00-21:00", "hours_sat": "9:00-21:00",
        "hours_sun": "13:00-17:00",
        "hours_note": "日曜日にサークル「もりおかピクルズ」活動",
        "reservation_method": "要連絡",
        "facility_courts": [{
            "court_type": "インドア",
            "number_of_courts": 2,
            "surface_type": "体育館床(木製)",
            "line_visibility": "他競技混在(見にくい)",
            "net_type": "ポータブル(キャスター無)",
            "has_ac": 0,
            "baseline_margin": "標準",
            "lighting_type": "屋内照明"
        }],
        "facility_shops": {
            "has_paddle_sales": 0, "has_apparel_sales": 0,
            "has_paddle_rental": 1, "paddle_rental_fee": 0,
            "handled_brands": null
        },
        "price_info": { "base_fee": "1回300円 (もりおかピクルズ参加費)" },
        "access": "盛岡市内各所",
        "notes": "盛岡市のサークル拠点",
        "directions_url": "https://maps.google.com/?q=盛岡市",
        "access_info": { "guide": "活動場所による", "directions_url": "https://maps.google.com/?q=盛岡市" },
        "_region": "東北", "_region_romaji": "tohoku"
    },
    {
        "name": "モリオカロイヤルテニスクラブ",
        "prefecture": "岩手県",
        "city": "盛岡市",
        "address": "〒020-0103 岩手県盛岡市西松園1-6-1",
        "latitude": 39.754,
        "longitude": 141.139,
        "google_maps_url": "https://maps.google.com/?q=39.754,141.139",
        "website_url": "https://moriokaroyal-tennis.jp/",
        "type_flag": 1,
        "operator_type": "民間",
        "is_premium": true,
        "hosts_tournaments": false,
        "tournament_types": "体験会",
        "visitor_welcome": true,
        "has_school": true,
        "facility_amenities": {
            "has_shower": 1, "has_locker_room": 1, "has_cafe": 0,
            "has_kids_space": 0, "has_parking": 1,
            "parking_detail": "無料駐車場あり",
            "has_wifi": 1, "is_indoor": false,
            "paddle_rental": true,
            "court_surface": "ハードコート",
            "visitor_welcome": true
        },
        "hours_mon": "9:00-21:00", "hours_tue": "9:00-21:00", "hours_wed": "9:00-21:00",
        "hours_thu": "9:00-21:00", "hours_fri": "9:00-21:00", "hours_sat": "9:00-21:00",
        "hours_sun": "9:00-18:00",
        "hours_note": "通常テニスクラブ。PBコート利用は要問合せ",
        "reservation_method": "Web予約/電話",
        "facility_courts": [{
            "court_type": "アウトドア",
            "number_of_courts": 2,
            "surface_type": "アウトドアハード",
            "line_visibility": "テープ貼り",
            "net_type": "ポータブル(キャスター無)",
            "has_ac": 0,
            "baseline_margin": "広い",
            "lighting_type": "ナイター設備あり"
        }],
        "facility_shops": {
            "has_paddle_sales": 0, "has_apparel_sales": 1,
            "has_paddle_rental": 1, "paddle_rental_fee": 500,
            "handled_brands": null
        },
        "price_info": { "base_fee": "レンタルコートビジター料金要確認" },
        "access": "盛岡駅から車で15分",
        "notes": "アウトドアのハードコートでピックルボール体験可能",
        "directions_url": "https://maps.google.com/?q=モリオカロイヤルテニスクラブ",
        "access_info": { "guide": "駐車場完備", "directions_url": "https://maps.google.com/?q=モリオカロイヤルテニスクラブ" },
        "_region": "東北", "_region_romaji": "tohoku"
    }
];

const facilitiesPath = 'facilities/facilities.json';
const facilities = loadJson(facilitiesPath);

// Filter out duplicates if any (based on name + prefecture)
let addedCount = 0;
for (const tf of tohokuFacilities) {
    if (!facilities.some(f => f.name === tf.name && f.prefecture === tf.prefecture)) {
        // Set an auto-incrementing ID if needed, though they don't seem to use explicit string IDs directly in the array except maybe index
        facilities.push(tf);
        addedCount++;
    }
}

saveJson(facilitiesPath, facilities);
console.log(`Successfully appended ${addedCount} Tohoku facilities!`);
