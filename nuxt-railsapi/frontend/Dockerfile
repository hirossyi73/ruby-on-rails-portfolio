# Node.js 20を使用（標準版でネイティブバインディング対応）
FROM node:20

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY src/package*.json ./

# npm依存関係をインストール
RUN npm install

# Nuxtをグローバルインストール（不要なので削除）
# RUN npm install -g nuxt@latest

# アプリケーションのソースコードをコピー
COPY src/ .

# ポート3000を公開
EXPOSE 3000

# Nuxt.js開発サーバーを起動
CMD ["npm", "run", "dev"]
