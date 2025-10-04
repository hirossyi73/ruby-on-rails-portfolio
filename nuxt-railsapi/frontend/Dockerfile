# Node.js 18を使用
FROM node:18

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY src/package*.json ./

# npm依存関係をインストール
RUN npm install

# Nuxtをグローバルインストール
RUN npm install -g nuxt@latest

# アプリケーションのソースコードをコピー
COPY src/ .

# ポート3000を公開
EXPOSE 3000

# Nuxt.js開発サーバーを起動
CMD ["npm", "run", "dev"]
