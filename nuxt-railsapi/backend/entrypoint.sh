#!/usr/bin/env bash
set -euo pipefail

cd /app
export BUNDLE_GEMFILE="/app/Gemfile"

# 1) bin/rails が無ければ Bundler の binstub を生成
if [ ! -x "bin/rails" ]; then
  echo "[entrypoint] generate binstubs via bundler..."
  # rails の実行ファイル(= railties が提供)を bin/ に作る
  bundle binstubs railties --path=bin
  # rake も明示的に（なくても動くことが多いですが、揃えておくと安心）
  bundle binstubs rake --path=bin || true
  chmod +x bin/* 2>/dev/null || true
fi

echo "[entrypoint] bundle: $(bundle -v)"
echo "[entrypoint] rails : $(bin/rails -v)"

rm -f tmp/pids/server.pid
exec bin/rails server -b 0.0.0.0 -p 3000
