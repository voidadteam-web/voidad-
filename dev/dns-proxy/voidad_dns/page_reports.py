"""Browser extension reports ad-heavy pages → dynamic supplemental blocking."""

from __future__ import annotations

import json
import logging
import threading
from datetime import datetime, timezone
from pathlib import Path

from voidad_dns.blocklist import Blocklist, is_valid_domain, normalize_domain
from voidad_dns.config import DATA_DIR, settings

logger = logging.getLogger(__name__)

REPORTS_PATH = DATA_DIR / "extension-page-reports.jsonl"
SUPPLEMENTAL_PATH = settings.blocklist_path.parent / "supplemental-blocklist.txt"


class PageReportStore:
    """Accept ad domains from the browser layer and promote to supplemental DNS blocklist."""

    def __init__(self, blocklist: Blocklist) -> None:
        self._blocklist = blocklist
        self._lock = threading.RLock()
        self._seen: set[str] = set()
        self._load_seen()

    def _load_seen(self) -> None:
        if not SUPPLEMENTAL_PATH.exists():
            return
        for line in SUPPLEMENTAL_PATH.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and is_valid_domain(line):
                self._seen.add(normalize_domain(line))

    def _append_supplemental(self, domain: str) -> bool:
        normalized = normalize_domain(domain)
        if not is_valid_domain(normalized):
            return False
        with self._lock:
            if normalized in self._seen:
                return False
            self._seen.add(normalized)
            SUPPLEMENTAL_PATH.parent.mkdir(parents=True, exist_ok=True)
            with SUPPLEMENTAL_PATH.open("a", encoding="utf-8") as handle:
                handle.write(normalized + "\n")
        self._blocklist.reload()
        return True

    def record(
        self,
        *,
        page_host: str,
        ad_domains: list[str],
        page_url: str | None = None,
    ) -> dict:
        added: list[str] = []
        skipped: list[str] = []

        for raw in ad_domains[:50]:
            normalized = normalize_domain(raw)
            if not is_valid_domain(normalized):
                skipped.append(raw)
                continue
            if self._blocklist.is_blocked(normalized):
                skipped.append(normalized)
                continue
            if self._append_supplemental(normalized):
                added.append(normalized)
                logger.info(
                    "Extension promoted %s (from page %s)", normalized, page_host
                )

        row = {
            "page_host": page_host,
            "page_url": page_url,
            "added": added,
            "reported_at": datetime.now(timezone.utc).isoformat(),
        }
        REPORTS_PATH.parent.mkdir(parents=True, exist_ok=True)
        with REPORTS_PATH.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")

        return {
            "ok": True,
            "page_host": page_host,
            "added": added,
            "added_count": len(added),
            "blocklist_count": self._blocklist.count(),
        }

    def recent(self, limit: int = 50) -> list[dict]:
        if not REPORTS_PATH.exists():
            return []
        lines = REPORTS_PATH.read_text(encoding="utf-8").splitlines()
        rows: list[dict] = []
        for line in reversed(lines):
            if not line.strip():
                continue
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError:
                continue
            if len(rows) >= limit:
                break
        return rows
