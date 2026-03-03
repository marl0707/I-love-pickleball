# 📊 I LOVE PICKLEBALL データベース投入ガイド

> **最終更新**: 2026-03-04  
> **データ総数**: 38ファイル / 1,810エントリー  
> **格納場所**: `production_data/` ディレクトリ配下

---

## 🗂️ フォルダ構造と全ファイル一覧

```
production_data/
├── facilities/          ← 🏟️ 施設データ（最大・最重要）
│   ├── facilities.json         (864KB) ← メイン施設マスター
│   ├── facility_courts.json    (100KB) ← コート詳細
│   ├── facility_shops.json     (58KB)  ← ショップ・レンタル
│   ├── facility_media.json     (13KB)  ← 施設写真・動画
│   └── facility_comments.json  (2KB)   ← 口コミ
│
├── gears/               ← 🏓 ギアデータ
│   ├── paddles.json     (113件)  ← パドル全データ
│   ├── shoes.json       (41件)   ← シューズ
│   ├── balls.json       (31件)   ← ボール
│   ├── accessories.json (57件)   ← アクセサリー
│   ├── apparel.json     (45件)   ← ウェア
│   └── bags.json        (22件)   ← バッグ
│
├── community/           ← 👥 コミュニティデータ
│   ├── communities.json      (55件)  ← サークル・クラブ
│   ├── community_media.json  (15件)  ← コミュニティ動画
│   ├── threads.json          (15件)  ← 掲示板スレッド
│   ├── activity_logs.json    (5件)   ← 活動ログ
│   └── announcements.json    (5件)   ← お知らせ
│
├── content/             ← 📝 コンテンツデータ
│   ├── glossary.json    (93件)  ← 用語集
│   ├── articles.json    (49件)  ← 記事
│   └── drills.json      (30件)  ← ドリル練習
│
├── players/             ← 🏆 選手データ
│   ├── pro_players.json     (38件)  ← プロ選手
│   └── expert_reviews.json  (10件)  ← 専門家レビュー
│
├── events/              ← 📅 イベントデータ
│   ├── events.json   (15件)  ← 大会・イベント
│   └── awards.json   (5件)   ← 受賞歴
│
└── supplementary/       ← 📦 サポートデータ
    ├── brands.json              (46件)  ← ブランドマスター
    ├── users_mock.json          (56件)  ← モックユーザー
    ├── master_tags.json         (50件)  ← タグマスター
    ├── niche_gears.json         (30件)  ← ニッチ機材
    ├── coaches.json             (14件)  ← コーチ
    ├── injury_prevention.json   (18件)  ← 怪我予防
    ├── mlp_teams.json           (16件)  ← MLPチーム
    ├── certifications.json      (11件)  ← 資格情報
    ├── master_associations.json (9件)   ← 協会マスター
    ├── pb_apps.json             (8件)   ← アプリ情報
    ├── promotions_coupons.json  (8件)   ← クーポン
    ├── user_bookmarks.json      (7件)   ← ブックマーク
    ├── price_guide.json         (5件)   ← 価格ガイド
    └── advanced_shots.json      (14件)  ← 高度ショット
```

---

## 🎯 DB投入の優先度（3段階）

### 🔴 Tier 1: コアテーブル（必須・最優先）
> サイトの基本機能に直結。これがないとサイトが成り立たない。

| JSONファイル | → DBテーブル名 | 件数 | 備考 |
|---|---|---|---|
| `facilities/facilities.json` | `facilities` | 多数 | **最重要**。住所・GPS・営業時間・写真すべて含む |
| `facilities/facility_courts.json` | `facility_courts` | 多数 | 施設に紐づくコート詳細（面数・サーフェス） |
| `gears/paddles.json` | `gear_paddles` | 113 | 価格・スペック・画像・購入リンク完備 |
| `gears/shoes.json` | `gear_shoes` | 41 | 同上 |
| `gears/balls.json` | `gear_balls` | 31 | 同上 |
| `gears/accessories.json` | `gear_accessories` | 57 | 同上 |
| `gears/apparel.json` | `gear_apparel` | 45 | 同上 |
| `gears/bags.json` | `gear_bags` | 22 | 同上 |
| `community/communities.json` | `communities` | 55 | サークル・クラブ（レベル感・活動頻度含む） |
| `players/pro_players.json` | `pro_players` | 38 | DUPR・戦績・使用機材 |

### 🟡 Tier 2: コンテンツテーブル（重要・Phase 2）
> サイトの読み物・教育コンテンツ。SEOとユーザーエンゲージメントに重要。

| JSONファイル | → DBテーブル名 | 件数 | 備考 |
|---|---|---|---|
| `content/glossary.json` | `glossary_terms` | 93 | 用語集（日英対応） |
| `content/articles.json` | `articles` | 49 | 記事・ガイド |
| `content/drills.json` | `drills` | 30 | 練習ドリル（YouTube動画付き） |
| `events/events.json` | `events` | 15 | 大会・イベントカレンダー |
| `community/threads.json` | `forum_threads` | 15 | 掲示板スレッド |
| `players/expert_reviews.json` | `expert_reviews` | 10 | 専門家レビュー |
| `supplementary/advanced_shots.json` | `advanced_shots` | 14 | 高度なショット解説 |
| `supplementary/coaches.json` | `coaches` | 14 | コーチ情報 |
| `supplementary/injury_prevention.json` | `injury_prevention` | 18 | 怪我予防ガイド |

### 🟢 Tier 3: サポートテーブル（補助・Phase 3）
> マスターデータ・メタデータ。コアテーブルと連携して使う。

| JSONファイル | → DBテーブル名 | 件数 | 備考 |
|---|---|---|---|
| `supplementary/brands.json` | `brands` | 46 | ブランドマスター |
| `supplementary/master_tags.json` | `tags` | 50 | タグマスター（多対多リレーション） |
| `supplementary/master_associations.json` | `associations` | 9 | 協会マスター |
| `supplementary/niche_gears.json` | `niche_gears` | 30 | ニッチ機材・ボールマシン等 |
| `supplementary/mlp_teams.json` | `mlp_teams` | 16 | MLPチーム |
| `supplementary/certifications.json` | `certifications` | 11 | 資格情報 |
| `supplementary/pb_apps.json` | `pb_apps` | 8 | PBアプリ情報 |
| `supplementary/promotions_coupons.json` | `promotions` | 8 | クーポン |
| `supplementary/price_guide.json` | `price_guides` | 5 | 価格ガイド |
| `events/awards.json` | `awards` | 5 | 受賞歴 |
| `facilities/facility_shops.json` | `facility_shops` | 多数 | ショップ情報 |
| `facilities/facility_media.json` | `facility_media` | 多数 | 施設メディア |
| `facilities/facility_comments.json` | `facility_comments` | 少数 | 口コミ |
| `community/community_media.json` | `community_media` | 15 | コミュニティ動画 |
| `community/activity_logs.json` | `activity_logs` | 5 | 活動ログ |
| `community/announcements.json` | `announcements` | 5 | お知らせ |

### ⚠️ DB投入しないファイル
| JSONファイル | 理由 |
|---|---|
| `supplementary/users_mock.json` (56件) | **モックユーザーデータ**。開発テスト用のみ。本番DBには認証系(Supabase Auth)のユーザーが入る |
| `supplementary/user_bookmarks.json` (7件) | モックブックマーク。実際はログインユーザーのリアルタイムデータ |

---

## 🏗️ 推奨するDB構築フロー

```
1. Prisma Schema定義（schema.prisma）
   ↓
2. Supabase Migration実行
   ↓  
3. Seederスクリプトでproduction_data → DB投入
   ↓
4. Supabase RLS（Row Level Security）設定
   ↓
5. フロントエンドからAPI経由でデータ取得
```

### シーダー戦略

```javascript
// 投入順序（外部キー依存関係を考慮）
// Phase 1: マスターテーブル（依存なし）
//   brands → tags → associations → certifications

// Phase 2: コアテーブル（マスター参照）
//   facilities → facility_courts → facility_shops → facility_media
//   gear_paddles → gear_shoes → gear_balls → ...
//   communities → community_media
//   pro_players

// Phase 3: コンテンツテーブル（コア参照）
//   articles → glossary → drills → events
//   threads → expert_reviews → coaches
```

---

## 📋 既存スキーマとの対応

`database_schema_draft.md` に記載の修正案と統合する形で進める。
主な追加ポイント:
- `facilities` に `directions_url`, `access_guide`, `visitor_welcome` 追加
- `communities` に `beginner_friendly`, `play_style`, `activity_frequency` 追加
- `facility_media` / `community_media` テーブル新規作成
- **gear系テーブル6つ**は既存スキーマに未定義 → 全て新規作成必要

---

## 📊 データ品質チェックリスト

| チェック項目 | paddles | shoes | articles | facilities |
|---|---|---|---|---|
| ✅ JSON構文エラーなし | ○ | ○ | ○ | ○ |
| ✅ image_url存在 | ○ | ○ | - | ○ |
| ✅ price_usd/price_tier | ○ | ○ | - | - |
| ✅ 日本語説明 | ○ | ○ | ○ | ○ |
| ✅ 購入リンク(Amazon/楽天/Yahoo) | ○ | ○ | - | - |
