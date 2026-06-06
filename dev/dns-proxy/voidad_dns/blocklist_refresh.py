"""Background worker that refreshes the blocklist on a schedule."""

from __future__ import annotations

import logging
import threading
import time

from voidad_dns.blocklist import Blocklist
from voidad_dns.blocklist_fetcher import fetch_and_save, is_stale
from voidad_dns.config import settings

logger = logging.getLogger(__name__)


class BlocklistRefreshWorker:
    """Periodically re-downloads the blocklist without blocking DNS queries."""

    def __init__(self, blocklist: Blocklist) -> None:
        self._blocklist = blocklist
        self._stop = threading.Event()
        self._thread: threading.Thread | None = None

    def start(self) -> None:
        if not settings.blocklist_auto_fetch:
            return
        self._thread = threading.Thread(
            target=self._run,
            name="voidad-blocklist-refresh",
            daemon=True,
        )
        self._thread.start()

    def stop(self) -> None:
        self._stop.set()
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=2.0)

    def _run(self) -> None:
        while not self._stop.wait(settings.blocklist_refresh_check_interval):
            if not is_stale(settings.blocklist_refresh_hours):
                continue
            try:
                count, source = fetch_and_save()
                reloaded = self._blocklist.reload()
                logger.info(
                    "Blocklist auto-refresh complete: %s domains (%s)",
                    reloaded or count,
                    source,
                )
            except Exception:
                logger.exception("Blocklist auto-refresh failed")
