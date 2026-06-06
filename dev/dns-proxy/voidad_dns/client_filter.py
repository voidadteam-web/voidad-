from __future__ import annotations

import logging

from voidad_dns.config import settings
from voidad_dns.network import is_client_allowed, parse_allowed_networks

logger = logging.getLogger(__name__)


class ClientFilter:
    """Restrict DNS queries to configured private/home networks."""

    def __init__(self) -> None:
        self._enabled = settings.client_filter_enabled
        self._networks = parse_allowed_networks(settings.allowed_cidrs)

    @property
    def enabled(self) -> bool:
        return self._enabled

    @property
    def allowed_cidrs(self) -> tuple[str, ...]:
        return tuple(str(network) for network in self._networks)

    def allows(self, client_ip: str) -> bool:
        if not self._enabled:
            return True
        allowed = is_client_allowed(client_ip, self._networks)
        if not allowed:
            logger.warning("Rejected DNS client outside whitelist: %s", client_ip)
        return allowed
