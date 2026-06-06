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

# Home LAN mode: bind DNS to Mac Wi‑Fi IP so phones/TVs can use it
: "${VOIDAD_LAN_MODE:=0}"
: "${VOIDAD_CLIENT_FILTER:=true}"
: "${VOIDAD_ALLOWED_CIDRS:=127.0.0.0/8,192.168.0.0/24,10.0.0.0/8,172.16.0.0/12}"
: "${VOIDAD_UPSTREAM_DNS_FALLBACK:=1.1.1.1}"

if [[ "${VOIDAD_LAN_MODE}" == "1" || "${VOIDAD_LAN_MODE}" == "true" ]]; then
  if [[ -z "${VOIDAD_DNS_HOST:-}" || "${VOIDAD_DNS_HOST}" == "127.0.0.1" ]]; then
    VOIDAD_DNS_HOST="auto"
  fi
  LAN_IP="$(ipconfig getifaddr en0 2>/dev/null || true)"
  echo ""
  echo "  LAN mode ON — home devices can use this Mac as DNS"
  if [[ -n "${LAN_IP}" ]]; then
    echo "  Mac LAN IP: ${LAN_IP}  → set router Primary DNS to this address"
    echo "  Router Secondary DNS: ${VOIDAD_UPSTREAM_DNS_FALLBACK} (fallback if Mac is off)"
  else
    echo "  Could not read en0 IP — set VOIDAD_DNS_HOST manually to your Mac LAN IP"
  fi
  echo "  Allowed clients: ${VOIDAD_ALLOWED_CIDRS}"
  echo ""
fi

# Need sudo to stop root-owned DNS process — do it before re-exec
stop_existing

echo "Starting VoidAd DNS Proxy..."
echo "  Dashboard: http://127.0.0.1:8053"
if [[ "${VOIDAD_DNS_HOST:-127.0.0.1}" == "auto" ]]; then
  echo "  DNS:       auto-detect LAN IP:53 (requires sudo)"
else
  echo "  DNS:       ${VOIDAD_DNS_HOST:-127.0.0.1}:53 (requires sudo)"
fi
echo ""

RUN_ENV=(
  "PYTHONPATH=$ROOT"
  "VOIDAD_SYNC_URL=${VOIDAD_SYNC_URL:-}"
  "VOIDAD_REPORT_URL=${VOIDAD_REPORT_URL:-}"
  "VOIDAD_DNS_SYNC_KEY=${VOIDAD_DNS_SYNC_KEY:-}"
  "VOIDAD_LAN_MODE=${VOIDAD_LAN_MODE}"
  "VOIDAD_DNS_HOST=${VOIDAD_DNS_HOST:-127.0.0.1}"
  "VOIDAD_CLIENT_FILTER=${VOIDAD_CLIENT_FILTER}"
  "VOIDAD_ALLOWED_CIDRS=${VOIDAD_ALLOWED_CIDRS}"
  "VOIDAD_UPSTREAM_DNS_FALLBACK=${VOIDAD_UPSTREAM_DNS_FALLBACK}"
)

if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
  echo "Port 53 needs root privileges. Re-launching with sudo..."
  exec sudo -E env "PATH=$PATH" "${RUN_ENV[@]}" "$PYTHON" main.py
fi

exec env "${RUN_ENV[@]}" "$PYTHON" main.py
