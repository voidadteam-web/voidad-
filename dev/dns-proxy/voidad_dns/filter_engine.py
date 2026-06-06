"""Unified DNS filter: static blocklist (recursive) + pattern heuristics."""

from __future__ import annotations

from voidad_dns.blocklist import Blocklist, normalize_domain
from voidad_dns.pattern_filter import (
    BlockReason,
    FilterMatch,
    LearnedBlockLog,
    PatternFilter,
)


class FilterEngine:
    """
    Proactive filtering pipeline (fast path first):

    1. Static blocklist — O(depth) suffix walk, blocks ``*.doubleclick.net``
    2. Pattern filter   — O(depth) label heuristics for unknown ad domains
    3. Learned log      — records pattern hits for later review / promotion
    """

    def __init__(
        self,
        blocklist: Blocklist,
        pattern_filter: PatternFilter | None = None,
        learned_log: LearnedBlockLog | None = None,
    ) -> None:
        self._blocklist = blocklist
        self._patterns = pattern_filter or PatternFilter()
        self._learned = learned_log or LearnedBlockLog()

    @property
    def learned_log(self) -> LearnedBlockLog:
        return self._learned

    def check(self, domain: str, *, client: str = "", aggressive: bool = False) -> FilterMatch:
        normalized = normalize_domain(domain)

        if self._blocklist.is_blocked(normalized):
            return FilterMatch(
                blocked=True,
                reason=BlockReason.LIST,
                detail="recursive-suffix",
            )

        pattern_hit = self._patterns.match(normalized, aggressive=aggressive)
        if pattern_hit.blocked:
            self._learned.record(
                normalized,
                pattern_hit.detail,
                client=client,
                on_blocklist=False,
            )
            return pattern_hit

        return FilterMatch(blocked=False)

    def promote_learned(self, domain: str) -> str:
        """Add a reviewed learned domain to the permanent blocklist."""
        normalized = normalize_domain(domain)
        return self._blocklist.add(normalized)
