# I LOVE PICKLEBALL - 保守・運用ドキュメント

> 最終更新: 2026-03-03

## プロジェクト概要

| 項目 | 内容 |
|---|---|
| **サービス名** | I LOVE PICKLEBALL |
| **コンセプト** | 日本のピックルボール総合情報メディア |
| **技術スタック** | Next.js 16 (App Router) + TypeScript + Tailwind CSS |
| **データベース** | Supabase (PostgreSQL) + Prisma ORM |
| **デプロイ** | Vercel（GitHub連携の自動デプロイ） |
| **GitHubリポジトリ** | `marl0707/I-love-pickleball` (masterブランチ) |

## 環境変数

| 変数名 | 用途 | 機密度 |
|---|---|---|
| `DATABASE_URL` | Supabase PgBouncer接続URL | 🔴 機密 |
| `DIRECT_URL` | Supabase直接接続URL | 🔴 機密 |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini AI APIキー（チャットボット用） | 🔴 機密 |
| `STRIPE_SECRET_KEY` | Stripe秘密キー | 🔴 機密 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe公開キー | 🟡 公開可 |

## 主要ページ

| ページ | パス | 説明 |
|---|---|---|
| トップ | `/` | メインランディングページ |
| 記事一覧 | `/articles` | ピックルボール関連記事 |
| イベント一覧 | `/events` | 大会・イベント情報 |
| イベント詳細 | `/events/[id]` | イベント詳細ページ |
| 練習メニュー一覧 | `/drills` | 練習メニュー情報 |
| 練習メニュー詳細 | `/drills/[id]` | 練習メニュー詳細ページ |
| サークル一覧 | `/circles` | サークル・クラブ検索 |
| サークル詳細 | `/circles/[id]` | サークル詳細ページ |
| コミュニティ | `/community` | コミュニティ掲示板 |
| 広告掲載 | `/advertise` | 広告掲載案内 |

## AIチャットボット

### 概要
サイト右下にフローティングチャットボットを設置。Gemini AIによるRAGベースの質問応答機能。

### 技術構成

| 項目 | 内容 |
|---|---|
| **AIモデル（チャット）** | `gemini-2.0-flash-001` |
| **AIモデル（Embedding）** | `gemini-embedding-001`（3072次元） |
| **ベクトルDB** | Supabase PostgreSQL + pgvector |
| **フロントエンド** | `src/components/AIChatBot.tsx` |
| **バックエンド** | `src/app/api/chat/route.ts` |

### Embedding生成

記事を公開したら以下を実行：

```bash
node scripts/generate-embeddings.mjs
```

### チャットUI機能

- 吹き出しCTA（「✨ AIに質問してみよう！」）
- AI回答内のURLを「📄 詳しく見る →」ボタンに変換
- 1セッション8往復のレート制限

## 開発手順

```bash
# 依存パッケージインストール
npm install

# 開発サーバー起動
npm run dev

# ビルドテスト
npm run build
```

## 変更履歴

### 2026-03-03
- AIチャットボット実装（RAG + Gemini + pgvector）
- チャットUI: URL→ボタン変換、吹き出しCTA追加
- サークル（Community）ページ追加
- ナビゲーションにサークルリンク追加
- フッターにアフィリエイト広告表記追加

### 2026-03-02
- イベント・ドリル詳細ページ実装
- ナビゲーションリンク追加

## 過去のインシデントと教訓

### 2026-03-04: Server ComponentでのonClick使用によるページクラッシュ

**症状:** ページにアクセスすると、「Event handlers cannot be passed to Client Component props」というエラーが発生してページがクラッシュする。ビルド時およびハイドレーション時にフロントエンドの実行時エラーとなる。

**根本原因:**
Server Component（`"use client"`がないファイル）内に、`<button onClick={() => window.scrollTo(...) }>` のようなクライアント側のJavaScriptイベントハンドラを直接記述してしまったため。Next.js App Routerでは、Server Component内でブラウザAPI（`window`など）やインタラクティブなイベントは利用できない。

**解決策と再発防止:**
- ページ内スクロールやアンカーへの遷移は、イベント付きのボタンではなく、標準的なHTMLタグまたは `<Link href="#anchor">` を用いて実装すること。これにより、Server Componentのパフォーマンスの利点を維持しつつ、エラーなく動作する。
- どうしても `onClick` イベントが必要な場合は、そのUI要素のみを別ファイルに切り出し、先頭に `"use client"` を明記したClient Componentとしてインポートする。
