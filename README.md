# Nuxt + Rails API プロジェクト

Nuxt.js（フロントエンド）と Ruby on Rails API（バックエンド）を Docker で構築した、フルスタックのサンプル Web アプリケーションです。

## プロジェクト構成

```
nuxt-railsapi/
├── docker-compose.yml          # Docker Compose 設定
├── frontend/                   # Nuxt.js フロントエンド
│   ├── Dockerfile
│   └── src/                   # Nuxt.js アプリケーションコード
└── backend/                   # Rails API バックエンド
    ├── Dockerfile
    └── src/                   # Rails API アプリケーションコード
```

## 技術スタック

### フロントエンド

- **Nuxt.js**: Vue.js ベースのフルスタックフレームワーク（TypeScript 使用）
- **TypeScript**: 型安全性を提供する JavaScript の拡張言語
- **Node.js**: JavaScript ランタイム環境
- **npm**: パッケージ管理

### バックエンド

- **Ruby on Rails**: API モード
- **MySQL**: データベース
- **Ruby 3.3**: プログラミング言語

### インフラ

- **Docker**: コンテナ仮想化
- **Docker Compose**: マルチコンテナアプリケーション管理

## 必要な環境

- Docker Desktop
- Docker Compose

## 環境構築手順

### 1. プロジェクトディレクトリに移動

```bash
cd nuxt-railsapi
```

### 2. 環境変数設定

```bash
cp .env.example .env
```

必要に応じて`.env`ファイルでポート番号を変更：

```bash
# ポート設定例
WEB_PORT=3001
DATABASE_PORT=3307
```

### 3. Docker コンテナの構築と起動

```bash
# コンテナのビルドと起動
docker-compose up --build

# バックグラウンドで起動する場合
docker-compose up -d --build
```

### 4. アクセス確認

- **フロントエンド（Nuxt.js）**: http://localhost:3000 (デフォルト)
- **バックエンド（Rails API）**: http://localhost:3001 (デフォルト)
- **MySQL**: localhost:3306 (デフォルト)

※ポート番号は`.env`ファイルで変更可能です

### 5. 開発時のコマンド

```bash
# コンテナの停止
docker-compose down

# ログの確認
docker-compose logs

# 特定のサービスのログ確認
docker-compose logs frontend
docker-compose logs backend

# コンテナ内でコマンド実行
docker-compose exec backend bash
docker-compose exec frontend bash
```

## プロジェクトの特徴

- **API ファーストアプローチ**: Rails を API モードで構築
- **分離された開発環境**: フロントエンドとバックエンドが独立したコンテナ
- **ホットリロード対応**: 開発中のコード変更が即座に反映
- **データベース永続化**: MySQL データの永続化設定済み
- **柔軟なポート設定**: 環境変数でホスト側のポート番号を変更可能

## ポート設定

各サービスのポート番号は`.env`ファイルで設定できます：

| サービス         | 環境変数        | デフォルト値 | 説明                         |
| ---------------- | --------------- | ------------ | ---------------------------- |
| Web サイトポート | `WEB_PORT`      | 3000         | Nuxt.js 開発サーバーのポート |
| データベース     | `DATABASE_PORT` | 3306         | MySQL のポート               |

例：ポート番号を変更する場合

```bash
# .envファイル
WEB_PORT=23000
DATABASE_PORT=23306
```

## 開発ガイドライン

### API 開発（Rails）

- RESTful API の設計原則に従う
- CORS 設定でフロントエンドからのアクセスを許可
- JSON 形式でのデータ交換

### フロントエンド開発（Nuxt.js + TypeScript）

- コンポーネント指向の開発
- TypeScript による型安全な開発
- Axios 等を使用した API 通信
- レスポンシブデザインの実装
- SSR（Server-Side Rendering）対応

## トラブルシューティング

### ポートが使用中の場合

```bash
# 使用中のポートを確認
lsof -i :3000
lsof -i :8080

# プロセスの停止
kill -9 <PID>
```

### データベース接続エラー

```bash
# データベースコンテナの再起動
docker-compose restart db

# データベースの初期化
docker-compose down -v
docker-compose up --build
```
