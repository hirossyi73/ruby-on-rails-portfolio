# Ruby 3.3を使用
FROM ruby:3.3

# 必要なパッケージをインストール
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    nodejs \
    npm \
    default-mysql-client \
    default-libmysqlclient-dev \
    libyaml-dev \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを設定
WORKDIR /app

# GemfileとGemfile.lockをコピー
COPY src/Gemfile src/Gemfile.lock ./

# Bundlerの最新版をインストール
RUN gem install bundler

# Gemをインストール
RUN bundle install --verbose

# アプリケーションのソースコードをコピー
COPY src/ .

# ポート3000を公開
EXPOSE 3000

# Railsサーバーを起動（APIモード）
CMD ["rails", "server", "-b", "0.0.0.0"]
