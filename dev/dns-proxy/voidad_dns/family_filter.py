"""Tenant-aware family filters: TikTok, social, adult, gambling, custom keywords."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum

from voidad_dns.blocklist import normalize_domain
from voidad_dns.pattern_filter import BlockReason, FilterMatch


class FamilyBlockCategory(str, Enum):
    TIKTOK = "social"
    SOCIAL = "social"
    ADULT = "adult"
    GAMBLING = "gambling"
    KEYWORD = "keyword"
    SAFE_SEARCH = "adult"


@dataclass(frozen=True)
class FamilyFilterSettings:
    block_tiktok: bool = False
    block_social_media: bool = False
    block_adult_content: bool = False
    block_gambling: bool = True
    safe_search: bool = False
    blocked_keywords: tuple[str, ...] = ()


@dataclass(frozen=True)
class FamilyFilterMatch:
    blocked: bool
    category: FamilyBlockCategory | None = None
    detail: str = ""

    def to_filter_match(self) -> FilterMatch:
        if not self.blocked:
            return FilterMatch(blocked=False)
        return FilterMatch(
            blocked=True,
            reason=BlockReason.PATTERN,
            detail=f"family:{self.category.value if self.category else 'unknown'}:{self.detail}",
        )


# TikTok and ByteDance CDN / API hosts (apps + web).
TIKTOK_SUFFIXES: tuple[str, ...] = (
    "tiktok.com",
    "tiktokv.com",
    "tiktokcdn.com",
    "tiktokcdn-us.com",
    "tiktokd.org",
    "musical.ly",
    "byteoversea.com",
    "ibytedtos.com",
    "ibyteimg.com",
    "muscdn.com",
    "ttoverseas.us",
    "snssdk.com",
    "tiktokrow.com",
)

SOCIAL_SUFFIXES: tuple[str, ...] = (
    "instagram.com",
    "cdninstagram.com",
    "facebook.com",
    "fb.com",
    "fbcdn.net",
    "twitter.com",
    "x.com",
    "twimg.com",
    "snapchat.com",
    "sc-cdn.net",
    "reddit.com",
    "redd.it",
    "discord.com",
    "discordapp.com",
    "discord.gg",
    "twitch.tv",
    "twitchcdn.net",
    "threads.net",
    "ig.me",
    "fb.me",
)

ADULT_SUFFIXES: tuple[str, ...] = (
    "pornhub.com",
    "phncdn.com",
    "xvideos.com",
    "xnxx.com",
    "xhamster.com",
    "redtube.com",
    "youporn.com",
    "spankbang.com",
    "chaturbate.com",
    "onlyfans.com",
    "brazzers.com",
    "livejasmin.com",
    "stripchat.com",
    "bongacams.com",
    "cam4.com",
    "adultfriendfinder.com",
    "hentai-foundry.com",
    "nhentai.net",
    "rule34.xxx",
)

ADULT_LABEL_SUBSTRINGS: tuple[str, ...] = (
    "porn",
    "xxx",
    "hentai",
    "nude",
    "sexchat",
    "adult",
)

GAMBLING_SUFFIXES: tuple[str, ...] = (
    "hitnspin.com",
    "stake.com",
    "bet365.com",
    "888casino.com",
    "pokerstars.com",
    "draftkings.com",
    "fanduel.com",
    "bwin.com",
    "williamhill.com",
    "betway.com",
    "1xbet.com",
    "pin-up.",
    "mostbet.",
    "parimatch.",
)

GAMBLING_LABEL_SUBSTRINGS: tuple[str, ...] = (
    "casino",
    "gambl",
    "betting",
    "jackpot",
    "slot",
    "poker",
    "roulette",
    "spin",
    "wager",
    "lottery",
)

# Safe-search enforcement: block known adult TLD patterns more aggressively.
SAFE_SEARCH_EXTRA_SUFFIXES: tuple[str, ...] = (
    "xvideos.",
    "pornhub.",
    "xnxx.",
)


def _domain_matches_suffix(domain: str, suffix: str) -> bool:
    if suffix.endswith("."):
        return domain.endswith(suffix) or f".{suffix}" in f".{domain}"
    return domain == suffix or domain.endswith(f".{suffix}")


def _domain_matches_any(domain: str, suffixes: tuple[str, ...]) -> bool:
    return any(_domain_matches_suffix(domain, suffix) for suffix in suffixes)


def _label_has_substring(domain: str, substrings: tuple[str, ...]) -> str | None:
    for label in domain.split("."):
        if len(label) < 4:
            continue
        lower = label.lower()
        for needle in substrings:
            if len(needle) >= 4 and needle in lower:
                return needle
    return None


def _keyword_match(domain: str, keywords: tuple[str, ...]) -> str | None:
    for raw in keywords:
        keyword = raw.strip().lower()
        if len(keyword) < 3:
            continue
        for label in domain.split("."):
            if keyword in label.lower():
                return keyword
    return None


def check_family_filters(domain: str, settings: FamilyFilterSettings) -> FamilyFilterMatch:
    """Return whether domain should be blocked by tenant family policy."""
    normalized = normalize_domain(domain)
    if not normalized:
        return FamilyFilterMatch(blocked=False)

    if settings.block_tiktok and _domain_matches_any(normalized, TIKTOK_SUFFIXES):
        return FamilyFilterMatch(
            blocked=True,
            category=FamilyBlockCategory.TIKTOK,
            detail="tiktok",
        )

    if settings.block_social_media and _domain_matches_any(normalized, SOCIAL_SUFFIXES):
        return FamilyFilterMatch(
            blocked=True,
            category=FamilyBlockCategory.SOCIAL,
            detail="social",
        )

    if settings.block_adult_content or settings.safe_search:
        if _domain_matches_any(normalized, ADULT_SUFFIXES):
            return FamilyFilterMatch(
                blocked=True,
                category=FamilyBlockCategory.ADULT,
                detail="adult_list",
            )
        if settings.safe_search and _domain_matches_any(
            normalized, SAFE_SEARCH_EXTRA_SUFFIXES
        ):
            return FamilyFilterMatch(
                blocked=True,
                category=FamilyBlockCategory.SAFE_SEARCH,
                detail="safe_search",
            )
        hit = _label_has_substring(normalized, ADULT_LABEL_SUBSTRINGS)
        if hit and settings.block_adult_content:
            return FamilyFilterMatch(
                blocked=True,
                category=FamilyBlockCategory.ADULT,
                detail=hit,
            )

    if settings.block_gambling:
        if _domain_matches_any(normalized, GAMBLING_SUFFIXES):
            return FamilyFilterMatch(
                blocked=True,
                category=FamilyBlockCategory.GAMBLING,
                detail="gambling_list",
            )
        hit = _label_has_substring(normalized, GAMBLING_LABEL_SUBSTRINGS)
        if hit:
            return FamilyFilterMatch(
                blocked=True,
                category=FamilyBlockCategory.GAMBLING,
                detail=hit,
            )

    keyword = _keyword_match(normalized, settings.blocked_keywords)
    if keyword:
        return FamilyFilterMatch(
            blocked=True,
            category=FamilyBlockCategory.KEYWORD,
            detail=keyword,
        )

    return FamilyFilterMatch(blocked=False)


def family_category_to_block_type(category: FamilyBlockCategory | None) -> str:
    if category is None:
        return "ad"
    return category.value
