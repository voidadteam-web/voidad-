from __future__ import annotations

import json
import logging
import re
import threading
from pathlib import Path

from voidad_dns.blocklist_fetcher import VOIDAD_EXTRA_DOMAINS
from voidad_dns.config import DEFAULT_BLOCKLIST, settings

logger = logging.getLogger(__name__)

SUPPLEMENTAL_PATH = settings.blocklist_path.parent / "supplemental-blocklist.txt"

DOMAIN_PATTERN = re.compile(
    r"^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$"
)


def normalize_domain(domain: str) -> str:
    """Lowercase and strip trailing dot from a domain name."""
    return domain.strip().lower().rstrip(".")


def is_valid_domain(domain: str) -> bool:
    normalized = normalize_domain(domain)
    if not normalized or len(normalized) > 253:
        return False
    return DOMAIN_PATTERN.fullmatch(normalized) is not None


class Blocklist:
    """
    Thread-safe domain blocklist backed by a Python set.

    Lookup is O(label_count) with O(1) set membership per suffix, so
    checking ``ad.doubleclick.net`` when ``doubleclick.net`` is blocked
    requires no separate entry — we walk parent suffixes:

        ad.doubleclick.net → doubleclick.net → net
    """

    def __init__(self, path: Path | None = None) -> None:
        self._path = path or settings.blocklist_path
        self._txt_path = self._path.with_suffix(".txt")
        self._lock = threading.RLock()
        self._domains: frozenset[str] = frozenset()
        self._loaded_mtime: float = 0.0
        self._supplemental_mtime: float = 0.0
        self._load(force=True)

    def _source_path(self) -> Path | None:
        if self._txt_path.exists():
            return self._txt_path
        if self._path.exists():
            return self._path
        return None

    def _read_supplemental(self) -> frozenset[str]:
        if not SUPPLEMENTAL_PATH.exists():
            return frozenset()
        return frozenset(
            normalize_domain(line)
            for line in SUPPLEMENTAL_PATH.read_text(encoding="utf-8").splitlines()
            if line.strip() and not line.strip().startswith("#") and is_valid_domain(line)
        )

    def _merge_runtime_extras(self, domains: frozenset[str]) -> frozenset[str]:
        """Always apply curated extras + supplemental file (no full re-download needed)."""
        return domains | VOIDAD_EXTRA_DOMAINS | self._read_supplemental()

    def _parse_file(self, source: Path) -> frozenset[str]:
        if source == self._txt_path:
            raw = source.read_text(encoding="utf-8")
            domains = frozenset(
                normalize_domain(line)
                for line in raw.splitlines()
                if line.strip() and is_valid_domain(line)
            )
            return self._merge_runtime_extras(domains)

        raw = json.loads(source.read_text(encoding="utf-8"))
        items = raw.get("domains", raw if isinstance(raw, list) else [])
        domains = frozenset(
            normalize_domain(item)
            for item in items
            if isinstance(item, str) and is_valid_domain(item)
        )
        return self._merge_runtime_extras(domains)

    def _supplemental_mtime_now(self) -> float:
        if not SUPPLEMENTAL_PATH.exists():
            return 0.0
        return SUPPLEMENTAL_PATH.stat().st_mtime

    def _load(self, *, force: bool = False) -> None:
        source = self._source_path()
        self._path.parent.mkdir(parents=True, exist_ok=True)
        if source is None:
            domains = self._merge_runtime_extras(
                frozenset(normalize_domain(d) for d in DEFAULT_BLOCKLIST)
            )
            with self._lock:
                self._domains = domains
            self._save()
            self._loaded_mtime = self._txt_path.stat().st_mtime
            self._supplemental_mtime = self._supplemental_mtime_now()
            logger.warning("No blocklist file found — using %s fallback domains", len(domains))
            return

        mtime = source.stat().st_mtime
        sup_mtime = self._supplemental_mtime_now()
        if not force and mtime == self._loaded_mtime and sup_mtime == self._supplemental_mtime:
            return

        domains = self._parse_file(source)
        with self._lock:
            self._domains = domains
            self._loaded_mtime = mtime
            self._supplemental_mtime = sup_mtime
        logger.info("Blocklist loaded: %s domains from %s", len(domains), source.name)

    def reload(self) -> int:
        self._load(force=True)
        return self.count()

    def _maybe_reload(self) -> None:
        source = self._source_path()
        if source is None:
            return
        if (
            source.stat().st_mtime != self._loaded_mtime
            or self._supplemental_mtime_now() != self._supplemental_mtime
        ):
            self._load(force=True)

    def _save(self) -> None:
        sorted_domains = sorted(self._domains)
        self._txt_path.write_text("\n".join(sorted_domains) + "\n", encoding="utf-8")
        payload = {"domains": sorted_domains}
        self._path.write_text(
            json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        self._loaded_mtime = self._txt_path.stat().st_mtime

    def list_domains(self) -> list[str]:
        self._maybe_reload()
        return sorted(self._domains)

    def count(self) -> int:
        self._maybe_reload()
        return len(self._domains)

    def add(self, domain: str) -> str:
        normalized = normalize_domain(domain)
        if not is_valid_domain(normalized):
            raise ValueError(f"Invalid domain: {domain!r}")
        with self._lock:
            self._domains = frozenset(set(self._domains) | {normalized})
            self._save()
        return normalized

    def remove(self, domain: str) -> bool:
        normalized = normalize_domain(domain)
        with self._lock:
            if normalized not in self._domains:
                return False
            self._domains = frozenset(set(self._domains) - {normalized})
            self._save()
            return True

    def is_blocked(self, domain: str) -> bool:
        """
        Return True if *domain* or any parent suffix is in the blocklist.

        Each suffix check is O(1) set lookup; typical depth is 3–6 labels.
        """
        self._maybe_reload()
        normalized = normalize_domain(domain)
        labels = normalized.split(".")
        domains = self._domains
        for index in range(len(labels)):
            if ".".join(labels[index:]) in domains:
                return True
        return False
