#!/usr/bin/env bash

#docker compose up -d
set -a && source ./.env && set +a
chmod +x ./run_zap_api_scan.sh
./run_zap_api_scan.sh
# → ./zap-out/zap-api-report.html が出力
