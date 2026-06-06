from __future__ import annotations

import logging
import os
from dataclasses import dataclass, replace
from pathlib import Path

from voidad_dns.network import get_lan_ipv4

ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT_DIR / "data"
BLOCKLIST_PATH = DATA_DIR / "blocklist.json"

DEFAULT_ALLOWED_CIDRS = "127.0.0.0/8,192.168.0.0/24,10.0.0.0/8,172.16.0.0/12"

DEFAULT_BLOCKLIST = [
    "doubleclick.net",
    "googlesyndication.com",
    "googleadservices.com",
    "adservice.google.com",
    "facebook.net",
    "scorecardresearch.com",
    "analytics.google.com",
    "google-analytics.com",
]

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class Settings:
    """Runtime configuration (override via environment variables)."""

    dns_host: str = "127.0.0.1"
    dns_port: int = 53
    upstream_dns: str = "8.8.8.8"
    upstream_dns_fallback: str = "1.1.1.1"
    upstream_timeout: float = 2.0
    api_host: str = "127.0.0.1"
    api_port: int = 8053
    block_ttl: int = 300
    log_max_entries: int = 2000
    blocklist_path: Path = BLOCKLIST_PATH
    blocklist_auto_fetch: bool = True
    blocklist_source: str = "oisd-big"
    blocklist_refresh_hours: float = 24.0
    blocklist_refresh_check_interval: float = 3600.0
    blocklist_fetch_timeout: float = 120.0
    sync_url: str = ""
    sync_key: str = ""
    sync_interval: float = 30.0
    sync_timeout: float = 5.0
    report_url: str = ""
    report_interval: float = 10.0
    pattern_blocking_enabled: bool = True
    learned_blocks_enabled: bool = True
    learned_blocks_path: Path = DATA_DIR / "learned-blocks.jsonl"
    learned_blocks_max_entries: int = 5000
    lan_mode: bool = False
    client_filter_enabled: bool = True
    allowed_cidrs: str = DEFAULT_ALLOWED_CIDRS
    detected_lan_ip: str | None = None

    @classmethod
    def from_env(cls) -> Settings:
        lan_mode = os.getenv("VOIDAD_LAN_MODE", "false").lower() in ("1", "true", "yes")
        client_filter = os.getenv("VOIDAD_CLIENT_FILTER", "true").lower() in (
            "1",
            "true",
            "yes",
        )
        return cls(
            dns_host=os.getenv("VOIDAD_DNS_HOST", "127.0.0.1"),
            dns_port=int(os.getenv("VOIDAD_DNS_PORT", "53")),
            upstream_dns=os.getenv("VOIDAD_UPSTREAM_DNS", "8.8.8.8"),
            upstream_dns_fallback=os.getenv("VOIDAD_UPSTREAM_DNS_FALLBACK", "1.1.1.1"),
            upstream_timeout=float(os.getenv("VOIDAD_UPSTREAM_TIMEOUT", "4.0")),
            api_host=os.getenv("VOIDAD_API_HOST", "127.0.0.1"),
            api_port=int(os.getenv("VOIDAD_API_PORT", "8053")),
            block_ttl=int(os.getenv("VOIDAD_BLOCK_TTL", "300")),
            log_max_entries=int(os.getenv("VOIDAD_LOG_MAX_ENTRIES", "2000")),
            blocklist_path=Path(
                os.getenv("VOIDAD_BLOCKLIST_PATH", str(BLOCKLIST_PATH))
            ),
            blocklist_auto_fetch=os.getenv("VOIDAD_BLOCKLIST_AUTO_FETCH", "true").lower()
            in ("1", "true", "yes"),
            blocklist_source=os.getenv("VOIDAD_BLOCKLIST_SOURCE", "oisd-big"),
            blocklist_refresh_hours=float(
                os.getenv("VOIDAD_BLOCKLIST_REFRESH_HOURS", "24")
            ),
            blocklist_refresh_check_interval=float(
                os.getenv("VOIDAD_BLOCKLIST_REFRESH_CHECK_INTERVAL", "3600")
            ),
            blocklist_fetch_timeout=float(
                os.getenv("VOIDAD_BLOCKLIST_FETCH_TIMEOUT", "120")
            ),
            sync_url=os.getenv("VOIDAD_SYNC_URL", ""),
            sync_key=os.getenv("VOIDAD_DNS_SYNC_KEY", os.getenv("VOIDAD_SYNC_KEY", "")),
            sync_interval=float(os.getenv("VOIDAD_SYNC_INTERVAL", "30")),
            sync_timeout=float(os.getenv("VOIDAD_SYNC_TIMEOUT", "5")),
            report_url=os.getenv("VOIDAD_REPORT_URL", ""),
            report_interval=float(os.getenv("VOIDAD_REPORT_INTERVAL", "10")),
            pattern_blocking_enabled=os.getenv(
                "VOIDAD_PATTERN_BLOCKING", "true"
            ).lower()
            in ("1", "true", "yes"),
            learned_blocks_enabled=os.getenv("VOIDAD_LEARNED_BLOCKS", "true").lower()
            in ("1", "true", "yes"),
            learned_blocks_path=Path(
                os.getenv(
                    "VOIDAD_LEARNED_BLOCKS_PATH",
                    str(DATA_DIR / "learned-blocks.jsonl"),
                )
            ),
            learned_blocks_max_entries=int(
                os.getenv("VOIDAD_LEARNED_BLOCKS_MAX", "5000")
            ),
            lan_mode=lan_mode,
            client_filter_enabled=client_filter,
            allowed_cidrs=os.getenv("VOIDAD_ALLOWED_CIDRS", DEFAULT_ALLOWED_CIDRS),
        )


def resolve_bind_host(base: Settings) -> Settings:
    """Resolve auto/LAN bind address before the DNS server starts."""
    host = base.dns_host.strip().lower()
    lan_ip = get_lan_ipv4()

    if base.lan_mode and host in ("127.0.0.1", "localhost", "auto", "lan"):
        host = "auto"

    if host in ("auto", "lan"):
        if lan_ip:
            host = lan_ip
        else:
            logger.warning("Could not detect LAN IP — falling back to 127.0.0.1")
            host = "127.0.0.1"

    if host != base.dns_host or lan_ip != base.detected_lan_ip:
        return replace(base, dns_host=host, detected_lan_ip=lan_ip)
    return replace(base, detected_lan_ip=lan_ip)


settings = resolve_bind_host(Settings.from_env())
