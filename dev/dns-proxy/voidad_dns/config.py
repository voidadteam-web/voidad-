from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT_DIR / "data"
BLOCKLIST_PATH = DATA_DIR / "blocklist.json"

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


@dataclass(frozen=True)
class Settings:
    """Runtime configuration (override via environment variables)."""

    dns_host: str = "127.0.0.1"
    dns_port: int = 53
    upstream_dns: str = "8.8.8.8"
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

    @classmethod
    def from_env(cls) -> Settings:
        return cls(
            dns_host=os.getenv("VOIDAD_DNS_HOST", "127.0.0.1"),
            dns_port=int(os.getenv("VOIDAD_DNS_PORT", "53")),
            upstream_dns=os.getenv("VOIDAD_UPSTREAM_DNS", "8.8.8.8"),
            upstream_timeout=float(os.getenv("VOIDAD_UPSTREAM_TIMEOUT", "2.0")),
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
        )


settings = Settings.from_env()
