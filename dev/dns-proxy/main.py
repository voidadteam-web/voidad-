#!/usr/bin/env python3
"""Entry point for the VoidAd local DNS proxy."""

from __future__ import annotations

import logging
import sys

import uvicorn

from voidad_dns.api import create_app
from voidad_dns.blocklist_fetcher import ensure_blocklist
from voidad_dns.config import settings

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


def main() -> None:
    if settings.dns_port < 1024:
        print(
            f"Note: binding to port {settings.dns_port} requires elevated privileges.\n"
            "Run with: sudo python main.py\n"
            "Or use a high port: VOIDAD_DNS_PORT=5353 python main.py\n",
            file=sys.stderr,
        )

    count = ensure_blocklist()
    logger.info("Blocklist ready with %s domains", count)
    logger.info(
        "Pattern blocking: %s | Learned-block log: %s → %s",
        "ON" if settings.pattern_blocking_enabled else "OFF",
        "ON" if settings.learned_blocks_enabled else "OFF",
        settings.learned_blocks_path,
    )

    app = create_app()
    uvicorn.run(
        app,
        host=settings.api_host,
        port=settings.api_port,
        log_level="info",
        access_log=False,
    )


if __name__ == "__main__":
    main()
