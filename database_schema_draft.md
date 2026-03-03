# データベーススキーマ統合・修正案（総合要件定義書 × 拡張JSONデータ）

「I LOVE PICKLEBALL」総合要件定義書（PRD）に記載されている既存のデータベーススキーマと、今回収集・拡張したインフラJSONデータ（施設、コート環境、サークル・レベル感など）を比較し、これらをシームレスに統合するための**スキーマ修正案（追加・変更フィールドの提言）**です。

総合要件定義書の「5. データベース（DB）スキーマ設計書」をベースに、JSONデータ側のリッチな情報を取り込む形でアップデートしています。

---

## 1. 施設・コート関連テーブルの修正案

PRDでは「施設(facilities)」と「コート(facility_courts)」が綺麗に正規化されています。JSONで収集したデータ（特にナビやアメニティ）をここに適切にマッピング・追加します。

### 1-A. `facilities` テーブル（施設基本・アクセス情報の追加）

| カラム名 | データ型 | 変更点・追加理由 |
| :--- | :--- | :--- |
| `directions_url` | TEXT | **【新規追加】** JSONの `access_info.directions_url`。Google Maps等への直接経路案内URLは、ユーザー体験（UX）に直結するため必須です。 |
| `access_guide` | TEXT | **【新規追加】** JSONの `access_info.guide`。「駅から徒歩5分」などの補足アクセス情報。 |
| `visitor_welcome` | BOOLEAN | **【新規追加】** JSONで推論・付与したフラグ。旅行者や非会員の「ドロップイン・体験参加」が歓迎されているかを示す超重要指標。 |
| `has_school` | BOOLEAN | **【新規追加】** 施設主導の公式スクールやレッスンが存在するかどうか。 |
| （※既存 `address`, `latitude`, `longitude` 等はそのまま維持） | | |

### 1-B. `facility_courts` テーブル（コート環境の詳細化）

JSONデータの `court_surface` や `is_indoor` と、PRDの `surface_type`, `court_type` は本質的に同じ情報です。これらを統合します。

| カラム名 | データ型 | 変更点・統合理由 |
| :--- | :--- | :--- |
| `surface_type` | VARCHAR(50) | JSONで大量推論した「木製(体育館)」「オムニ(砂入り人工芝)」「ハード」「カーペット」のデータをここに格納します。 |
| `court_type` | VARCHAR(50) | JSONの `is_indoor` (屋内・屋外) のフラグ結果をここにマッピングします（1: インドア, 2: アウトドア）。 |

### 1-C. `facility_shops` / または `facilities` への機能マージ

JSONデータの `paddle_rental` や物販情報は施設側の属性として保持しています。

| カラム名 | データ型 | 変更点・統合理由 |
| :--- | :--- | :--- |
| `has_paddle_rental` | TINYINT | PRD既存。JSONの `paddle_rental` データをここに格納します。初心者が行けるかどうかの生命線です。 |
| `parking` | TINYINT | JSONの駐車場フラグ。PRDの `has_parking` へマージします。 |

---

## 2. コミュニティ・サークル関連の修正案

PRDの `communities` テーブルに対し、JSONでディープダイブした**「コミュニティのレベル感・活動頻度」のメタデータ**を大幅に追記する必要があります。ここが「人と繋がる」ための最重要アップデートです。

### 2-A. `communities` テーブル（活動実態とレベル感パラメータの追加）

| カラム名 | データ型 | 変更点・追加理由 |
| :--- | :--- | :--- |
| `beginner_friendly` | BOOLEAN | **【新規追加】** JSONのフラグ。全くの未経験者や初心者を歓迎しているか（貸出パドルの有無や体験レッスンの有無）。参加ハードルを下げる超重要指標。 |
| `play_style` | VARCHAR(50) | **【新規追加】** JSONの推論データ。「エンジョイ（レクリエーション）」「競技志向（ガチ・大会向け）」「混合」など、集団の空気感を明記します。 |
| `activity_frequency`| VARCHAR(50) | **【新規追加】** JSONの推論データ。「週1回以上」「月2回」「不定期」など、どれくらいの熱量で活動しているか。 |
| `schedule_text` | VARCHAR(255) | **【新規追加】** 「毎週末土曜日 19時〜」などの定型スケジュール文章。 |
| `external_url` | TEXT | **【新規追加】** 公式サイト、Instagram、LINEオープンチャット等のリンク（JSONの `url`）。 |
| `location_text` | VARCHAR(255) | **【新規追加】** 主にどこで活動しているか（例：「福岡市内の公営体育館」）。PRDの `target_area` と連携・保管。 |

---

## 3. 追加エンティティ（テーブル）の提言

JSONデータの中で収集されたリッチな「メディア（動画）」情報を活かすためのテーブル追加案です。

### 3-A. `facility_media` / `community_media` テーブル（新規作成）

JSONに含まれる YouTube の紹介動画や、Instagram の埋め込みリンクなどを管理し、施設・サークル詳細画面をリッチ化します。

| カラム名 | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK | メディアの一意なID |
| `target_type` | VARCHAR(20) | NOT NULL | `facility` または `community` |
| `target_id` | BIGINT | NOT NULL | 各施設のID、またはコミュニティID |
| `media_type` | VARCHAR(20) | NOT NULL | `youtube`, `image`, `instagram` |
| `url` | TEXT | NOT NULL | 動画や画像のURL |

---

## 統合・移行へのネクストステップ

1. **マイグレーションの実施**: 本修正案（追加カラム・新規テーブル）を要件定義書（PRD）の第5章に正式に組み込み、RDBMS用の `CREATE TABLE` などのマイグレーションファイルを作成します。
2. **シーダー (Seeder) プログラムの開発**: 現在の巨大なJSONファイル群（`kanto.json`, `chugoku_shikoku.json` など）を読み込み、正規化して分割しながら `facilities`, `facility_courts`, `communities` テーブルへ一元的に挿入（INSERT）する移行スクリプトを構築します。
