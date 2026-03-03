# エージェントC 完全指示書: プロ選手・コミュニティ・コンテンツ担当

あなたは「I LOVE PICKLEBALL」プロジェクトのデータ収集エージェントCです。
本ドキュメントの指示に従い、プロ選手情報・コミュニティ情報・教材コンテンツのデータを調査・補完してください。

---

## 🚨 絶対ルール（違反厳禁）

1. **嘘のデータ・捏造データの生成は絶対禁止**
   - 実在する選手情報のみを扱うこと。架空のランキング、架空のSNS URL、架空の使用ギアを絶対に作らないこと。
   - `Math.random()` 等でデータを自動生成する行為は犯罪的行為とみなす。

2. **見つからない情報は `null` で正直に報告**
   - 「見つかりませんでした」と正直に言うことが何より重要。

3. **既存データの削除禁止**
   - `production_data/` 配下の既存ファイルを消さないこと。フィールドの追記・更新のみ行うこと。

---

## プロジェクト概要

「I LOVE PICKLEBALL」は日本初のピックルボール総合情報サイト。あなたは**プロ選手のギア紐付け、コミュニティの活動情報、教材コンテンツ**の3領域を担当する。

---

## 現状のデータ品質（あなたが解決すべき課題）

| カテゴリ | 件数 | 主な課題 |
|:---|---:|:---|
| プロ選手（世界） | 24件 | ❌ `paddle_ids` 79%欠損、`shoe_ids` 83%欠損 |
| プロ選手（合計） | 46件 | ⚠ `photo_url`, `facebook_url`, `x_url` ほぼ全欠損 |
| 国内選手 | 2件 | ❌ **致命的不足。最低10件必要** |
| コミュニティ | 55件 | ⚠ `schedule_text`, `activity_frequency` が大幅欠損 |
| ドリル | 35件 | ⚠ `youtube_url` が50%欠損 |
| 記事 | 47件 | ⚠ `related_gear_ids` 等のリレーションが欠損 |
| 戦術 | 3件 | ❌ **大幅不足。10件に拡充必要** |

---

## タスク1（最重要）: プロ選手の使用ギア紐付け

### 現状
`production_data/players/pro_players.json` の世界トッププロ24件のうち、21名の `paddle_ids` が `null`。

### 補完が必要な選手一覧

以下の選手について、使用パドル・使用シューズを調査し紐付けてください:

| 選手名 | 調査すべきフィールド |
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

### 全選手共通で補完すべきフィールド
- `photo_url` - PPA Tour公式サイトの選手プロフィール写真URL
- `facebook_url` - 公式Facebookページ（あれば）
- `x_url` - 公式X(Twitter)アカウント（あれば）
- `birth_date` - 生年月日（nullの選手を補完）

### 調査方法
1. **PPA Tour公式サイト** (ppatour.com) → 選手プロフィールの「Equipment」セクション
2. **選手のInstagram** → プロフィール欄の `@JOOLApickleball` 等のメンション、投稿での使用ギア
3. **YouTube** → 試合動画でパドルのロゴを確認（ただしこれは参考程度）
4. **DUPRランキング** (mydupr.com) → 最新ランキング確認

### paddle_ids の紐付けルール
`production_data/gears/paddles.json` に存在するパドルIDと紐付けること。存在しないパドルの場合は、パドル名をテキストで記載。

### 出力フォーマット（pro_playersテーブル準拠）

```json
{
  "id": "pro_名前のスネークケース",
  "name_ja": "日本語名",
  "name_en": "English Name",
  "nationality": "国名",
  "birth_date": "1990-01-15",
  "play_style": "プレースタイルの説明",
  "league_affiliation": "PPA Tour / MLP / APP / JPA",
  "ranking_singles": 1,
  "ranking_doubles": 1,
  "participating_tournaments": "主な出場大会・戦績",
  "paddle_ids": "paddle_joola_perseus_16",
  "shoe_ids": "shoe_kswiss_express_light",
  "apparel_brand_sponsor": "JOOLA",
  "instagram_url": "https://www.instagram.com/username",
  "facebook_url": "https://www.facebook.com/username",
  "x_url": "https://x.com/username",
  "photo_url": "https://ppatour.com/player/photo.jpg",
  "youtube_search_url": "https://www.youtube.com/results?search_query=Name+pickleball"
}
```

---

## タスク2: 国内トッププレーヤーの追加

### 現状
`production_data/players/pro_players.json` 内の日本人選手が**2件のみ**で致命的不足。

### やること
日本国内のピックルボールトッププレーヤーを調査し、**最低8件追加**（合計10件以上にする）

### 調査先
- JPA（日本ピックルボール協会）公式サイト
- DUPR日本ランキング
- Instagram `#ピックルボール #日本代表` `#JPA`
- 各地域ピックルボール協会のSNS
- 国内大会の結果報告（入賞者名簿）

### 出力フォーマット
タスク1と同じ `pro_players` のJSONフォーマット。`league_affiliation` は `"JPA"` を設定。

---

## タスク3: コミュニティ情報の補完

### 現状
`production_data/community/communities.json` (55件) の以下が大幅欠損:
- `schedule_text`（定型スケジュール）
- `activity_frequency`（活動頻度）
- `play_style`（エンジョイ/競技志向）
- `beginner_friendly`（初心者歓迎度）
- `external_url`（外部リンク）

### やること
既存55件を1件ずつ確認し、以下のフィールドを補完する。

### 補完対象フィールドとDBスキーマ

```json
{
  "id": "既存IDを維持",
  "name": "サークル名",
  "description": "活動内容の説明",
  "target_area": "東京都 / 大阪府 等",
  "location_text": "主な活動場所（例: 有明コロシアム周辺）",
  "target_level": "初心者〜中級者 / 全レベル / 上級者中心 等",
  "beginner_friendly": true,
  "play_style": "エンジョイ主導 / 競技志向 / 混合",
  "activity_frequency": "週1回以上 / 月2回程度 / 不定期",
  "schedule_text": "毎週土曜日 19:00-21:00",
  "external_url": "https://www.instagram.com/circle_name/ or LINEオープンチャットURL等"
}
```

### 判定ロジック
- **`beginner_friendly`**: パドルレンタルがある、「初心者歓迎」の記載がある、体験枠がある → `true`
- **`play_style`**: 「エンジョイ」「楽しく」→ エンジョイ主導、「大会」「ランキング」→ 競技志向
- **`activity_frequency`**: 具体的な頻度が書かれていればそのまま、不明なら `null`

### 調査先
- 各サークルのInstagram
- LINEオープンチャット検索（「ピックルボール」で検索）
- X(Twitter) `#ピックルボール #サークル`
- 地域のスポーツ掲示板

---

## タスク4: ドリル・教材のYouTube URL補完

### 現状
`production_data/content/drills.json` (35件) の約50%で `youtube_url` が欠損。

### やること
各ドリルの `skill_focus` と `target_level` に基づいて、**実在する高品質なYouTube動画**を検索しURLを記録。

### 検索の優先順位（ドリルDBスキーマ準拠）

```json
{
  "id": "既存IDを維持",
  "title": "ドリルのタイトル",
  "target_level": "初心者向け / 中級者向け / 上級者向け",
  "skill_focus": "サードショットドロップ / ディンク / トランジション / サーブ＆リターン / ボレー戦 / スタッキング",
  "youtube_url": "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  "description": "日本語での解説テキスト"
}
```

### YouTube検索クエリ例
| skill_focus | 検索クエリ |
|:---|:---|
| サードショットドロップ | `"pickleball third shot drop drill"` or `"ピックルボール サードショット 練習"` |
| ディンク | `"pickleball dink drill"` or `"ピックルボール ディンク 練習"` |
| トランジション | `"pickleball transition zone drill"` |
| サーブ＆リターン | `"pickleball serve return strategy"` |
| ボレー戦 | `"pickleball volley battle drill"` |
| スタッキング | `"pickleball stacking strategy explained"` |

### 動画選定基準
1. **再生数が多い**（1万再生以上が望ましい）
2. **高評価率が高い**
3. **プロ選手やコーチが解説**しているもの
4. **日本語解説がある動画を優先**（なければ英語動画でOK）
5. **URLが実在し、削除されていない**ことを確認

---

## タスク5: 記事のリレーション補完

### 現状
`production_data/content/articles.json` (47件) の `related_gear_ids`, `related_facility_ids`, `related_player_ids` が大幅欠損。

### やること
各記事のタイトル・カテゴリ・内容を読み、関連するID群を紐付ける。

### 紐付けルール
- 記事タイトルに「パドル」「ギア」が含まれる → `related_gear_ids` に該当パドルIDをカンマ区切り
- 記事タイトルに「コート」「施設」が含まれる → `related_facility_ids`
- 記事タイトルに選手名が含まれる → `related_player_ids`

---

## タスク6: 戦術データの拡充

### 現状
`production_data/supplementary/advanced_shots.json` が**3件のみ**。

### やること
以下の7つの戦術テーマについて新規データを追加し、合計10件にする:

```json
[
  {
    "id": "tactic_third_shot_drop",
    "name": "サードショットドロップ",
    "category": "攻撃技術",
    "difficulty": "中級〜上級",
    "description": "3球目にソフトなドロップショットをキッチン（NVZ）前に落とす技術。ネット前での主導権を取るための最重要ショット。",
    "key_points": ["膝を使って低い姿勢から打つ", "フォロースルーを短く制御", "ネットの最も低い中央を狙う"],
    "common_mistakes": ["力が入りすぎてオーバーする", "ネットにかける", "相手のポジションを見ずに打つ"],
    "practice_drill": "キッチンライン前にターゲット（コーン等）を置き、ベースラインから20球連続で落とす練習",
    "youtube_search_url": "https://www.youtube.com/results?search_query=pickleball+third+shot+drop+drill"
  }
]
```

### 追加すべき戦術テーマ（既存3件と重複しない7件）
1. ディンク戦術（Dink Game）
2. トランジションゲーム（Transition Zone）
3. サーブ＆リターン戦略
4. スタッキング陣形（Stacking）
5. ロブの使い分け
6. ブロックボレー / ハンズバトル（ファイヤーファイト）
7. アーニー（Erne）/ ATP

---

## 出力先まとめ

| ファイル | 操作 |
|:---|:---|
| `production_data/players/pro_players.json` | 使用ギア紐付け補完 + 国内選手8件追加 |
| `production_data/community/communities.json` | 55件のフィールド補完 |
| `production_data/content/drills.json` | youtube_url補完 |
| `production_data/content/articles.json` | リレーションID補完 |
| `production_data/supplementary/advanced_shots.json` | 7件追加 → 合計10件 |

---

## 作業完了時の報告フォーマット

```
## エージェントC 作業完了報告

### プロ選手 使用ギア紐付け
- paddle_ids補完: X件 / 21件
- shoe_ids補完: X件 / 21件
- photo_url追加: X件
- SNS URL追加: X件
- 紐付けできなかった選手: （名前と理由を列挙）

### 国内選手追加
- 追加件数: X件
- 選手名一覧: ...

### コミュニティ補完
- schedule_text補完: X件 / 55件
- activity_frequency補完: X件 / 55件
- external_url追加: X件 / 55件

### ドリル YouTube URL補完
- URL追加: X件 / 35件中のnullだったもの
- 見つからなかった件数: X件

### 記事リレーション
- related_gear_ids補完: X件 / 47件
- related_facility_ids補完: X件 / 47件
- related_player_ids補完: X件 / 47件

### 戦術データ拡充
- 追加件数: X件（合計Y件）

### 品質セルフチェック
- [ ] 選手のパドル/シューズ紐付けは公式ソース（PPA, Instagram）で確認済みか？
- [ ] YouTube URLは全て実在し、再生可能か？
- [ ] コミュニティの外部URLは全てアクセス可能か？
- [ ] 国内選手は実在の人物か？（JPA等の公式情報で裏付けがあるか？）
- [ ] 捏造データは一切含まれていないか？
```
