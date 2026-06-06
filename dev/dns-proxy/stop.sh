#!/usr/bin/env bash
# Stop VoidAd DNS server and free port 53
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Stopping VoidAd DNS server…"

sudo pkill -f "${ROOT}/.venv/bin/python" 2>/dev/null || true
sudo pkill -f "${ROOT}/main.py" 2>/dev/null || true
sudo pkill -f "dns-proxy.*main.py" 2>/dev/null || true

PIDS="$(sudo lsof -t -iUDP:53 -iTCP:53 2>/dev/null | sort -u || true)"
if [[ -n "${PIDS}" ]]; then
  echo "Freeing port 53 (PIDs: ${PIDS})…"
  # shellcheck disable=SC2086
  sudo kill ${PIDS} 2>/dev/null || true
  sleep 1
  # shellcheck disable=SC2086
  sudo kill -9 ${PIDS} 2>/dev/null || true
  sleep 1
fi

if sudo lsof -i :53 >/dev/null 2>&1; then
  echo "Warning: port 53 still in use:"
  sudo lsof -i :53
  exit 1
fi

echo "Port 53 is free. Run ./run.sh to start."
