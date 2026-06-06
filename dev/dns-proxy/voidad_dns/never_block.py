"""Domains that must never be blocked — VoidAd site, CDN, auth, upstream DNS."""

from __future__ import annotations

from voidad_dns.blocklist import normalize_domain

# Suffixes always allowed (VoidAd app, hosting, auth, resolvers).
NEVER_BLOCK_SUFFIXES: frozenset[str] = frozenset(
    {
        "voidad.com",
        "voidad.de",
        "vercel.app",
        "vercel-dns.com",
        "supabase.co",
        "googleusercontent.com",
        "gstatic.com",
        "google.com",
        "googleapis.com",
        "cloudflare.com",
        "cloudflare-dns.com",
        "github.com",
        "githubusercontent.com",
    }
)


def is_never_block(domain: str) -> bool:
    name = normalize_domain(domain)
    if not name:
        return False
    for suffix in NEVER_BLOCK_SUFFIXES:
        if name == suffix or name.endswith(f".{suffix}"):
            return True
    return False
