# エージェントA 完全指示書: 施設・イベント・場所関連 + 補助データ

あなたは「I LOVE PICKLEBALL」プロジェクトのデータ収集エージェントAです。
本ドキュメントに記載された**全てのタスク**を実行してください。一つも飛ばさないこと。

---

## 🚨 絶対ルール（違反厳禁）

1. **嘘のデータ・捏造データの生成は絶対禁止** - 実在する情報のみを扱う。架空データの自動生成は犯罪的行為。
2. **見つからない情報は `null` で正直に報告** - 捏造するより100倍マシ。
3. **既存データの削除禁止** - 追記・更新のみ。

---

## あなたの担当ファイル一覧（全12ファイル）

| # | ファイルパス | 現在の件数 | 主な作業 |
|:--|:---|---:|:---|
| 1 | `production_data/facilities/facilities.json` | 349件 | 東北施設20-30件追加 + 全体のフィールド補完 |
| 2 | `production_data/facilities/facility_courts.json` | 215件 | `number_of_courts`のnull補完 |
| 3 | `production_data/facilities/facility_shops.json` | 213件 | レンタル料金・取扱ブランド補完 |
| 4 | `production_data/facilities/facility_media.json` | 5件 | 主要施設のYouTube/Instagram URL追加（目標20件） |
| 5 | `production_data/facilities/facility_comments.json` | 5件 | フィールド構造の正規化確認 |
| 6 | `production_data/events/events.json` | 25件 | 日時/参加費/URL等の50%欠損を補完 |
| 7 | `production_data/events/awards.json` | 2件 | アワード情報の拡充（目標5件） |
| 8 | `production_data/supplementary/price_guide.json` | 1件 | 料金ガイドの拡充（目標5件） |
| 9 | `production_data/supplementary/promotions_coupons.json` | 2件 | クーポン・キャンペーン情報の拡充 |
| 10 | `production_data/supplementary/master_associations.json` | 2件 | 各地域のピックルボール協会情報の追加 |
| 11 | `production_data/community/announcements.json` | 5件 | お知らせの`published_at`/`is_important`補完 |
| 12 | `production_data/community/activity_logs.json` | 5件 | プレイログのフィールド構造確認・補完 |

---

## タスク1（最重要・大）: 東北地方の施設追加

**現状**: 東北6県が**2件のみ**。全国349件中の致命的不足。

### やること
青森県・岩手県・秋田県・宮城県・山形県・福島県のピックルボール施設を調査し追加。

### 調査方法
- `「ピックルボール ○○県」` `「ピックルボール ○○市」` でWeb検索
- Google Maps「ピックルボール」検索
- Instagram `#ピックルボール #仙台` 等
- 各県スポーツ施設予約サイト
- **体育館間借り施設も対象**

### 出力フォーマット（全フィールド）
```json
{
  "name": "施設名（正式名称）",
  "prefecture": "宮城県",
  "city": "仙台市青葉区",
  "address": "〒000-0000 完全な住所",
  "latitude": 38.2682,
  "longitude": 140.8694,
  "google_maps_url": "https://maps.google.com/?q=緯度,経度",
  "website_url": "公式URL（なければnull）",
  "type_flag": 1,
  "operator_type": "民間 / 自治体(公営) / 専門店",
  "is_premium": false,
  "hosts_tournaments": false,
  "tournament_types": null,
  "visitor_welcome": true,
  "has_school": false,
  "facility_amenities": {
    "has_shower": 0, "has_locker_room": 1, "has_cafe": 0,
    "has_kids_space": 0, "has_parking": 1,
    "parking_detail": "駐車場の詳細",
    "has_wifi": 0, "is_indoor": true,
    "paddle_rental": false,
    "court_surface": "ウッド（木・体育館） / ハード / 人工芝 / 不明",
    "visitor_welcome": true
  },
  "hours_mon": "9:00-21:00", "hours_tue": "同上", "hours_wed": "同上",
  "hours_thu": "同上", "hours_fri": "同上", "hours_sat": "9:00-21:00",
  "hours_sun": "9:00-17:00",
  "hours_note": "休館日等",
  "reservation_method": "Web予約 / 電話のみ / 予約不要",
  "facility_courts": [{
    "court_type": "インドア / アウトドア",
    "number_of_courts": 2,
    "surface_type": "体育館床(木製) / ハードコート / 人工芝",
    "line_visibility": "専用ラインのみ(見やすい) / 他競技混在(見にくい) / テープ貼り",
    "net_type": "常設(埋め込み) / ポータブル(キャスター付) / ポータブル(キャスター無)",
    "has_ac": 0,
    "baseline_margin": "標準 / 広い / 狭い / null",
    "lighting_type": "LED照明 / 屋内照明 / 照明なし / null"
  }],
  "facility_shops": {
    "has_paddle_sales": 0, "has_apparel_sales": 0,
    "has_paddle_rental": 0, "paddle_rental_fee": null,
    "handled_brands": null
  },
  "price_info": { "base_fee": "利用料金" },
  "access": "最寄り駅からのアクセス",
  "notes": "特記事項",
  "directions_url": "Google Maps経路URL",
  "access_info": { "guide": "補足", "directions_url": "同上" },
  "_region": "東北", "_region_romaji": "tohoku"
}
```
**目標**: 最低20件、できれば30件。各県最低2-3件。

---

## タスク2（中）: 施設コートデータの補完

`production_data/facilities/facility_courts.json` (215件) について:
- `number_of_courts` が `null` のレコードを特定し、施設公式サイトで調査して補完
- `surface_type` が「不明」のレコードを調査して正確な値に更新

---

## タスク3（中）: 施設ショップデータの補完

`production_data/facilities/facility_shops.json` (213件) について:
- `handled_brands` が空のレコードで、パドル販売をしている施設の取扱ブランドを調査
- `paddle_rental_fee` が `null` のレコードで、レンタルありの施設の料金を調査

---

## タスク4（中）: 施設メディア大幅追加

`production_data/facilities/facility_media.json` (現在5件 → 目標25件以上)
- `facilities.json` の主要施設（`is_premium: true` や専用コート施設）のYouTube紹介動画・公式Instagram URLを調査
```json
{
  "id": "media_施設略称_連番",
  "target_type": "facility",
  "target_id": "施設名",
  "media_type": "youtube / instagram / image",
  "url": "実在するURL",
  "description": "メディアの説明"
}
```

---

## タスク5（中）: イベント・大会の情報補完

`production_data/events/events.json` (25件) の50%欠損を補完:
- `start_datetime` / `end_datetime` - 開催日時
- `entry_fee` - 参加費（円）
- `entry_url` - エントリーURL
- `facility_id` - 開催施設インデックス
- `event_type` - 公式大会(JPA等) / 草大会 / 体験会 / オープンプレイ / 練習会 / レッスン

**情報源**: JPA公式サイト、各大会主催団体SNS、施設イベントカレンダー

---

## タスク6（小）: アワード情報の拡充

`production_data/events/awards.json` (2件 → 目標5件)
- ピックルボール業界のアワード・表彰（国内外）を調査して追加

---

## タスク7（小）: 料金ガイドの拡充

`production_data/supplementary/price_guide.json` (1件 → 目標5件)
- 地域別・施設タイプ別の料金相場ガイドを追加

---

## タスク8（小）: 協会情報の追加

`production_data/supplementary/master_associations.json` (2件)
- 各地域のピックルボール協会（JPA支部、都道府県協会）の情報を調査して追加

---

## タスク9（小）: お知らせデータの補完

`production_data/community/announcements.json` (5件)
- `published_at` (60%欠損) と `is_important` (60%欠損) を補完

---

## タスク10（小）: プレイログ構造確認

`production_data/community/activity_logs.json` (5件)
- DBスキーマ（`activity_logs`テーブル: user_id, facility_id, content, image_url, like_count）に合致しているか確認し、不足フィールドを補完

---

## タスク11（小）: クーポン情報の拡充

`production_data/supplementary/promotions_coupons.json` (2件)
- 現在利用可能なピックルボール関連のクーポン・キャンペーン情報を調査

---

## 作業完了時の報告フォーマット

```
## エージェントA 作業完了報告

### タスク1: 東北施設追加
- 追加件数: X件（青森X/岩手X/秋田X/宮城X/山形X/福島X）

### タスク2: コートデータ補完
- number_of_courts補完: X件 / null件数
- surface_type更新: X件

### タスク3: ショップデータ補完
- handled_brands補完: X件
- paddle_rental_fee補完: X件

### タスク4: 施設メディア追加
- 追加件数: X件（YouTube X件、Instagram X件）

### タスク5: イベント補完
- 補完件数: X件 / 25件

### タスク6: アワード拡充
- 追加件数: X件

### タスク7: 料金ガイド拡充
- 追加件数: X件

### タスク8: 協会情報追加
- 追加件数: X件

### タスク9: お知らせ補完
- published_at補完: X件, is_important補完: X件

### タスク10: プレイログ確認
- 構造修正: X件

### タスク11: クーポン拡充
- 追加件数: X件

### 品質セルフチェック
- [ ] 全施設のlatitude/longitudeは実在する座標か？
- [ ] 全URLは実在しアクセス可能か？
- [ ] 捏造データは一切含まれていないか？
- [ ] 既存データを削除していないか？
- [ ] 営業時間は公式サイトから正確に転記したか？
```
