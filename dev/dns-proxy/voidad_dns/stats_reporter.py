from __future__ import annotations

import json
import logging
import threading
import urllib.error
import urllib.request
from dataclasses import dataclass

from voidad_dns.config import settings

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class BlockEvent:
    user_id: str
    domain: str
    block_type: str
    client_ip: str


class StatsReporter:
    """Batch DNS block events to the VoidAd website."""

    def __init__(self) -> None:
        self._lock = threading.RLock()
        self._queue: list[BlockEvent] = []

    def enqueue(self, event: BlockEvent) -> None:
        with self._lock:
            self._queue.append(event)

    def pending_count(self) -> int:
        with self._lock:
            return len(self._queue)

    def flush(self) -> bool:
        if not settings.report_url or not settings.sync_key:
            return False

        with self._lock:
            if not self._queue:
                return True
            batch = self._queue[:200]
            self._queue = self._queue[200:]

        grouped: dict[str, list[dict]] = {}
        for event in batch:
            grouped.setdefault(event.user_id, []).append(
                {
                    "domain": event.domain,
                    "type": event.block_type,
                    "client_ip": event.client_ip,
                }
            )

        for user_id, events in grouped.items():
            payload = json.dumps({"userId": user_id, "events": events}).encode("utf-8")
            request = urllib.request.Request(
                settings.report_url,
                data=payload,
                headers={
                    "Authorization": f"Bearer {settings.sync_key}",
                    "Content-Type": "application/json",
                },
                method="POST",
            )
            try:
                with urllib.request.urlopen(request, timeout=settings.sync_timeout) as response:
                    json.loads(response.read().decode("utf-8"))
            except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
                logger.warning("Stats report failed for %s: %s", user_id, exc)
                with self._lock:
                    self._queue = batch + self._queue
                return False

        logger.info("Reported %d DNS block events", len(batch))
        return True
