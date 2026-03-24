#!/usr/bin/env bash
set -euo pipefail

cd /repo

export FASTCLAW_STATE_DIR="/tmp/fastclaw-test"
export FASTCLAW_CONFIG_PATH="${FASTCLAW_STATE_DIR}/fastclaw.json"

echo "==> Build"
pnpm build

echo "==> Seed state"
mkdir -p "${FASTCLAW_STATE_DIR}/credentials"
mkdir -p "${FASTCLAW_STATE_DIR}/agents/main/sessions"
echo '{}' >"${FASTCLAW_CONFIG_PATH}"
echo 'creds' >"${FASTCLAW_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${FASTCLAW_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
pnpm fastclaw reset --scope config+creds+sessions --yes --non-interactive

test ! -f "${FASTCLAW_CONFIG_PATH}"
test ! -d "${FASTCLAW_STATE_DIR}/credentials"
test ! -d "${FASTCLAW_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${FASTCLAW_STATE_DIR}/credentials"
echo '{}' >"${FASTCLAW_CONFIG_PATH}"

echo "==> Uninstall (state only)"
pnpm fastclaw uninstall --state --yes --non-interactive

test ! -d "${FASTCLAW_STATE_DIR}"

echo "OK"
