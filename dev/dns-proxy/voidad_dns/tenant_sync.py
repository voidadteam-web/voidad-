from __future__ import annotations

import logging
import threading
import time

from voidad_dns.config import settings
from voidad_dns.tenant_registry import TenantRegistry

logger = logging.getLogger(__name__)


class TenantSyncWorker:
    """Background polling of VoidAd tenant configuration."""

    def __init__(self, registry: TenantRegistry) -> None:
        self._registry = registry
        self._thread: threading.Thread | None = None
        self._stop = threading.Event()

    def start(self) -> None:
        if not settings.sync_url:
            logger.info("Tenant sync disabled (VOIDAD_SYNC_URL not set)")
            return
        if self._thread and self._thread.is_alive():
            return
        self._registry.refresh_from_api()
        self._thread = threading.Thread(target=self._run, name="voidad-tenant-sync", daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._stop.set()
        if self._thread:
            self._thread.join(timeout=2.0)

    def _run(self) -> None:
        while not self._stop.is_set():
            self._registry.refresh_from_api()
            self._stop.wait(settings.sync_interval)
