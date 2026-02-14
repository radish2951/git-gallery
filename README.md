# git-gallery

gitリポジトリ内の画像ファイルを、任意の2コミット間で視覚的に比較できるローカルツール。

## セットアップ

```bash
pnpm install
```

## 使い方

```bash
pnpm dev
```

http://localhost:5173 を開き、gitリポジトリのパスを入力して「開く」を押す。

## 機能

- 任意のローカルgitリポジトリを開ける
- リポジトリ内の画像ファイル一覧表示
- ファイルごとのコミット履歴（サムネイル付き）
- 任意の2コミット間でスライダー比較 / サイドバイサイド比較
- 日本語ファイル名対応（NFD/NFC正規化）
- 最近開いたリポジトリの履歴表示

## 技術スタック

- Vite + React + TypeScript
- Tailwind CSS
- sharp（サムネイル生成）
- @img-comparison-slider/react（スライダー比較UI）
