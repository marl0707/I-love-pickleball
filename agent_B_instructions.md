# エージェントB 完全指示書: ギア全6カテゴリ担当

あなたは「I LOVE PICKLEBALL」プロジェクトのデータ収集エージェントBです。
本ドキュメントの指示に従い、ピックルボール用ギア（パドル・シューズ・ボール・アパレル・バッグ・アクセサリー）のデータを調査・補完してください。

---

## 🚨 絶対ルール（違反厳禁）

1. **嘘のデータ・捏造データの生成は絶対禁止**
   - 実在する商品情報のみを扱うこと。架空の商品名、架空のスペック、架空のURL等を絶対に作らないこと。
   - `Math.random()` 等でデータを自動生成する行為は犯罪的行為とみなす。

2. **見つからない情報は `null` で正直に報告**
   - 「見つかりませんでした」と正直に言うことが何より重要。

3. **既存データの削除禁止**
   - `production_data/` 配下の既存ファイルを消さないこと。フィールドの追記・更新のみ行うこと。

4. **数値スペックの推測禁止**
   - 価格、コア厚、重量などの数値は**メーカー公式サイトから正確に転記**すること。
   - 推測・概算で数値を埋めることは禁止。不明なら `null`。

---

## プロジェクト概要

「I LOVE PICKLEBALL」は日本初のピックルボール総合情報サイト。ギアDBは**アフィリエイト収益の核**であり、正確なスペック情報と購入リンクが最重要。**Yahoo!ショッピングのリンクを最優先**で取得すること。

---

## 現状のデータ品質（あなたが解決すべき課題）

| カテゴリ | 件数 | 主な課題 |
|:---|---:|:---|
| パドル | 105件 | 重複の可能性あり、ECリンクが検索URLのみ |
| シューズ | 35件 | `size_range`, `court_type` が大幅欠損 |
| ボール | 26件 | `grade`, `ball_type`（穴数）が不完全 |
| アパレル | 31件 | `has_ball_pocket`, `design_taste` がほぼ全欠損 |
| バッグ | 17件 | PB特化機能（フェンスフック等）が全欠損 |
| アクセサリー | 42件 | `specific_features` が不完全 |

---

## タスク1: パドルデータの整備

### やること
1. `production_data/gears/paddles.json` (105件) を開く
2. 重複チェック: `brand_name` + `product_name` が同じレコードがあれば、情報が多い方を残す
3. 各パドルの以下のフィールドを補完（`null` のものを埋める）

### 補完対象フィールドとDBスキーマ

```json
{
  "id": "paddle_ブランド名_モデル名_コア厚",
  "brand_name": "JOOLA / Franklin / Selkirk / CRBN / Six Zero / Vatic Pro / Engage 等",
  "product_name": "正式な製品名",
  "price": 38500,
  "paddle_shape": "Elongated(長方形) / Standard(標準) / Wide Body(幅広) / Hybrid",
  "face_material": "Raw Carbon Fiber / Fiberglass / Kevlar / Graphite",
  "core_material": "Polymer Honeycomb / Nomex",
  "core_thickness": 16.0,
  "target_demographic": "上級者 / 中級者 / 初心者 / ジュニア / 女性向け",
  "design_taste": "シンプル / ポップ / スポーティー / ラグジュアリー",
  "color_variations": ["ブラック", "ネオンピンク"],
  "amazon_url": "https://www.amazon.co.jp/dp/XXXXXXXXXX",
  "rakuten_url": "https://item.rakuten.co.jp/shop/item/",
  "yahoo_url": "https://shopping.yahoo.co.jp/product/XXXXX"
}
```

### ECリンクの取得ルール（最重要）
1. **Yahoo!ショッピング最優先**: まずYahoo!ショッピングで商品を検索し、商品ページURLを取得
2. 次にAmazon.co.jpの商品ページURL
3. 最後に楽天市場
4. 検索結果URLではなく**商品個別ページのURL**が望ましい。ただし商品個別ページが見つからない場合は検索URLでも可

### 情報源
- メーカー公式サイトの「Specs」「仕様」タブ
- Amazon.co.jp / Yahoo!ショッピング / 楽天市場

---

## タスク2: シューズデータの補完

### 補完対象フィールドとDBスキーマ

```json
{
  "id": "shoe_ブランド名_モデル名",
  "brand_name": "K-Swiss / FILA / Skechers / Babolat / Asics 等",
  "product_name": "正式な製品名",
  "size_range": "22.5cm - 29.0cm",
  "color_variations": ["ホワイト/ネイビー", "グレー/ピンク"],
  "court_type": "インドア専用(ガムソール) / アウトドア専用 / オールコート",
  "amazon_url": "...",
  "rakuten_url": "...",
  "yahoo_url": "..."
}
```

### 特に重要
- `court_type` はソールの素材・パターンで判断:
  - **ガムソール（飴色の柔らかいソール）** → インドア専用
  - **硬めのラバーソール** → アウトドア専用
  - **メーカーが「All Court」と表記** → オールコート
- `size_range` はメーカー公式の展開サイズから取得

---

## タスク3: ボールデータの正規化・補完

### 補完対象フィールドとDBスキーマ

```json
{
  "id": "ball_ブランド名_モデル名",
  "brand_name": "Franklin / Dura / Vulcan / CORE / Onix 等",
  "product_name": "正式な製品名",
  "grade": "公式大会使用球(USAP承認) / 準公式球 / 練習用",
  "ball_type": "インドア用(26穴) / アウトドア用(40穴)",
  "color_variations": ["ネオンイエロー", "オレンジ"],
  "amazon_url": "...",
  "rakuten_url": "...",
  "yahoo_url": "..."
}
```

### 特に重要
- **穴の数**でインドア/アウトドアが決まる:
  - **26穴** → インドア用（柔らかい、静か）
  - **40穴** → アウトドア用（硬い、風に強い）
- `grade` はUSAP（USA Pickleball）承認マークの有無で判定

---

## タスク4: アパレルデータの大幅補完

### 補完対象フィールドとDBスキーマ

```json
{
  "id": "apparel_ブランド名_モデル名",
  "brand_name": "Lululemon / FILA / Nike / Adidas 等",
  "product_name": "正式な製品名",
  "price": 8900,
  "category": "トップス(Tシャツ/ポロ) / ボトムス(ショーツ) / スコート/スカート / ワンピース / アウター",
  "target_gender": "Womens(女性用) / Mens(男性用) / Unisex(男女兼用) / Kids",
  "material_features": "吸汗速乾 / 接触冷感 / UVカット / ストレッチ / 軽量",
  "has_ball_pocket": true,
  "design_taste": "プリーツ / フリル / スポーティー / クラシック / パステルカラー",
  "size_range": "XS, S, M, L, XL",
  "color_variations": ["ホワイト", "ネイビー", "ペールピンク"],
  "amazon_url": "...",
  "rakuten_url": "...",
  "yahoo_url": "..."
}
```

### 特に重要
- **`has_ball_pocket`** は超重要フィールド。商品説明に「ball pocket」「ボール収納」「インナーショーツにポケット」等の記述があれば `true`
- **`material_features`** は商品説明文のキーワードから判定（「DRI-FIT」→ 吸汗速乾、「UV Protection」→ UVカット等）

---

## タスク5: バッグデータの大幅補完

### 補完対象フィールドとDBスキーマ

```json
{
  "id": "bag_ブランド名_モデル名",
  "brand_name": "ブランド名",
  "product_name": "正式な製品名",
  "price": 12000,
  "bag_type": "バックパック / トートバッグ / ダッフルバッグ / スリングバッグ",
  "paddle_capacity": 2,
  "has_shoe_pocket": true,
  "has_fence_hook": true,
  "has_thermal_pocket": false,
  "color_variations": ["ブラック", "ネイビー"],
  "amazon_url": "...",
  "rakuten_url": "...",
  "yahoo_url": "..."
}
```

### 特に重要（PB特化フィールド）
- **`has_fence_hook`** → コートのフェンスに引っ掛けるフック。商品説明に「fence hook」「フェンスフック」の記述で判定
- **`paddle_capacity`** → パドルを何本入れられるか。商品説明の「holds X paddles」から取得
- **`has_thermal_pocket`** → 保冷ポケット。「insulated pocket」「thermal pocket」の記述で判定

---

## タスク6: アクセサリーデータの補完

### 補完対象フィールドとDBスキーマ

```json
{
  "id": "acc_ブランド名_モデル名",
  "brand_name": "ブランド名",
  "product_name": "正式な製品名",
  "price": 1500,
  "category": "グリップテープ / アイウェア(保護メガネ) / サンバイザー/キャップ / リストバンド / タオル / ソックス",
  "specific_features": "ドライ/ウェット（グリップ）, 曇り止め/調光レンズ（アイウェア）等",
  "color_variations": ["ブラック", "ホワイト"],
  "amazon_url": "...",
  "rakuten_url": "...",
  "yahoo_url": "..."
}
```

---

## 出力先まとめ

| ファイル | 操作 |
|:---|:---|
| `production_data/gears/paddles.json` | 重複除去 + フィールド補完 |
| `production_data/gears/shoes.json` | フィールド補完 |
| `production_data/gears/balls.json` | 正規化 + フィールド補完 |
| `production_data/gears/apparel.json` | フィールド大幅補完 |
| `production_data/gears/bags.json` | フィールド大幅補完 |
| `production_data/gears/accessories.json` | フィールド補完 |

---

## 作業完了時の報告フォーマット

```
## エージェントB 作業完了報告

### パドル (paddles.json)
- 重複除去: X件削除 → 残りY件
- フィールド補完: X件のレコードでZ個のフィールドを補完
- Yahoo!ショッピングURL取得: X件

### シューズ (shoes.json)
- size_range補完: X件 / 35件
- court_type補完: X件 / 35件

### ボール (balls.json)
- grade補完: X件 / 26件
- ball_type補完: X件 / 26件

### アパレル (apparel.json)
- has_ball_pocket判定: X件 / 31件
- design_taste設定: X件 / 31件
- material_features設定: X件 / 31件

### バッグ (bags.json)
- paddle_capacity設定: X件 / 17件
- has_fence_hook判定: X件 / 17件

### アクセサリー (accessories.json)
- specific_features補完: X件 / 42件

### 品質セルフチェック
- [ ] 全数値スペック（価格、コア厚等）はメーカー公式サイトから転記したか？
- [ ] Yahoo!ショッピングURLを最優先で取得したか？
- [ ] PB特化フィールド（ball_pocket, fence_hook等）を商品説明から判定したか？
- [ ] 推測で数値を埋めていないか？（不明はnull）
- [ ] 捏造データは一切含まれていないか？
```
