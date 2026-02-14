# CLAUDE.md

## プロジェクト概要

gitリポジトリ内の画像ファイルを任意の2コミット間で比較するローカルウェブアプリ。

## 開発コマンド

- `pnpm dev` で Vite dev server を起動（APIもここに含まれる）
- `npx tsc --noEmit -p tsconfig.json` でフロントエンドの型チェック
- `npx tsc --noEmit -p tsconfig.node.json` でサーバーサイドの型チェック

## アーキテクチャ

Express不使用。Vite の `configureServer` フックでAPIミドルウェアを登録し、`pnpm dev` だけで完結する。本番ビルド不要のローカルツール。

リポジトリ選択は osascript によるmacOSネイティブのフォルダ選択ダイアログ、またはパス直接入力で行う。サーバーが `git rev-parse` で検証してから操作する。

### サーバーサイド（server/）

- `middleware.ts` - Viteプラグイン。`/api/*` をルーティング
- `git.ts` - `execFile` による git CLI ラッパー。`core.quotePath=false` で日本語パス対応
- `thumbnail.ts` - sharp で 200px幅サムネイル生成。メモリキャッシュあり
- `validate.ts` - gitリポジトリ検証、コミットハッシュ・パスのバリデーション
- `unicode.ts` - NFD/NFC 正規化

### フロントエンド（src/）

- React Router でページ遷移。リポジトリパスはクエリパラメータ `path` で持ち回す
- Tailwind CSS でスタイリング
- `@img-comparison-slider/react` でスライダー比較
- リポジトリ選択は osascript ダイアログ or パス直接入力
