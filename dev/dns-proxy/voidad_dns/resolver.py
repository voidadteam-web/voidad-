from __future__ import annotations

import logging
import socket

from voidad_dns.config import settings

logger = logging.getLogger(__name__)


class UpstreamResolver:
    """Forward raw DNS packets to public upstream resolvers with fallback."""

    def __init__(
        self,
        upstream: str | None = None,
        fallback: str | None = None,
        timeout: float | None = None,
    ) -> None:
        primary = upstream or settings.upstream_dns
        secondary = fallback or settings.upstream_dns_fallback
        self._upstreams = tuple(
            dict.fromkeys(ip for ip in (primary, secondary) if ip.strip())
        )
        self._timeout = timeout or settings.upstream_timeout

    @property
    def upstreams(self) -> tuple[str, ...]:
        return self._upstreams

    def forward(self, data: bytes) -> bytes:
        last_error: Exception | None = None
        for upstream in self._upstreams:
            try:
                return self._query(upstream, data)
            except OSError as exc:
                last_error = exc
                logger.warning("Upstream DNS %s failed: %s", upstream, exc)
        if last_error:
            raise last_error
        raise RuntimeError("No upstream DNS configured")

    def _query(self, upstream: str, data: bytes) -> bytes:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.settimeout(self._timeout)
            sock.sendto(data, (upstream, 53))
            response, _ = sock.recvfrom(4096)
            return response
