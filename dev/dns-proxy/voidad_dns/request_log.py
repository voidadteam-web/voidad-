from __future__ import annotations

import threading
from collections import deque
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from typing import Literal

from voidad_dns.config import settings

Action = Literal["blocked", "forwarded", "error", "rejected"]


@dataclass(frozen=True)
class RequestLogEntry:
    timestamp: str
    domain: str
    qtype: str
    action: Action
    client: str
    detail: str = ""

    @classmethod
    def now(
        cls,
        *,
        domain: str,
        qtype: str,
        action: Action,
        client: str,
        detail: str = "",
    ) -> RequestLogEntry:
        return cls(
            timestamp=datetime.now(timezone.utc).isoformat(),
            domain=domain,
            qtype=qtype,
            action=action,
            client=client,
            detail=detail,
        )


class RequestLog:
    """In-memory ring buffer of recent DNS query events."""

    def __init__(self, max_entries: int | None = None) -> None:
        self._max_entries = max_entries or settings.log_max_entries
        self._lock = threading.RLock()
        self._entries: deque[RequestLogEntry] = deque(maxlen=self._max_entries)
        self._stats = {"blocked": 0, "forwarded": 0, "error": 0, "rejected": 0}

    def add(self, entry: RequestLogEntry) -> None:
        with self._lock:
            self._entries.appendleft(entry)
            self._stats[entry.action] = self._stats.get(entry.action, 0) + 1

    def recent(self, limit: int = 100) -> list[dict]:
        with self._lock:
            return [asdict(entry) for entry in list(self._entries)[:limit]]

    def stats(self) -> dict[str, int]:
        with self._lock:
            return dict(self._stats)

    def clear(self) -> None:
        with self._lock:
            self._entries.clear()
            self._stats = {"blocked": 0, "forwarded": 0, "error": 0, "rejected": 0}
