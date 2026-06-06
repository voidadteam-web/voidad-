"""Tests for pattern-based DNS filtering."""

from __future__ import annotations

import tempfile
from pathlib import Path

from voidad_dns.blocklist import Blocklist
from voidad_dns.filter_engine import FilterEngine
from voidad_dns.pattern_filter import BlockReason, LearnedBlockLog, PatternFilter


def test_recursive_suffix_block() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        txt = Path(tmp) / "blocklist.txt"
        txt.write_text("ad-provider.net\n", encoding="utf-8")
        engine = FilterEngine(Blocklist(path=Path(tmp) / "blocklist.json"))
        hit = engine.check("anything.ad-provider.net")
        assert hit.blocked
        assert hit.reason == BlockReason.LIST


def test_pattern_blocks_adserver_label() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        txt = Path(tmp) / "blocklist.txt"
        txt.write_text("safe-site.org\n", encoding="utf-8")
        engine = FilterEngine(Blocklist(path=Path(tmp) / "blocklist.json"))
        hit = engine.check("cdn.adserver.evil.net")
        assert hit.blocked
        assert hit.reason == BlockReason.PATTERN
        assert "adserver" in hit.detail


def test_pattern_does_not_block_admin() -> None:
    pf = PatternFilter()
    hit = pf.match("admin.example.com")
    assert not hit.blocked


def test_learned_log_dedupes() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        log_path = Path(tmp) / "learned.jsonl"
        learned = LearnedBlockLog(path=log_path)
        learned.record("track.evil.net", "label:track", client="127.0.0.1")
        learned.record("track.evil.net", "label:track", client="127.0.0.1")
        assert learned.count() == 1
        assert len(learned.recent()) == 1
