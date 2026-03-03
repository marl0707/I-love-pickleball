# エージェントC 完全指示書: 人物・コミュニティ・コンテンツ関連 + 補助データ

あなたは「I LOVE PICKLEBALL」プロジェクトのデータ収集エージェントCです。
本ドキュメントに記載された**全てのタスク**を実行してください。一つも飛ばさないこと。

---

## 🚨 絶対ルール（違反厳禁）

1. **嘘のデータ・捏造データの生成は絶対禁止** - 実在する人物・動画・URLのみ。架空選手禁止。
2. **見つからない情報は `null` で正直に報告** - 捏造するより100倍マシ。
3. **既存データの削除禁止** - 追記・更新のみ。

---

## あなたの担当ファイル一覧（全12ファイル）

| # | ファイルパス | 現在の件数 | 主な作業 |
|:--|:---|---:|:---|
| 1 | `production_data/players/pro_players.json` | 46件 | 使用ギア紐付け(21名) + 国内選手8件追加 |
| 2 | `production_data/community/communities.json` | 55件 | schedule/frequency/URL等の大幅補完 |
| 3 | `production_data/community/community_media.json` | 3件 | サークル紹介動画の追加（目標15件） |
| 4 | `production_data/community/threads.json` | 5件 | フィールド構造の正規化確認 |
| 5 | `production_data/content/drills.json` | 35件 | youtube_url 50%欠損の補完 |
| 6 | `production_data/content/articles.json` | 47件 | リレーションID（gear/facility/player）補完 |
| 7 | `production_data/content/glossary.json` | 55件 | 重要用語の不足確認・追加 |
| 8 | `production_data/supplementary/advanced_shots.json` | 3件 | 戦術データ 3件→10件に拡充 |
| 9 | `production_data/supplementary/coaches.json` | 12件 | コーチ情報の補完・拡充 |
| 10 | `production_data/supplementary/certifications.json` | 8件 | 認定資格情報の補完 |
| 11 | `production_data/supplementary/injury_prevention.json` | 16件 | ケガ予防情報の補完 |
| 12 | `production_data/supplementary/mlp_teams.json` | 16件 | MLPチーム情報の更新・補完 |

---

## タスク1（最重要・大）: プロ選手の使用ギア紐付け

### 現状
世界トッププロ24件のうち **`paddle_ids` 79%欠損・`shoe_ids` 83%欠損**。

### 補完が必要な21名

| 選手名 | 補完フィールド |
|:---|:---|
| Federico Staksrud | paddle_ids, shoe_ids |
| Jack Sock | paddle_ids, shoe_ids, apparel_brand_sponsor |
| Catherine Parenteau | paddle_ids, shoe_ids |
| Lea Jansen | paddle_ids, shoe_ids |
| Matt Wright | paddle_ids, shoe_ids |
| JW Johnson | paddle_ids, shoe_ids |
| Jackie Kawamoto | paddle_ids, shoe_ids, apparel_brand_sponsor |
| Callie Smith | paddle_ids, shoe_ids |
| Vivienne David | paddle_ids, shoe_ids, apparel_brand_sponsor |
| Dylan Frazier | paddle_ids, shoe_ids |
| Anna Bright | paddle_ids, shoe_ids |
| Salome Devidze | paddle_ids, shoe_ids, apparel_brand_sponsor, instagram_url |
| Andrei Daescu | paddle_ids, shoe_ids, apparel_brand_sponsor |
| Thomas Wilson | paddle_ids, shoe_ids, apparel_brand_sponsor, instagram_url |
| Dekel Bar | paddle_ids, shoe_ids, apparel_brand_sponsor, instagram_url |
| Irina Tereschenko | paddle_ids, shoe_ids |
| Zane Navratil | paddle_ids, shoe_ids |
| Georgia Johnson | paddle_ids, shoe_ids |
| Etta Wright | paddle_ids, shoe_ids, apparel_brand_sponsor, instagram_url |
| + シニアプロ3名 | 全フィールド確認 |
| + salvaged選手17名 | 全フィールド確認 |

### 全46件共通で補完すべきフィールド
- `photo_url` - PPA Tour選手プロフィール写真URL
- `facebook_url` - Facebookページ（あれば）
- `x_url` - X(Twitter)アカウント（あれば）
- `birth_date` - nullの選手を補完

### 調査先
1. **PPA Tour公式** (ppatour.com) → "Equipment"セクション
2. **Instagram** → プロフィール欄のメンション
3. **DUPR** (mydupr.com) → ランキング
4. **YouTube** → 試合動画でパドルロゴ確認（参考程度）

### 出力フォーマット
```json
{
  "id": "pro_名前のスネークケース",
  "name_ja": "日本語名", "name_en": "English Name",
  "nationality": "国名", "birth_date": "1990-01-15",
  "play_style": "プレースタイル",
  "league_affiliation": "PPA Tour / MLP / APP / JPA",
  "ranking_singles": 1, "ranking_doubles": 1,
  "participating_tournaments": "主な出場大会",
  "paddle_ids": "paddle_joola_perseus_16",
  "shoe_ids": "shoe_kswiss_express_light",
  "apparel_brand_sponsor": "JOOLA",
  "instagram_url": "https://www.instagram.com/username",
  "facebook_url": "URL or null", "x_url": "URL or null",
  "photo_url": "https://ppatour.com/player/photo.jpg",
  "youtube_search_url": "YouTube検索URL"
}
```

---

## タスク2（中）: 国内トッププレーヤーの追加

**現状**: 国内選手が**2件のみ**で致命的不足 → **最低8件追加**

### 調査先
- JPA公式サイト、DUPR日本ランキング、Instagram `#ピックルボール #日本代表`
- 国内大会入賞者名簿

### `league_affiliation` は `"JPA"` を設定

---

## タスク3（中）: コミュニティ情報の補完

55件の以下を補完:
```json
{
  "schedule_text": "毎週土曜日 19:00-21:00",
  "activity_frequency": "週1回以上 / 月2回程度 / 不定期",
  "play_style": "エンジョイ主導 / 競技志向 / 混合",
  "beginner_friendly": true,
  "external_url": "InstagramURL / LINEオープンチャットURL",
  "location_text": "主な活動場所"
}
```
- **`beginner_friendly`**: パドルレンタルあり or「初心者歓迎」記載 → `true`
- **調査先**: Instagram, LINEオープンチャット, X `#ピックルボール #サークル`

---

## タスク4（中）: コミュニティメディア追加

`production_data/community/community_media.json` (3件 → 目標15件)
- 主要サークルの紹介動画・Instagram投稿URLを追加:
```json
{
  "id": "cmedia_サークル略称_連番",
  "target_type": "community",
  "target_id": "サークル名",
  "media_type": "youtube / instagram / image",
  "url": "実在URL",
  "description": "説明"
}
```

---

## タスク5（中）: 掲示板データの構造確認

`production_data/community/threads.json` (5件)
- DBスキーマ（`threads`: category, facility_id, author_id, title, content, status）に合致しているか確認
- `category` が正しい選択肢（facility_match / gear_qa / rule_qa / partner_search）か確認

---

## タスク6（中）: ドリルのYouTube URL補完

35件のうちyoutube_urlがnullのものを補完:

| skill_focus | 検索クエリ |
|:---|:---|
| サードショットドロップ | `"pickleball third shot drop drill"` |
| ディンク | `"pickleball dink drill"` |
| トランジション | `"pickleball transition zone drill"` |
| サーブ＆リターン | `"pickleball serve return strategy"` |
| ボレー戦 | `"pickleball volley battle drill"` |
| スタッキング | `"pickleball stacking strategy"` |

**選定基準**: 再生数1万以上・高評価率高い・プロ/コーチ解説・日本語動画優先

---

## タスク7（小）: 記事のリレーション補完

47件の以下を補完:
- `related_gear_ids` - 記事内で言及するギアのIDをカンマ区切り
- `related_facility_ids` - 記事内で言及する施設のインデックス
- `related_player_ids` - 記事内で言及する選手のID

**判定**: 記事タイトル・内容から関連エンティティを特定して紐付け

---

## タスク8（中）: 用語集の補完・拡充

`production_data/content/glossary.json` (55件)
- ピックルボールの重要用語で不足しているものがないか確認
- 不足用語があれば追加（例: アーニー、ATP、DUPR、スタッキング等）

---

## タスク9（中）: 戦術データの拡充

`production_data/supplementary/advanced_shots.json` (3件 → 目標10件)

追加する7テーマ:
```json
{
  "id": "tactic_テーマ名",
  "name": "戦術名",
  "category": "攻撃技術 / 防御技術 / 陣形",
  "difficulty": "初級 / 中級 / 上級",
  "description": "説明",
  "key_points": ["ポイント1", "ポイント2"],
  "common_mistakes": ["よくあるミス1"],
  "practice_drill": "練習方法",
  "youtube_search_url": "YouTube検索URL"
}
```
追加テーマ: ①ディンク ②トランジション ③サーブ＆リターン ④スタッキング ⑤ロブ ⑥ブロックボレー/ハンズバトル ⑦アーニー/ATP

---

## タスク10（中）: コーチ情報の補完・拡充

`production_data/supplementary/coaches.json` (12件)
- 各コーチの以下を補完: 所在地、指導レベル、連絡先URL、保有資格
- 国内の主要PBコーチを追加（JPA公認コーチ等）

---

## タスク11（小）: 認定資格情報の補完

`production_data/supplementary/certifications.json` (8件)
- ピックルボールの認定資格（JPA公認、IFP公認等）の情報を確認・補完
- 認定団体、取得方法、費用等のフィールドに不足がないか確認

---

## タスク12（小）: ケガ予防情報の補完

`production_data/supplementary/injury_prevention.json` (16件)
- 各エントリーの情報が十分か確認（症状、予防法、リハビリ方法等）
- ピックルボール特有のケガ（テニス肘＝ピックルボール肘、アキレス腱、膝等）が網羅されているか確認

---

## タスク13（小）: MLPチーム情報の更新

`production_data/supplementary/mlp_teams.json` (16件)
- 各チームの2025-2026シーズン所属選手が最新か確認
- チームオーナー、ホームシティ等の情報を補完

---

## 作業完了時の報告フォーマット

```
## エージェントC 作業完了報告

### タスク1: プロ選手ギア紐付け
- paddle_ids補完: X件/21件, shoe_ids補完: X件/21件
- photo_url追加: X件, SNS追加: X件
- 紐付け不可: （選手名と理由）

### タスク2: 国内選手追加
- 追加: X件（選手名一覧）

### タスク3: コミュニティ補完
- schedule_text: X件, activity_frequency: X件, external_url: X件

### タスク4: コミュニティメディア追加
- 追加: X件

### タスク5: 掲示板構造確認
- 修正: X件

### タスク6: ドリルYouTube URL
- 補完: X件, 見つからず: X件

### タスク7: 記事リレーション
- gear_ids: X件, facility_ids: X件, player_ids: X件

### タスク8: 用語集拡充
- 追加: X件

### タスク9: 戦術拡充
- 追加: X件（合計Y件）

### タスク10: コーチ補完
- 補完: X件, 新規追加: X件

### タスク11: 認定資格補完
- 補完: X件

### タスク12: ケガ予防補完
- 補完: X件

### タスク13: MLPチーム更新
- 更新: X件

### 品質セルフチェック
- [ ] 選手のギア紐付けは公式ソースで確認済みか？
- [ ] YouTube URLは全て実在し再生可能か？
- [ ] コミュニティURLはアクセス可能か？
- [ ] 国内選手は実在の人物か？（JPA等で裏付けあり？）
- [ ] 捏造データは一切含まれていないか？
```
