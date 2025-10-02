#!/bin/bash

# Vue + Rails API プロジェクトの初期化スクリプト

echo "Vue + Rails API プロジェクトの初期化を開始します..."

# Rails API アプリケーションの生成
echo "Rails API アプリケーションを生成しています..."
docker-compose run --rm backend bash -c "cd /tmp && rails new . --api --database=mysql --skip-git && cp -r . /app/"

# Vue.js アプリケーションの生成
echo "Vue.js アプリケーションを生成しています..."
docker-compose run --rm frontend bash -c "cd /tmp && vue create . --default && cp -r . /app/"

# データベースのセットアップ
echo "データベースをセットアップしています..."
docker-compose run --rm backend bash -c "bundle exec rails db:create && bundle exec rails db:migrate"

echo "初期化が完了しました！"
echo ""
echo "アプリケーションを起動するには:"
echo "docker-compose up"
echo ""
echo "アクセス先:"
echo "フロントエンド: http://localhost:8080"
echo "バックエンド API: http://localhost:3000"
