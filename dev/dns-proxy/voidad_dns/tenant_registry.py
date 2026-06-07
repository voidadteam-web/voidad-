from __future__ import annotations

import ipaddress
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
    profile_mode: str = "default"
    block_tiktok: bool = False
    block_social_media: bool = False
    block_adult_content: bool = False
    block_gambling: bool = True
    safe_search: bool = False
    blocked_keywords: tuple[str, ...] = ()


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
            raw_settings = raw.get("settings", {})
            raw_keywords = raw_settings.get("blocked_keywords") or []
            tenant_settings = TenantSettings(
                protection_enabled=bool(raw_settings.get("protection_enabled", True)),
                anti_adware=bool(raw_settings.get("anti_adware", True)),
                anti_tracker=bool(raw_settings.get("anti_tracker", True)),
                anti_phishing=bool(raw_settings.get("anti_phishing", True)),
                enhanced_ad_blocking=bool(
                    raw_settings.get("enhanced_ad_blocking", False)
                ),
                profile_mode=str(raw_settings.get("profile_mode", "default")),
                block_tiktok=bool(raw_settings.get("block_tiktok", False)),
                block_social_media=bool(raw_settings.get("block_social_media", False)),
                block_adult_content=bool(raw_settings.get("block_adult_content", False)),
                block_gambling=bool(raw_settings.get("block_gambling", True)),
                safe_search=bool(raw_settings.get("safe_search", False)),
                blocked_keywords=tuple(
                    str(k).strip().lower()
                    for k in raw_keywords
                    if isinstance(k, str) and str(k).strip()
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
            return self._match_home_subnet(client_ip) or self._lan_mode_default_tenant(
                client_ip
            )

    def _lan_mode_default_tenant(self, client_ip: str) -> Tenant | None:
        """In LAN mode, apply the synced home account to all private-network clients."""
        if not settings.lan_mode:
            return None
        try:
            client = ipaddress.ip_address(client_ip)
        except ValueError:
            return None
        if not isinstance(client, ipaddress.IPv4Address) or not client.is_private:
            return None
        for tenant in self._tenants:
            if tenant.is_active:
                return tenant
        return None

    def _match_home_subnet(self, client_ip: str) -> Tenant | None:
        """Apply tenant policy to any device on the same /24 as a registered home IP."""
        try:
            client = ipaddress.ip_address(client_ip)
        except ValueError:
            return None
        if not isinstance(client, ipaddress.IPv4Address) or not client.is_private:
            return None
        client_prefix = client.packed[:3]
        for tenant in self._tenants:
            if not tenant.is_active:
                continue
            for home_ip in tenant.home_ips:
                try:
                    home = ipaddress.ip_address(home_ip)
                except ValueError:
                    continue
                if (
                    isinstance(home, ipaddress.IPv4Address)
                    and home.is_private
                    and home.packed[:3] == client_prefix
                ):
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
