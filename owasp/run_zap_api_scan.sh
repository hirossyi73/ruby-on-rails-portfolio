#!/usr/bin/env bash
set -euo pipefail

# ==============================
# 必須 / 任意 変数チェック（既存）
# ==============================
: "${SERVICE_API_NAME:?SERVICE_API_NAME is required (e.g. 'api')}"
: "${OUT_DIR:?OUT_DIR is required (e.g. './zap-out')}"
: "${ZAP_IMAGE:?ZAP_IMAGE is required (e.g. 'owasp/zap2docker-weekly')}"
: "${AScanDurationMins:?AScanDurationInMins is required (e.g. '2')}"
if [[ -z "${OPENAPI_URL:-}" && -z "${OPENAPI_LOCAL_FILE:-}" ]]; then
  echo "[ERROR] Either OPENAPI_URL or OPENAPI_LOCAL_FILE must be set."
  exit 1
fi

# ここから追加：ZAP_BEARER が未設定なら、AUTH_MODE に従って取得を試みる
ZAP_BEARER="${ZAP_BEARER:-}"
AUTH_MODE="${AUTH_MODE:-}"  # oauth2_password / custom_login / 空

if [[ -z "$ZAP_BEARER" && -n "$AUTH_MODE" ]]; then
  echo "[INFO] ZAP_BEARER is empty. Trying to obtain token via AUTH_MODE=${AUTH_MODE}"

  if [[ "$AUTH_MODE" == "oauth2_password" ]]; then
    : "${TOKEN_URL:?TOKEN_URL required}"
    : "${CLIENT_ID:?CLIENT_ID required}"
    : "${CLIENT_SECRET:?CLIENT_SECRET required}"
    : "${USERNAME:?USERNAME required}"
    : "${PASSWORD:?PASSWORD required}"
    : "${TOKEN_JQ:?TOKEN_JQ required (e.g. .access_token)}"
    # 送信
    RESP=$(curl -sS -X POST "$TOKEN_URL" \
      -H 'Content-Type: application/x-www-form-urlencoded' \
      --data-urlencode "grant_type=password" \
      --data-urlencode "username=${USERNAME}" \
      --data-urlencode "password=${PASSWORD}" \
      --data-urlencode "client_id=${CLIENT_ID}" \
      --data-urlencode "client_secret=${CLIENT_SECRET}" \
      ${SCOPE:+--data-urlencode "scope=${SCOPE}"} )
    ZAP_BEARER=$(echo "$RESP" | jq -r "${TOKEN_JQ}")
    if [[ -z "$ZAP_BEARER" || "$ZAP_BEARER" == "null" ]]; then
      echo "[ERROR] Failed to extract access token with jq filter: ${TOKEN_JQ}"
      echo "[DEBUG] Response: $RESP"
      exit 1
    fi

  elif [[ "$AUTH_MODE" == "custom_login" ]]; then
    : "${LOGIN_URL:?LOGIN_URL required}"
    : "${LOGIN_METHOD:?LOGIN_METHOD required}"
    : "${LOGIN_CONTENT_TYPE:?LOGIN_CONTENT_TYPE required}"
    : "${LOGIN_BODY_TEMPLATE:?LOGIN_BODY_TEMPLATE required}"
    : "${USERNAME:?USERNAME required}"
    : "${PASSWORD:?PASSWORD required}"
    : "${TOKEN_JQ:?TOKEN_JQ required (e.g. .access_token)}"

    # 環境変数展開させるために eval 経由で JSON を組み立て
    EVAL_BODY=$(eval "echo \"${LOGIN_BODY_TEMPLATE}\"")
    RESP=$(curl -sS -X "$LOGIN_METHOD" "$LOGIN_URL" \
      -H "Content-Type: ${LOGIN_CONTENT_TYPE}" \
      -d "$EVAL_BODY")
    ZAP_BEARER=$(echo "$RESP" | jq -r "${TOKEN_JQ}")
    if [[ -z "$ZAP_BEARER" || "$ZAP_BEARER" == "null" ]]; then
      echo "[ERROR] Failed to extract access token with jq filter: ${TOKEN_JQ}"
      echo "[DEBUG] Response: $RESP"
      exit 1
    fi

  else
    echo "[ERROR] Unsupported AUTH_MODE: ${AUTH_MODE}"
    exit 1
  fi

  echo "[INFO] Token acquired."
fi

# ==============================
# ネットワーク検出 → OpenAPI設定 → exclude → replacer → 実行
# ==============================
API_CID=$(docker compose ps -q "$SERVICE_API_NAME" || true)
if [ -z "$API_CID" ]; then
  echo "[ERROR] Service '$SERVICE_API_NAME' is not running. Start with: docker compose up -d"
  exit 1
fi
NETWORK=$(docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{printf "%s " $k}}{{end}}' "$API_CID" | awk '{print $1}')
if [ -z "$NETWORK" ]; then
  echo "[ERROR] Could not detect docker network for '$SERVICE_API_NAME'."
  exit 1
fi
echo "[INFO] Using docker network: $NETWORK"

mkdir -p "$OUT_DIR"

TARGET_OPENAPI_ARG=""
MOUNT_OPENAPI=""
if [[ -n "${OPENAPI_LOCAL_FILE:-}" ]]; then
  [ -f "$OPENAPI_LOCAL_FILE" ] || { echo "[ERROR] OPENAPI_LOCAL_FILE not found: $OPENAPI_LOCAL_FILE"; exit 1; }
  MOUNT_OPENAPI="-v $(realpath "$OPENAPI_LOCAL_FILE"):/zap/wrk/openapi.json:ro"
  TARGET_OPENAPI_ARG="/zap/wrk/openapi.json"
else
  TARGET_OPENAPI_ARG="$OPENAPI_URL"
fi

EXCLUDE_ARGS=""
if [[ -n "${EXCLUDE_REGEX:-}" ]]; then
  IFS=',' read -ra REXARR <<< "$EXCLUDE_REGEX"
  for rex in "${REXARR[@]}"; do
    EXCLUDE_ARGS="${EXCLUDE_ARGS} -x \"${rex}\""
  done
fi

ZAP_REPLACER_CFG=""
if [[ -n "$ZAP_BEARER" ]]; then
  ZAP_REPLACER_CFG="-z \"-config replacer.full_list(0).description=Auth \
    -config replacer.full_list(0).enabled=true \
    -config replacer.full_list(0).matchtype=REQ_HEADER \
    -config replacer.full_list(0).matchstr=Authorization \
    -config replacer.full_list(0).regex=false \
    -config replacer.full_list(0).replacement=Bearer ${ZAP_BEARER}\""
fi

CMD="docker run --rm -t \
  --network ${NETWORK} \
  -v \"$(realpath "$OUT_DIR")\":/zap/wrk \
  ${MOUNT_OPENAPI} \
  ${ZAP_IMAGE} \
  zap-api-scan.py \
    -t \"${TARGET_OPENAPI_ARG}\" \
    -f openapi \
    -r zap-api-report.html \
    ${EXCLUDE_ARGS} \
    -z \"--config ascan.options.maxRuleDurationInMins=${AScanDurationMins}\""

if [[ -n "$ZAP_REPLACER_CFG" ]]; then
  CMD="${CMD} ${ZAP_REPLACER_CFG}"
fi

echo "[INFO] Running: $CMD"
eval $CMD
echo "[INFO] Done. Report: ${OUT_DIR}/zap-api-report.html"
