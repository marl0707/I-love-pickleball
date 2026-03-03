# I LOVE PICKLEBALL - データ構成ガイド

## フォルダ構成

```
I-love-pickleball/
├── production_data/          ← ★ 本番データ（ここを使う）★
│   ├── facilities/           # 施設・コート・ショップ・メディア・コメント
│   ├── gears/                # パドル・シューズ・ボール・アパレル・バッグ・アクセサリー
│   ├── players/              # プロ選手・専門家レビュー
│   ├── content/              # 記事・ドリル・用語集
│   ├── community/            # コミュニティ・スレッド・お知らせ・アクティビティ
│   ├── events/               # イベント・アワード
│   └── supplementary/        # コーチ・戦術・ケガ予防・MLP・ブランド等
│
├── agent_A_instructions.md   # エージェントA指示書（施設・イベント・場所関連）
├── agent_B_instructions.md   # エージェントB指示書（ギア・レビュー・ブランド関連）
├── agent_C_instructions.md   # エージェントC指示書（人物・コミュニティ・コンテンツ関連）
│
├── _archive_raw_sources/     # ⚠️ 統合済み旧データ（使用禁止、参照用に保管）
│   ├── data/
│   ├── salvaged_data/
│   └── recreated_by_antigravity/
│
└── 各種ドキュメント
    ├── 「I LOVE PICKLEBALL」総合要件定義書.md
    ├── database_schema_draft.md
    └── コンテンツ制作・AI執筆ガイドライン.md
```

## ルール

1. **本番データ** → `production_data/` のみを使用
2. **旧データ** → `_archive_raw_sources/` は参照のみ（編集禁止）
3. **データ追加・更新** → エージェント指示書に従い `production_data/` 配下に書き込む
