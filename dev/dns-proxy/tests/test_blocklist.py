"""Tests for blocklist parsing and suffix matching."""

from __future__ import annotations

from voidad_dns.blocklist import Blocklist, normalize_domain
from voidad_dns.blocklist_fetcher import parse_blocklist_text


def test_parse_stevenblack_hosts_format() -> None:
    text = """
# StevenBlack hosts snippet
0.0.0.0 doubleclick.net
127.0.0.1 localhost
0.0.0.0 ads.example.com
"""
    domains = parse_blocklist_text(text)
    assert "doubleclick.net" in domains
    assert "ads.example.com" in domains
    assert "localhost" not in domains


def test_parse_oisd_abp_format() -> None:
    text = "||popads.net^\n||tracker.evil.org^\n"
    domains = parse_blocklist_text(text)
    assert "popads.net" in domains
    assert "tracker.evil.org" in domains


def test_subdomain_suffix_matching(tmp_path) -> None:
    txt_path = tmp_path / "blocklist.txt"
    txt_path.write_text("doubleclick.net\npopads.net\n", encoding="utf-8")

    blocklist = Blocklist(path=tmp_path / "blocklist.json")
    blocklist.reload()

    assert blocklist.is_blocked("doubleclick.net")
    assert blocklist.is_blocked("ad.doubleclick.net")
    assert blocklist.is_blocked("www.ad.doubleclick.net")
    assert blocklist.is_blocked("popads.net")
    assert not blocklist.is_blocked("google.com")
    assert not blocklist.is_blocked("notdoubleclick.net")


def test_normalize_domain() -> None:
    assert normalize_domain("Ad.DoubleClick.NET.") == "ad.doubleclick.net"
