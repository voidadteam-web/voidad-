from __future__ import annotations

import logging
import threading
from typing import TYPE_CHECKING

from dnslib.server import BaseResolver, DNSServer

from voidad_dns.config import settings
from voidad_dns.dns_handler import VoidAdDNSHandler
from voidad_dns.filter_engine import FilterEngine

if TYPE_CHECKING:
    from voidad_dns.request_log import RequestLog
    from voidad_dns.stats_reporter import StatsReporter
    from voidad_dns.tenant_registry import TenantRegistry

logger = logging.getLogger(__name__)


class _ResolverAdapter(BaseResolver):
    def __init__(self, handler: VoidAdDNSHandler) -> None:
        self._handler = handler

    def resolve(self, request, handler):  # noqa: ANN001, ANN201
        client = handler.client_address[0]
        return self._handler.resolve(request, client)


class DNSService:
    """Background DNS server bound to localhost only."""

    def __init__(
        self,
        filter_engine: FilterEngine,
        request_log: RequestLog,
        tenant_registry: TenantRegistry | None = None,
        stats_reporter: StatsReporter | None = None,
    ) -> None:
        self._filter_engine = filter_engine
        self._dns_handler = VoidAdDNSHandler(
            filter_engine,
            request_log,
            tenant_registry=tenant_registry,
            stats_reporter=stats_reporter,
        )
        self._resolver = _ResolverAdapter(self._dns_handler)
        self._server: DNSServer | None = None
        self._thread: threading.Thread | None = None

    @property
    def address(self) -> str:
        return f"{settings.dns_host}:{settings.dns_port}"

    def start(self) -> None:
        if self._thread and self._thread.is_alive():
            return
        if self._server is None:
            self._server = DNSServer(
                self._resolver,
                port=settings.dns_port,
                address=settings.dns_host,
                tcp=False,
            )
        self._thread = threading.Thread(
            target=self._server.start_thread,
            name="voidad-dns",
            daemon=True,
        )
        self._thread.start()
        logger.info("DNS server listening on %s", self.address)

    def stop(self) -> None:
        if self._server and self._server.isAlive():
            self._server.stop()
        if self._thread:
            self._thread.join(timeout=2.0)
        self._server = None
        self._thread = None
        logger.info("DNS server stopped")
