# エージェントB 完全指示書: ギア・レビュー・ブランド関連 + 補助データ

あなたは「I LOVE PICKLEBALL」プロジェクトのデータ収集エージェントBです。
本ドキュメントに記載された**全てのタスク**を実行してください。一つも飛ばさないこと。

---

## 🚨 絶対ルール（違反厳禁）

1. **嘘のデータ・捏造データの生成は絶対禁止** - 実在する商品情報のみ。架空スペック禁止。
2. **見つからない情報は `null` で正直に報告** - 推測で数値を埋めるの禁止。
3. **既存データの削除禁止** - 追記・更新のみ。
4. **ECリンクはYahoo!ショッピング最優先** - 収益最大化のため。

---

## あなたの担当ファイル一覧（全12ファイル）

| # | ファイルパス | 現在の件数 | 主な作業 |
|:--|:---|---:|:---|
| 1 | `production_data/gears/paddles.json` | 105件 | 重複除去 + 全フィールド補完 + ECリンク |
| 2 | `production_data/gears/shoes.json` | 35件 | size_range/court_type補完 |
| 3 | `production_data/gears/balls.json` | 26件 | grade/ball_type正規化・補完 |
| 4 | `production_data/gears/apparel.json` | 31件 | category/material/ball_pocket/design大幅補完 |
| 5 | `production_data/gears/bags.json` | 17件 | PB特化機能（fence_hook等）全補完 |
| 6 | `production_data/gears/accessories.json` | 42件 | specific_features補完 |
| 7 | `production_data/players/expert_reviews.json` | 29件 | DBスキーマへの正規化 + 補完 |
| 8 | `production_data/supplementary/brands.json` | 4件 | ブランド情報の大幅拡充（目標15件） |
| 9 | `production_data/supplementary/niche_gears.json` | 15件 | フィールド補完・スキーマ整合 |
| 10 | `production_data/supplementary/master_tags.json` | 3件 | タグマスタの拡充 |
| 11 | `production_data/supplementary/user_bookmarks.json` | 7件 | フィールド構造確認 |
| 12 | `production_data/supplementary/users_mock.json` | 56件 | フィールド構造のスキーマ整合確認 |

---

## タスク1（大）: パドルデータの整備

### やること
1. **重複チェック**: `brand_name` + `product_name` が同じレコードを特定し、情報が多い方を残す
2. **全フィールド補完**（nullのものを埋める）:

```json
{
  "id": "paddle_ブランド名_モデル名_コア厚",
  "brand_name": "JOOLA / Franklin / Selkirk / CRBN / Six Zero / Vatic Pro 等",
  "product_name": "正式な製品名",
  "price": 38500,
  "paddle_shape": "Elongated(長方形) / Standard(標準) / Wide Body(幅広) / Hybrid",
  "face_material": "Raw Carbon Fiber / Fiberglass / Kevlar / Graphite",
  "core_material": "Polymer Honeycomb / Nomex",
  "core_thickness": 16.0,
  "target_demographic": "上級者 / 中級者 / 初心者 / ジュニア / 女性向け",
  "design_taste": "シンプル / ポップ / スポーティー / ラグジュアリー",
  "color_variations": ["ブラック", "ネオンピンク"],
  "amazon_url": "https://www.amazon.co.jp/dp/XXX（商品個別ページ優先）",
  "rakuten_url": "https://item.rakuten.co.jp/shop/item/",
  "yahoo_url": "https://shopping.yahoo.co.jp/product/XXX（★最優先で取得★）"
}
```

**情報源**: メーカー公式サイトの「Specs」タブ、Amazon.co.jp、Yahoo!ショッピング、楽天市場

---

## タスク2（中）: シューズデータの補完

35件の以下を補完:
```json
{
  "size_range": "22.5cm - 29.0cm",
  "court_type": "インドア専用(ガムソール) / アウトドア専用 / オールコート",
  "color_variations": ["ホワイト/ネイビー"],
  "yahoo_url": "★最優先★"
}
```
- **ガムソール（飴色柔らかいソール）** → インドア専用
- **硬めラバーソール** → アウトドア専用
- **メーカー「All Court」表記** → オールコート

---

## タスク3（小）: ボールデータの正規化・補完

26件の以下を補完:
```json
{
  "grade": "公式大会使用球(USAP承認) / 準公式球 / 練習用",
  "ball_type": "インドア用(26穴) / アウトドア用(40穴)",
  "color_variations": ["ネオンイエロー"]
}
```
- **26穴** → インドア用（柔らかい）, **40穴** → アウトドア用（硬い）

---

## タスク4（中）: アパレルデータの大幅補完

31件の以下を補完:
```json
{
  "category": "トップス(Tシャツ/ポロ) / ボトムス(ショーツ) / スコート/スカート / ワンピース / アウター",
  "target_gender": "Womens / Mens / Unisex / Kids",
  "material_features": "吸汗速乾 / 接触冷感 / UVカット / ストレッチ / 軽量",
  "has_ball_pocket": true,
  "design_taste": "プリーツ / フリル / スポーティー / クラシック / パステルカラー",
  "size_range": "XS, S, M, L, XL"
}
```
- **`has_ball_pocket`**: 商品説明に「ball pocket」「ボール収納」あれば `true` ← **PB特化の超重要フィールド**
- **`material_features`**: 「DRI-FIT」→吸汗速乾、「UV Protection」→UVカット

---

## タスク5（中）: バッグデータの大幅補完

17件の以下を補完:
```json
{
  "bag_type": "バックパック / トートバッグ / ダッフルバッグ / スリングバッグ",
  "paddle_capacity": 2,
  "has_shoe_pocket": true,
  "has_fence_hook": true,
  "has_thermal_pocket": false
}
```
- **`has_fence_hook`**: コートフェンスに掛けるフック。「fence hook」記述で判定 ← **PB特化**
- **`paddle_capacity`**: 「holds X paddles」から取得

---

## タスク6（中）: アクセサリーデータの補完

42件の以下を補完:
```json
{
  "category": "グリップテープ / アイウェア(保護メガネ) / サンバイザー/キャップ / リストバンド / タオル / ソックス",
  "specific_features": "ドライ/ウェット（グリップ）, 曇り止め/調光レンズ（アイウェア）等"
}
```

---

## タスク7（中）: 専門家レビューの正規化

`production_data/players/expert_reviews.json` (29件) をDBスキーマに合わせて正規化:
```json
{
  "id": "review_連番",
  "item_type": "paddle / shoe / ball / apparel",
  "item_id": "対象ギアのID（gears_xxxテーブルのIDと紐付け）",
  "player_id": "pro_playersテーブルのID（プロ選手の場合）",
  "expert_name": "プロDBにない専門家名（公認コーチ等）",
  "score": 8.5,
  "comment": "レビューコメント"
}
```
- 既存データの構造がスキーマと異なる場合、変換して統一する
- `item_id` と `player_id` は他テーブルとの紐付けを確認

---

## タスク8（中）: ブランドマスタの拡充

`production_data/supplementary/brands.json` (4件 → 目標15件以上)
- ピックルボール主要ブランドを全て追加:
```json
{
  "id": "brand_joola",
  "name": "JOOLA",
  "country": "USA/Germany",
  "product_categories": ["パドル", "ボール", "アパレル", "バッグ"],
  "website_url": "https://joolausa.com/",
  "description": "ブランド概要"
}
```
追加すべきブランド: JOOLA, Franklin, Selkirk, CRBN, Six Zero, Vatic Pro, Engage, Paddletek, HEAD, Prince, Onix, Diadem, Babolat, K-Swiss, FILA, Skechers 等

---

## タスク9（小）: ニッチギアの整備

`production_data/supplementary/niche_gears.json` (15件)
- DBスキーマの `gears_accessories` テーブルのフィールドに合致するか確認
- 不足フィールド（price, category, specific_features等）を補完

---

## タスク10（小）: タグマスタの拡充

`production_data/supplementary/master_tags.json` (3件)
- ギア・施設・コミュニティに使うタグの拡充（初心者向け、上級者向け、インドア、アウトドア等）

---

## タスク11（小）: ユーザーブックマーク構造確認

`production_data/supplementary/user_bookmarks.json` (7件)
- DBスキーマ（`user_bookmarks`: user_id, item_type, item_id）に合致しているか確認

---

## タスク12（小）: ユーザーモック構造確認

`production_data/supplementary/users_mock.json` (56件)
- DBスキーマ（`users`: nickname, generation, gender, dupr_score, estimated_level, play_style等）に合致しているか確認し、不足フィールドを補完

---

## 作業完了時の報告フォーマット

```
## エージェントB 作業完了報告

### タスク1: パドル整備
- 重複除去: X件削除 → 残りY件
- フィールド補完: X件, Yahoo!URL取得: X件

### タスク2: シューズ補完
- size_range: X件, court_type: X件

### タスク3: ボール補完
- grade: X件, ball_type: X件

### タスク4: アパレル補完
- has_ball_pocket: X件, design_taste: X件, material_features: X件

### タスク5: バッグ補完
- paddle_capacity: X件, has_fence_hook: X件

### タスク6: アクセサリー補完
- specific_features: X件

### タスク7: レビュー正規化
- 正規化: X件, item_id紐付け: X件

### タスク8: ブランド拡充
- 追加: X件

### タスク9: ニッチギア整備
- 補完: X件

### タスク10: タグマスタ拡充
- 追加: X件

### タスク11: ブックマーク確認
- 修正: X件

### タスク12: ユーザーモック確認
- 修正: X件

### 品質セルフチェック
- [ ] 全数値スペックはメーカー公式サイトから正確に転記したか？
- [ ] Yahoo!ショッピングURLを最優先で取得したか？
- [ ] PB特化フィールドを商品説明から判定したか？
- [ ] 推測で数値を埋めていないか？（不明はnull）
- [ ] 捏造データは一切含まれていないか？
```
