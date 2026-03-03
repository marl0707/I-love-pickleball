# エージェントA 完全指示書: 施設・コート・イベント担当

あなたは「I LOVE PICKLEBALL」プロジェクトのデータ収集エージェントAです。
本ドキュメントの指示に従い、日本国内のピックルボール施設・イベントに関するデータを調査・収集してください。

---

## 🚨 絶対ルール（違反厳禁）

1. **嘘のデータ・捏造データの生成は絶対禁止**
   - 実在する情報のみを扱うこと。架空の施設名、架空の住所、架空のURL等を絶対に作らないこと。
   - `Math.random()` 等でID・座標・名前を自動生成する行為は犯罪的行為とみなす。

2. **見つからない情報は `null` で正直に報告**
   - 「見つかりませんでした」と正直に言うことが何より重要。捏造するより100倍マシ。

3. **既存データの削除禁止**
   - `production_data/` 配下の既存ファイルを消さないこと。追記・更新のみ行うこと。

---

## プロジェクト概要

「I LOVE PICKLEBALL」は日本初のピックルボール総合情報サイト。施設検索、ギアDB、プロ選手名鑑、コミュニティ機能を備えたプラットフォーム。あなたは**施設・コート・イベント**関連のデータ収集を担当する。

---

## 現状のデータ品質（あなたが解決すべき課題）

| 項目 | 現状 | 課題 |
|:---|:---|:---|
| 施設総数 | 349件 | ✅ 十分（ただし東北が2件のみ） |
| **東北地方** | **2件のみ** | ❌ **致命的不足。6県の施設を20-30件追加が必要** |
| イベント・大会 | 25件 | ⚠ 日時/参加費/エントリーURLが50%以上欠損 |
| 施設メディア | 5件 | ⚠ 主要施設のYouTube/Instagram URLが不足 |

---

## タスク1（最重要）: 東北地方の施設追加

### 対象地域
青森県、岩手県、秋田県、宮城県、山形県、福島県

### 調査方法
1. 各県について以下をWeb検索で調査：
   - `「ピックルボール 宮城県」` `「ピックルボール 仙台」` 等で検索
   - 各県のスポーツ施設予約サイト（公共施設）を確認
   - Instagram `#ピックルボール #仙台` 等で活動場所を特定
   - Google Maps で「ピックルボール」を検索
2. 専用施設だけでなく、**体育館を間借りして定期的にピックルボールが行われている施設**も対象

### 出力フォーマット（1施設あたり）

各施設を以下のJSON形式で記録し、`production_data/facilities/facilities.json` の配列に追加してください。

```json
{
  "name": "施設名（正式名称）",
  "prefecture": "県名（例: 宮城県）",
  "city": "市区町村（例: 仙台市青葉区）",
  "address": "〒000-0000 完全な住所",
  "latitude": 38.2682,
  "longitude": 140.8694,
  "google_maps_url": "https://maps.google.com/?q=緯度,経度",
  "website_url": "公式サイトURL（なければnull）",
  "type_flag": 1,
  "operator_type": "民間 or 自治体(公営) or 専門店",
  "is_premium": false,
  "hosts_tournaments": false,
  "tournament_types": null,
  "visitor_welcome": true,
  "has_school": false,
  "facility_amenities": {
    "has_shower": 0,
    "has_locker_room": 1,
    "has_cafe": 0,
    "has_kids_space": 0,
    "has_parking": 1,
    "parking_detail": "駐車場の詳細（X台、料金等）",
    "has_wifi": 0,
    "is_indoor": true,
    "paddle_rental": false,
    "court_surface": "ウッド（木・体育館） or ハード or 人工芝 or 不明",
    "visitor_welcome": true
  },
  "hours_mon": "9:00-21:00（不明ならnull）",
  "hours_tue": "9:00-21:00",
  "hours_wed": "9:00-21:00",
  "hours_thu": "9:00-21:00",
  "hours_fri": "9:00-21:00",
  "hours_sat": "9:00-21:00",
  "hours_sun": "9:00-17:00",
  "hours_note": "補足（休館日等）",
  "reservation_method": "Web予約 or 電話のみ or 予約不要",
  "facility_courts": [
    {
      "court_type": "インドア or アウトドア",
      "number_of_courts": 2,
      "surface_type": "体育館床(木製) or ハードコート or 人工芝 等",
      "line_visibility": "専用ラインのみ(見やすい) or 他競技混在(見にくい) or テープ貼り",
      "net_type": "常設(埋め込み) or ポータブル(キャスター付) or ポータブル(キャスター無)",
      "has_ac": 0,
      "baseline_margin": "標準 or 広い or 狭い or null",
      "lighting_type": "LED照明 or 屋内照明 or 照明なし or null"
    }
  ],
  "facility_shops": {
    "has_paddle_sales": 0,
    "has_apparel_sales": 0,
    "has_paddle_rental": 0,
    "paddle_rental_fee": null,
    "handled_brands": null
  },
  "price_info": {
    "base_fee": "利用料金（例: 個人利用300円/2h）"
  },
  "access": "最寄り駅からのアクセス方法",
  "notes": "特記事項",
  "directions_url": "https://www.google.com/maps/dir/?api=1&destination=エンコード済み住所",
  "access_info": {
    "guide": "アクセスの補足説明",
    "directions_url": "上記と同じ"
  },
  "_region": "東北",
  "_region_romaji": "tohoku"
}
```

### latitude/longitude の取得方法
- Google Maps で施設を検索し、URLに含まれる座標を使用
- 住所がわかっている場合は Google Maps Geocoding で変換
- **絶対に適当な数値を入れないこと**。わからなければ `null`

### 目標件数
- **最低20件、できれば30件**
- 各県最低2-3件は確保したい

---

## タスク2: イベント・大会データの補完

### 現状の問題
`production_data/events/events.json` の既存25件のうち、以下が50%以上欠損:
- `start_datetime` / `end_datetime`（開催日時）
- `entry_fee`（参加費）
- `entry_url`（エントリーURL）
- `facility_id`（開催施設のインデックス）
- `event_type`（分類）

### やること
既存の25件を1件ずつ確認し、不足情報をWeb検索で調査して補完する。

### 出力フォーマット（eventsテーブル準拠）

```json
{
  "id": "既存IDをそのまま維持",
  "title": "大会・イベント名",
  "event_type": "公式大会(JPA等) or 草大会 or 体験会 or オープンプレイ or 練習会 or レッスン",
  "start_datetime": "2026-04-15T09:00:00",
  "end_datetime": "2026-04-15T17:00:00",
  "target_level_min": 1.0,
  "target_level_max": 5.0,
  "entry_fee": 3000,
  "entry_url": "https://example.com/entry",
  "facility_id": null,
  "location": "開催場所のテキスト表記",
  "description": "イベントの説明"
}
```

### 情報源
- JPA（日本ピックルボール協会）公式サイト
- 各地域のピックルボール協会のSNS（Instagram, X）
- 施設公式サイトのイベントカレンダー

---

## タスク3: 施設メディアの補完

### やること
`production_data/facilities/facilities.json` の主要施設（特に `is_premium: true` や専用コートを持つ施設）について：
- 実在するYouTube紹介動画のURLを調査
- 公式InstagramアカウントのURLを調査

### 出力フォーマット（facility_mediaテーブル準拠）

```json
{
  "id": "media_施設名の略称_連番",
  "target_type": "facility",
  "target_id": "施設名（テキスト参照）",
  "media_type": "youtube or instagram or image",
  "url": "実在するURL",
  "description": "メディアの説明"
}
```

`production_data/facilities/facility_media.json` に追記する。

---

## 出力先まとめ

| ファイル | 操作 |
|:---|:---|
| `production_data/facilities/facilities.json` | 東北施設を配列に**追加** |
| `production_data/events/events.json` | 既存レコードの欠損フィールドを**補完** |
| `production_data/facilities/facility_media.json` | メディア情報を配列に**追加** |

---

## 作業完了時の報告フォーマット

作業が完了したら、以下の形式で報告してください：

```
## エージェントA 作業完了報告

### 東北施設追加
- 追加件数: X件
- 県別内訳: 青森X件、岩手X件、秋田X件、宮城X件、山形X件、福島X件
- 見つからなかった県: （あれば記載）

### イベント補完
- 補完件数: X件 / 25件中
- 補完できなかった件数: X件（理由: ...）

### 施設メディア追加
- 追加件数: X件

### 品質セルフチェック
- [ ] 全施設のlatitude/longitudeは実在する座標か？（Google Mapsで確認済みか？）
- [ ] 全URLは実在しアクセス可能か？
- [ ] 捏造データは一切含まれていないか？
- [ ] 既存データを削除・上書きしていないか？
```

---

## 補足: データ品質基準（コンテンツガイドライン準拠）

### 施設データで特に重要なフィールド
1. **`visitor_welcome`** - 非会員・ドロップインが歓迎されるか → 初心者の参加ハードルに直結
2. **`paddle_rental`** - パドルレンタルの有無 → 初心者が手ぶらで行けるかの生命線
3. **`court_surface`** - サーフェス（床材）→ ボールの弾みに影響する重要情報
4. **`has_ac`** - 空調の有無（インドアの場合）→ 快適性の重要指標

### 営業時間の記載ルール
- 公式サイトから正確に転記
- 不明な場合は `null` にし、`hours_note` に「要確認」と記載
- **推測で時間を書かないこと**
