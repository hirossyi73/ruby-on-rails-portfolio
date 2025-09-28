# Rails Practice - Docker 環境構築

このプロジェクトは、Docker と Docker Compose を使用して Ruby on Rails と MySQL の開発環境を構築します。

## プロジェクト構造の特徴

このプロジェクトでは、Docker 関連の設定ファイルと Rails アプリケーションコードを分離した構造を採用しています：

- **ルートディレクトリ**: Docker 設定、README、プロジェクト管理ファイル
- **src/ ディレクトリ**: Rails アプリケーションのソースコード

この構造により、以下の利点があります：

- Rails の`rails new`コマンドで Docker ファイルが上書きされない
- プロジェクト全体の設定とアプリケーションコードが明確に分離される
- チーム開発での役割分担が明確になる

## 必要な環境

- Docker Desktop
- Docker Compose

## 環境構築手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd RailsPractice
```

### 2. Docker イメージのビルド

```bash
docker compose build
```

### 3. Rails アプリケーションの初期化（必要に応じて）

既に src ディレクトリ内に Rails アプリケーションが作成済みです。
新しい Rails アプリケーションを作成する場合：

```bash
# srcディレクトリを空にする
rm -rf src/*

# Railsアプリケーションを作成
docker compose run --rm web rails new . --force --database=mysql --skip-bundle

# 作成されたファイルをsrcディレクトリに移動
mv app bin config config.ru db lib log public Rakefile storage test tmp vendor src/
mv .gitattributes .rubocop.yml .ruby-version src/
cp Gemfile Gemfile.lock src/
```

### 4. データベースの作成とマイグレーション

```bash
# データベースの作成
docker compose run --rm web rails db:create

# マイグレーションの実行（必要に応じて）
docker compose run --rm web rails db:migrate
```

### 5. アプリケーションの起動

```bash
docker compose up
```

アプリケーションは `http://localhost:3000` でアクセスできます。

## よく使うコマンド

### アプリケーションの起動/停止

```bash
# 起動（フォアグラウンド）
docker compose up

# 起動（バックグラウンド）
docker compose up -d

# 停止
docker compose down

# すべてのコンテナとボリュームを削除
docker compose down -v
```

### Rails コマンド

```bash
# Railsコンソール
docker compose run --rm web rails console

# マイグレーションの作成
docker compose run --rm web rails generate migration <migration_name>

# マイグレーションの実行
docker compose run --rm web rails db:migrate

# ルーティングの確認
docker compose run --rm web rails routes

# Gemの追加後（srcディレクトリのGemfileを編集後）
docker compose run --rm web bundle install
docker compose build web  # Gemfileを変更した場合は再ビルドが必要

# コントローラーの生成
docker compose run --rm web rails generate controller <controller_name>

# モデルの生成
docker compose run --rm web rails generate model <model_name>
```

### データベースコマンド

```bash
# データベースの作成
docker compose run --rm web rails db:create

# データベースのリセット
docker compose run --rm web rails db:reset

# シードデータの投入
docker compose run --rm web rails db:seed
```

### MySQL に直接接続

```bash
docker compose exec db mysql -u rails -p rails_practice_development
# パスワード: password
```

## ファイル構成

```
.
├── README.md               # このファイル
├── Dockerfile              # Railsアプリケーション用のDockerfile
├── docker-compose.yml      # Docker Composeの設定ファイル
├── init-db.sql             # MySQLの初期化スクリプト
├── .dockerignore           # Dockerビルド時に除外するファイル
├── .gitignore              # プロジェクト全体のGitignore
├── Gemfile                 # プロジェクト管理用のGemfile
├── Gemfile.lock            # プロジェクト管理用のGemfile.lock
└── src/                    # Railsアプリケーションのソースコード
    ├── app/                # Railsのアプリケーションコード
    ├── config/             # Rails設定ファイル
    │   └── database.yml    # データベース設定
    ├── db/                 # データベースファイル
    ├── Gemfile             # Railsアプリケーション用のGemfile
    ├── Gemfile.lock        # Railsアプリケーション用のGemfile.lock
    └── ...                 # その他のRailsファイル
```

## 環境変数

以下の環境変数が docker-compose.yml で設定されています：

- `DATABASE_HOST`: データベースのホスト名 (db)
- `DATABASE_USERNAME`: データベースのユーザー名 (rails)
- `DATABASE_PASSWORD`: データベースのパスワード (password)
- `DATABASE_NAME`: データベース名 (rails_practice_development)
- `RAILS_ENV`: Rails 環境 (development)

## トラブルシューティング

### ポートが既に使用されている場合

```bash
# ポート使用状況の確認
lsof -i :3000
lsof -i :3306

# プロセスの終了
kill -9 <PID>
```

### データベース接続エラー

```bash
# データベースコンテナのログを確認
docker compose logs db

# データベースコンテナの再起動
docker compose restart db
```

### Gemfile を変更した場合

```bash
# bundle installを実行
docker compose run --rm web bundle install

# イメージの再ビルド
docker compose build web

# コンテナの再起動
docker compose up
```

### すべてをリセットしたい場合

```bash
# すべてのコンテナとボリュームを削除
docker compose down -v
docker compose build --no-cache
docker compose up
```

## 開発のヒント

1. **ファイル編集**: ローカルファイルの変更は即座にコンテナ内に反映されます
2. **ログ確認**: `docker compose logs web` で Rails のログを確認できます
3. **デバッグ**: `binding.pry`や`byebug`を使用する場合は、`docker compose up`ではなく`docker compose run --rm web rails server -b 0.0.0.0`を使用してください
