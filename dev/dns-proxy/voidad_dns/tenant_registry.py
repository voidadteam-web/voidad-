from __future__ import annotations

import json
import logging
import threading
import urllib.error
import urllib.request
from dataclasses import dataclass

from voidad_dns.config import settings

logger = logging.getLogger(__name__)


def _localhost_aliases(client_ip: str) -> tuple[str, ...]:
    if client_ip in ("127.0.0.1", "::1"):
        return ("127.0.0.1", "::1")
    return ()


@dataclass(frozen=True)
class TenantSettings:
    protection_enabled: bool = True
    anti_adware: bool = True
    anti_tracker: bool = True
    anti_phishing: bool = True
    enhanced_ad_blocking: bool = False


@dataclass(frozen=True)
class Tenant:
    user_id: str
    token: str
    home_ips: tuple[str, ...]
    is_active: bool
    settings: TenantSettings


class TenantRegistry:
    """Maps home network IPs to VoidAd user DNS policies."""

    def __init__(self) -> None:
        self._lock = threading.RLock()
        self._by_ip: dict[str, Tenant] = {}
        self._tenants: list[Tenant] = []

    def refresh_from_api(self) -> bool:
        if not settings.sync_url or not settings.sync_key:
            return False

        request = urllib.request.Request(
            settings.sync_url,
            headers={"Authorization": f"Bearer {settings.sync_key}"},
        )
        try:
            with urllib.request.urlopen(request, timeout=settings.sync_timeout) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            logger.warning("Tenant sync failed: %s", exc)
            return False

        tenants: list[Tenant] = []
        by_ip: dict[str, Tenant] = {}

        for raw in payload.get("tenants", []):
            tenant_settings = TenantSettings(
                protection_enabled=bool(
                    raw.get("settings", {}).get("protection_enabled", True)
                ),
                anti_adware=bool(raw.get("settings", {}).get("anti_adware", True)),
                anti_tracker=bool(raw.get("settings", {}).get("anti_tracker", True)),
                anti_phishing=bool(raw.get("settings", {}).get("anti_phishing", True)),
                enhanced_ad_blocking=bool(
                    raw.get("settings", {}).get("enhanced_ad_blocking", False)
                ),
            )
            tenant = Tenant(
                user_id=str(raw.get("userId", "")),
                token=str(raw.get("token", "")),
                home_ips=tuple(raw.get("homeIps", [])),
                is_active=bool(raw.get("isActive", True)),
                settings=tenant_settings,
            )
            tenants.append(tenant)
            if tenant.is_active:
                for ip in tenant.home_ips:
                    by_ip[ip] = tenant

        with self._lock:
            self._tenants = tenants
            self._by_ip = by_ip

        logger.info("Synced %d DNS tenants (%d IPs)", len(tenants), len(by_ip))
        return True

    def get_by_ip(self, client_ip: str) -> Tenant | None:
        with self._lock:
            tenant = self._by_ip.get(client_ip)
            if tenant:
                return tenant
            for alias in _localhost_aliases(client_ip):
                tenant = self._by_ip.get(alias)
                if tenant:
                    return tenant
            return None

    def should_filter(self, client_ip: str) -> bool:
        tenant = self.get_by_ip(client_ip)
        if tenant is None:
            return True
        return tenant.is_active and tenant.settings.protection_enabled

    def list_tenants(self) -> list[Tenant]:
        with self._lock:
            return list(self._tenants)
