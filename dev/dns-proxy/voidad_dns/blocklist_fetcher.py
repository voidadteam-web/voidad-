"""Download, parse, and persist large ad-blocking domain lists."""

from __future__ import annotations

import json
import logging
import re
import urllib.error
import urllib.request
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path

from voidad_dns.config import DATA_DIR, settings

logger = logging.getLogger(__name__)

BLOCKLIST_TXT = settings.blocklist_path.with_suffix(".txt")
META_PATH = DATA_DIR / "blocklist.meta.json"

# Curated public blocklists (no user-supplied URLs in production).
OISD_BIG_URL = "https://big.oisd.nl/"
OISD_SMALL_URL = "https://small.oisd.nl/"
STEVENBLACK_HOSTS_URL = (
    "https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts"
)

VOIDAD_EXTRA_DOMAINS = frozenset(
    {
        "chaturbate.com",
        "chaturbate.eu",
        "stripchat.com",
        "livejasmin.com",
        "bongacams.com",
        "cam4.com",
        "popads.net",
        "popcash.com",
        "propellerads.com",
        "exoclick.com",
        "adsterra.com",
        "clickadu.com",
        "trafficjunky.com",
        "juicyads.com",
        "onclicka.com",
        "hilltopads.net",
        "revcontent.com",
        "mgid.com",
        "outbrain.com",
        "taboola.com",
        "doubleclick.net",
        "googlesyndication.com",
        "googleadservices.com",
        "adservice.google.com",
        "ads.youtube.com",
        "facebook.net",
        "scorecardresearch.com",
        # Affiliate / shopping redirect ads (common on streaming sites)
        "s.click.aliexpress.com",
        "click.aliexpress.com",
        "best.aliexpress.com",
        "promotion.aliexpress.com",
        "sale.aliexpress.com",
        "star.aliexpress.com",
        "redirect.viglink.com",
        "go.redirectingat.com",
        "go2cloud.org",
        "clk.tradedoubler.com",
        "track.adform.net",
        # Ad rotators seen on streaming / redirect sites
        "rtmark.net",
        "loen21.net",
        "channel2pod.net",
        "onclickalgo.com",
        "onclickmax.com",
        "onclickperformance.com",
        "adclick.g.doubleclick.net",
        "pagead2.googlesyndication.com",
        "static.doubleclick.net",
        "securepubads.g.doubleclick.net",
        "tpc.googlesyndication.com",
        "googleads.g.doubleclick.net",
        "ads-twitter.com",
        "ads-api.twitter.com",
        "ads.reddit.com",
        "amazon-adsystem.com",
        "advertising.com",
        "adnxs.com",
        "criteo.com",
        "criteo.net",
        "smartadserver.com",
        "rubiconproject.com",
        "pubmatic.com",
        "openx.net",
        "casalemedia.com",
        "lijit.com",
        "contextweb.com",
        "moatads.com",
        "2mdn.net",
        "admob.com",
    }
)

ABP_DOMAIN = re.compile(r"^\|\|([a-z0-9._-]+)\^", re.IGNORECASE)
PLAIN_DOMAIN = re.compile(
    r"^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9-]{2,63}$",
    re.IGNORECASE,
)


class BlocklistSource(str, Enum):
    OISD_BIG = "oisd-big"
    OISD_SMALL = "oisd-small"
    STEVENBLACK = "stevenblack"

    @property
    def url(self) -> str:
        return {
            BlocklistSource.OISD_BIG: OISD_BIG_URL,
            BlocklistSource.OISD_SMALL: OISD_SMALL_URL,
            BlocklistSource.STEVENBLACK: STEVENBLACK_HOSTS_URL,
        }[self]

    @classmethod
    def from_env(cls, value: str) -> BlocklistSource:
        try:
            return cls(value.strip().lower())
        except ValueError as exc:
            raise ValueError(
                f"Unknown blocklist source {value!r}. "
                f"Choose: {', '.join(s.value for s in cls)}"
            ) from exc


def parse_blocklist_text(text: str) -> set[str]:
    """Parse OISD (Adblock Plus), StevenBlack hosts, or plain domain lists."""
    domains: set[str] = set()
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith("!") or line.startswith("#"):
            continue

        match = ABP_DOMAIN.match(line)
        if match:
            domains.add(match.group(1).lower())
            continue

        if line.startswith(("0.0.0.0 ", "127.0.0.1 ")):
            parts = line.split()
            if len(parts) >= 2 and parts[1] != "localhost":
                candidate = parts[1].lower()
                if PLAIN_DOMAIN.fullmatch(candidate):
                    domains.add(candidate)
            continue

        if PLAIN_DOMAIN.fullmatch(line.lower()):
            domains.add(line.lower())

    domains.update(VOIDAD_EXTRA_DOMAINS)
    return domains


def download_blocklist(url: str, timeout: float | None = None) -> str:
    timeout = timeout or settings.blocklist_fetch_timeout
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "VoidAd-DNS/1.0 (+https://voidad.com)"},
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read().decode("utf-8", errors="replace")


def read_meta() -> dict | None:
    if not META_PATH.exists():
        return None
    try:
        return json.loads(META_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None


def is_stale(max_age_hours: float) -> bool:
    if not BLOCKLIST_TXT.exists():
        return True
    meta = read_meta()
    if not meta or "updated_at" not in meta:
        return True
    try:
        updated = datetime.fromisoformat(meta["updated_at"].replace("Z", "+00:00"))
        age_hours = (datetime.now(timezone.utc) - updated).total_seconds() / 3600
        return age_hours >= max_age_hours
    except (KeyError, ValueError):
        return True


def write_blocklist(domains: set[str], source: str) -> Path:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    sorted_domains = sorted(domains)
    BLOCKLIST_TXT.write_text("\n".join(sorted_domains) + "\n", encoding="utf-8")
    META_PATH.write_text(
        json.dumps(
            {
                "source": source,
                "count": len(sorted_domains),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    logger.info("Blocklist saved: %s domains from %s", len(sorted_domains), source)
    return BLOCKLIST_TXT


def fetch_and_save(
    source: BlocklistSource | None = None,
    *,
    force: bool = False,
) -> tuple[int, str]:
    """Download blocklist and persist to disk. Returns (count, source_url)."""
    chosen = source or BlocklistSource.from_env(settings.blocklist_source)
    url = chosen.url

    if not force and not is_stale(settings.blocklist_refresh_hours):
        meta = read_meta() or {}
        count = meta.get("count", 0)
        logger.info("Blocklist fresh (%s domains). Skipping download.", count)
        return int(count), str(meta.get("source", url))

    logger.info("Downloading blocklist from %s …", url)
    try:
        text = download_blocklist(url)
    except urllib.error.URLError as exc:
        if BLOCKLIST_TXT.exists():
            logger.warning("Download failed (%s). Keeping existing blocklist.", exc)
            meta = read_meta() or {}
            return int(meta.get("count", 0)), str(meta.get("source", url))
        raise

    domains = parse_blocklist_text(text)
    write_blocklist(domains, url)
    return len(domains), url


def ensure_blocklist(*, force: bool = False) -> int:
    """
    Ensure a blocklist file exists before the DNS server starts.

    Downloads on first run or when stale. Keeps existing file if download fails.
    """
    if not settings.blocklist_auto_fetch:
        if BLOCKLIST_TXT.exists():
            meta = read_meta() or {}
            return int(meta.get("count", 0))
        logger.warning(
            "Auto-fetch disabled and no blocklist.txt found. "
            "Using minimal fallback list."
        )
        return 0

    if BLOCKLIST_TXT.exists() and not force and not is_stale(settings.blocklist_refresh_hours):
        meta = read_meta() or {}
        count = int(meta.get("count", 0))
        logger.info("Using cached blocklist (%s domains).", count)
        return count

    count, _ = fetch_and_save(force=force)
    return count
