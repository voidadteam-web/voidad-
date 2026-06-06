"""Cosmetic rules for streaming sites (Layer 2 — browser UI cleaner)."""

from __future__ import annotations

# Hostname substring → CSS selectors to hide first-party ad banners/overlays
STREAMING_COSMETIC_RULES: list[dict] = [
    {
        "hosts": ["faselhd", "faselhds", "فاصل"],
        "selectors": [
            '[class*="faad"]',
            '[id*="faad"]',
            '[class*="promo"]',
            '[class*="download-app"]',
            '[class*="app-banner"]',
            'a[href*="chaturbate"]',
            'a[href*="casino"]',
            'a[target="_blank"][rel*="noopener"]',
            "iframe:not([src*='faselhd'])",
        ],
    },
    {
        "hosts": ["shahid4u", "shahid4u.", "shahid"],
        "selectors": [
            '[class*="ad-"]',
            '[id*="ad-"]',
            '[class*="banner"]',
            '[class*="popup"]',
            'a[href*="chaturbate"]',
            'a[href*=".cfd"]',
            'a[href*=".shop"]',
        ],
    },
    {
        "hosts": ["egybest", "cima4u", "akwam", "arabseed", "movizland", "topcinema"],
        "selectors": [
            '[class*="ads"]',
            '[id*="ads"]',
            '[class*="banner"]',
            '[class*="popup"]',
            "ins.adsbygoogle",
            ".adsbygoogle",
        ],
    },
]


def rules_for_host(hostname: str) -> list[str]:
    host = hostname.lower()
    selectors: list[str] = []
    for rule in STREAMING_COSMETIC_RULES:
        if any(token in host for token in rule["hosts"]):
            selectors.extend(rule["selectors"])
    return list(dict.fromkeys(selectors))


def all_rules() -> list[dict]:
    return STREAMING_COSMETIC_RULES
