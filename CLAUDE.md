# I LOVE PICKLEBALL 開発チーム

## プロジェクト概要
日本のピックルボール愛好家向けスポーツメディアプラットフォーム。
施設検索（インタラクティブマップ）、選手プロフィール、ギアレビュー、コミュニティフォーラムを提供。

## 技術スタック
- **フレームワーク**: Next.js 14
- **ORM**: Prisma
- **DB**: Supabase (Auth/DB)
- **デプロイ**: Vercel（フロント）/ Hetzner（DB）

## DB接続情報
- Host: 172.18.0.12
- Port: 5432
- DB名: pickleball
- User: postgres
- テーブル数: 41
- 接続: `docker exec supabase-db psql -U postgres -d pickleball`

## Agent Teams構成
- **DB・API専門**: Prismaスキーマ、マイグレーション、API Routes
- **フロントエンド専門**: React コンポーネント、地図連携、UI/UX
- **テスト・品質専門**: テスト作成、ビルド検証

## 完了ルール
1. `git add -A && git commit -m "[agent:pickleball] 変更内容" && git push`
2. REPORT.md に作業報告を記載
3. Prismaスキーマ変更後は `npx prisma generate` を実行
4. 日本語、.env禁止
