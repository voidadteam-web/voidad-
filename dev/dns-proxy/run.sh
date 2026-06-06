#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"
PYTHON="$ROOT/.venv/bin/python"

if [[ ! -d .venv ]]; then
  python3 -m venv .venv
fi

# shellcheck disable=SC1091
source .venv/bin/activate
pip install -q -r requirements.txt

stop_existing() {
  echo "Checking for existing DNS server on port 53…"
  sudo pkill -f "${ROOT}/.venv/bin/python" 2>/dev/null || true
  sudo pkill -f "${ROOT}/main.py" 2>/dev/null || true

  local pids
  pids="$(sudo lsof -t -iUDP:53 -iTCP:53 2>/dev/null | sort -u || true)"
  if [[ -n "${pids}" ]]; then
    echo "Freeing port 53 (PIDs: ${pids})…"
    # shellcheck disable=SC2086
    sudo kill ${pids} 2>/dev/null || true
    sleep 1
    # shellcheck disable=SC2086
    sudo kill -9 ${pids} 2>/dev/null || true
    sleep 1
  fi
}

echo "Updating DNS blocklist (OISD Big — black hole mode)…"
PYTHONPATH="$ROOT" "$PYTHON" scripts/fetch_blocklist.py --if-stale 24 || true

if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
  echo "Loaded DNS proxy env (report → ${VOIDAD_REPORT_URL:-not set})"
fi

# Need sudo to stop root-owned DNS process — do it before re-exec
stop_existing

echo "Starting VoidAd DNS Proxy..."
echo "  Dashboard: http://127.0.0.1:8053"
echo "  DNS:       127.0.0.1:53 (requires sudo)"
echo ""

if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
  echo "Port 53 needs root privileges. Re-launching with sudo..."
  exec sudo -E env "PATH=$PATH" "PYTHONPATH=$ROOT" \
    "VOIDAD_SYNC_URL=${VOIDAD_SYNC_URL:-}" \
    "VOIDAD_REPORT_URL=${VOIDAD_REPORT_URL:-}" \
    "VOIDAD_DNS_SYNC_KEY=${VOIDAD_DNS_SYNC_KEY:-}" \
    "$PYTHON" main.py
fi

# Preserve env vars through sudo (sync/report URLs)
exec env "PYTHONPATH=$ROOT" \
  "VOIDAD_SYNC_URL=${VOIDAD_SYNC_URL:-}" \
  "VOIDAD_REPORT_URL=${VOIDAD_REPORT_URL:-}" \
  "VOIDAD_DNS_SYNC_KEY=${VOIDAD_DNS_SYNC_KEY:-}" \
  "$PYTHON" main.py
