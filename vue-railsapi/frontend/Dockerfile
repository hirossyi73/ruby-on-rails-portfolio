# Node.js 18を使用
FROM node:18

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY src/package*.json ./

# npm依存関係をインストール
RUN npm install

# Vue CLIをグローバルインストール
RUN npm install -g @vue/cli

# アプリケーションのソースコードをコピー
COPY src/ .

# ポート8080を公開
EXPOSE 8080

# Vue.js開発サーバーを起動
CMD ["npm", "run", "serve"]
