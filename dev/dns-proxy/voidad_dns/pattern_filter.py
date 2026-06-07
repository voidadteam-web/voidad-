"""Pattern-based ad/tracker detection and learned-block logging."""

from __future__ import annotations

import json
import logging
import threading
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path

from voidad_dns.blocklist import normalize_domain
from voidad_dns.config import settings

logger = logging.getLogger(__name__)


class BlockReason(str, Enum):
    LIST = "list"  # static blocklist (includes recursive suffix match)
    PATTERN = "pattern"  # heuristic label pattern


@dataclass(frozen=True)
class FilterMatch:
    blocked: bool
    reason: BlockReason | None = None
    detail: str = ""


# Exact DNS labels that strongly indicate ads/trackers (checked per label, not substring).
EXACT_LABELS: frozenset[str] = frozenset(
    {
        "ad",
        "ads",
        "ad2",
        "ad3",
        "track",
        "tracker",
        "tracking",
        "analytics",
        "telemetry",
        "metrics",
        "pixel",
        "beacon",
        "banner",
        "pop",
        "popup",
        "popunder",
        "adserver",
        "adserv",
        "adservice",
        "syndication",
        "affiliate",
        "affiliates",
        "sponsored",
        "clicktrack",
        "redirect",
        "impression",
        "stat",
        "stats",
        "spin",
        "bet",
        "poker",
        "slot",
        "wager",
        "jackpot",
        "lottery",
    }
)

# Substrings matched inside a single label (min length 5 avoids pad/load/admin false positives).
LABEL_SUBSTRINGS: tuple[str, ...] = (
    "adserver",
    "adserv",
    "adtrack",
    "adslot",
    "doubleclick",
    "googlesyndication",
    "telemetry",
    "analytics",
    "tracking",
    "tracker",
    "popunder",
    "popads",
    "clicktrack",
    "affiliate",
    "syndic",
    "sponsored",
    "impression",
    "adbanner",
    "ad-banner",
    "hitnspin",
    "casino",
    "betting",
    "gambl",
    "poker",
    "jackpot",
    "lottery",
    "1xbet",
    "betway",
    "stake",
    "slots",
    "roulette",
)

# Prefix/suffix on a label (e.g. ads-foo, foo-ad).
LABEL_PREFIXES: tuple[str, ...] = ("ad-", "ads-", "ad.", "ads.")
LABEL_SUFFIXES: tuple[str, ...] = ("-ad", "-ads", "-track", "-tracker")

# TLDs abused by popup/redirect ad networks (streaming sites, etc.)
ROTATOR_TLDS: frozenset[str] = frozenset(
    {
        "cfd",
        "sbs",
        "bond",
        "lat",
        "monster",
        "icu",
        "buzz",
        "rest",
        "hair",
        "makeup",
        "quest",
        "pw",
        "top",
        "xyz",
        "cam",
        "click",
        "tk",
        "ml",
        "ga",
        "cf",
    }
)

# Never pattern-block these registrable suffixes (avoid breaking core services).
ALLOWLIST_SUFFIXES: frozenset[str] = frozenset(
    {
        "localhost",
        "local",
        "apple.com",
        "icloud.com",
        "microsoft.com",
        "windows.com",
        "office.com",
        "github.com",
        "wikipedia.org",
        "supabase.co",
        "voidad.com",
    }
)


def _is_rotator_domain(normalized: str, *, aggressive: bool, max_mode: bool = False) -> str | None:
    """Block domains used by popup ad rotators (common on streaming sites)."""
    labels = normalized.split(".")
    if len(labels) < 2:
        return None

    tld = labels[-1]
    base = labels[-2]

    if tld in ROTATOR_TLDS:
        return f"rotator-tld:{tld}"

    if tld in ("bet", "casino", "poker"):
        return f"gambling-tld:{tld}"

    if tld == "shop" and len(base) >= 10 and base.isalpha():
        return "rotator-tld:shop"

    min_long_com = 12 if max_mode else 22
    if (aggressive or max_mode) and tld == "com" and len(labels) == 2:
        if len(base) >= min_long_com and base.isalpha():
            return "rotator-name:long-com"

    return None


def _label_matches(label: str) -> str | None:
    """Return matching pattern name if label looks like ad/tracker infrastructure."""
    lower = label.lower()
    if len(lower) < 2:
        return None
    if lower in EXACT_LABELS:
        return f"label:{lower}"
    for prefix in LABEL_PREFIXES:
        if lower.startswith(prefix):
            return f"prefix:{prefix.rstrip('.-')}"
    for suffix in LABEL_SUFFIXES:
        if lower.endswith(suffix):
            return f"suffix:{suffix.lstrip('-')}"
    for sub in LABEL_SUBSTRINGS:
        if sub in lower:
            return f"substring:{sub}"
    return None


class PatternFilter:
    """
    Proactive pattern matcher — O(labels × patterns), typically < 30 ops per query.

    Works label-by-label so ``admin.example.com`` is not blocked for containing ``ad``.
    """

    def match(self, domain: str, *, aggressive: bool = False, max_mode: bool = False) -> FilterMatch:
        if not settings.pattern_blocking_enabled:
            return FilterMatch(blocked=False)

        normalized = normalize_domain(domain)
        labels = normalized.split(".")
        if len(labels) < 2:
            return FilterMatch(blocked=False)

        for suffix in ALLOWLIST_SUFFIXES:
            if normalized == suffix or normalized.endswith(f".{suffix}"):
                return FilterMatch(blocked=False)

        use_aggressive = aggressive or max_mode
        rotator = _is_rotator_domain(normalized, aggressive=use_aggressive, max_mode=max_mode)
        if rotator:
            return FilterMatch(blocked=True, reason=BlockReason.PATTERN, detail=rotator)

        for label in labels:
            hit = _label_matches(label)
            if hit:
                return FilterMatch(blocked=True, reason=BlockReason.PATTERN, detail=hit)
        return FilterMatch(blocked=False)


class LearnedBlockLog:
    """Records domains blocked by patterns (not static list) for human review."""

    def __init__(self, path: Path | None = None) -> None:
        self._path = path or settings.learned_blocks_path
        self._lock = threading.RLock()
        self._seen: set[str] = set()
        self._path.parent.mkdir(parents=True, exist_ok=True)
        self._load_seen()

    def _load_seen(self) -> None:
        if not self._path.exists():
            return
        try:
            for line in self._path.read_text(encoding="utf-8").splitlines():
                if not line.strip():
                    continue
                row = json.loads(line)
                domain = row.get("domain")
                if isinstance(domain, str):
                    self._seen.add(normalize_domain(domain))
        except (json.JSONDecodeError, OSError) as exc:
            logger.warning("Could not load learned blocks: %s", exc)

    def record(
        self,
        domain: str,
        pattern: str,
        *,
        client: str = "",
        on_blocklist: bool = False,
    ) -> None:
        if not settings.learned_blocks_enabled:
            return
        normalized = normalize_domain(domain)
        with self._lock:
            if normalized in self._seen:
                return
            if len(self._seen) >= settings.learned_blocks_max_entries:
                return
            self._seen.add(normalized)
            row = {
                "domain": normalized,
                "pattern": pattern,
                "client": client,
                "on_blocklist": on_blocklist,
                "recorded_at": datetime.now(timezone.utc).isoformat(),
            }
            with self._path.open("a", encoding="utf-8") as handle:
                handle.write(json.dumps(row, ensure_ascii=False) + "\n")

    def recent(self, limit: int = 100) -> list[dict]:
        if not self._path.exists():
            return []
        lines = self._path.read_text(encoding="utf-8").splitlines()
        rows: list[dict] = []
        for line in reversed(lines[-limit * 2 :]):
            if not line.strip():
                continue
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError:
                continue
            if len(rows) >= limit:
                break
        return rows

    def count(self) -> int:
        with self._lock:
            return len(self._seen)

    def clear(self) -> None:
        with self._lock:
            self._seen.clear()
            if self._path.exists():
                self._path.unlink()
