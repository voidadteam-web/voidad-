from __future__ import annotations

import socket

from voidad_dns.config import settings


class UpstreamResolver:
    """Forward raw DNS packets to a public upstream resolver."""

    def __init__(
        self,
        upstream: str | None = None,
        timeout: float | None = None,
    ) -> None:
        self._upstream = upstream or settings.upstream_dns
        self._timeout = timeout or settings.upstream_timeout

    def forward(self, data: bytes) -> bytes:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.settimeout(self._timeout)
            sock.sendto(data, (self._upstream, 53))
            response, _ = sock.recvfrom(4096)
            return response
