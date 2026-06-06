from __future__ import annotations

import ipaddress
import logging
import socket
from typing import Iterable

logger = logging.getLogger(__name__)

_PRIVATE_NETWORKS = (
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("127.0.0.0/8"),
)


def is_private_ipv4(ip: str) -> bool:
    try:
        addr = ipaddress.ip_address(ip)
    except ValueError:
        return False
    if not isinstance(addr, ipaddress.IPv4Address):
        return False
    return any(addr in network for network in _PRIVATE_NETWORKS)


def get_lan_ipv4(preferred_interfaces: Iterable[str] = ("en0", "en1", "wlan0", "eth0")) -> str | None:
    """Best-effort LAN IPv4 for binding DNS on the local network."""
    for iface in preferred_interfaces:
        ip = _interface_ipv4(iface)
        if ip and is_private_ipv4(ip):
            logger.debug("LAN IP via %s: %s", iface, ip)
            return ip

    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.connect(("8.8.8.8", 80))
            ip = sock.getsockname()[0]
            if is_private_ipv4(ip):
                return ip
    except OSError as exc:
        logger.debug("Outbound socket LAN detection failed: %s", exc)

    try:
        hostname = socket.gethostname()
        for info in socket.getaddrinfo(hostname, None, socket.AF_INET):
            ip = info[4][0]
            if is_private_ipv4(ip):
                return ip
    except OSError as exc:
        logger.debug("Hostname LAN detection failed: %s", exc)

    return None


def _interface_ipv4(name: str) -> str | None:
    try:
        import subprocess

        result = subprocess.run(
            ["ipconfig", "getifaddr", name],
            capture_output=True,
            text=True,
            timeout=2,
            check=False,
        )
        ip = result.stdout.strip()
        return ip or None
    except (FileNotFoundError, subprocess.TimeoutExpired, OSError):
        return None


def parse_allowed_networks(raw: str) -> tuple[ipaddress.IPv4Network | ipaddress.IPv6Network, ...]:
    networks: list[ipaddress.IPv4Network | ipaddress.IPv6Network] = []
    for part in raw.split(","):
        cidr = part.strip()
        if not cidr:
            continue
        try:
            networks.append(ipaddress.ip_network(cidr, strict=False))
        except ValueError as exc:
            logger.warning("Ignoring invalid CIDR %r: %s", cidr, exc)
    return tuple(networks)


def is_client_allowed(client_ip: str, allowed_networks: Iterable[ipaddress.IPv4Network | ipaddress.IPv6Network]) -> bool:
    try:
        addr = ipaddress.ip_address(client_ip)
    except ValueError:
        return False
    return any(addr in network for network in allowed_networks)
