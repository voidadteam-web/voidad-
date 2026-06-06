from __future__ import annotations

import logging
import threading

from voidad_dns.config import settings
from voidad_dns.stats_reporter import StatsReporter

logger = logging.getLogger(__name__)


class StatsFlushWorker:
    """Periodically flush DNS block stats to VoidAd."""

    def __init__(self, reporter: StatsReporter) -> None:
        self._reporter = reporter
        self._thread: threading.Thread | None = None
        self._stop = threading.Event()

    def start(self) -> None:
        if not settings.report_url:
            logger.info("Stats reporting disabled (VOIDAD_REPORT_URL not set)")
            return
        if self._thread and self._thread.is_alive():
            return
        self._thread = threading.Thread(target=self._run, name="voidad-stats-flush", daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._stop.set()
        if self._thread:
            self._thread.join(timeout=2.0)
        self._reporter.flush()

    def _run(self) -> None:
        while not self._stop.is_set():
            self._reporter.flush()
            self._stop.wait(settings.report_interval)
