from voidad_dns.family_filter import FamilyFilterSettings, check_family_filters


def test_blocks_tiktok_when_enabled():
    settings = FamilyFilterSettings(block_tiktok=True)
    match = check_family_filters("api.tiktokv.com", settings)
    assert match.blocked
    assert match.detail == "tiktok"


def test_allows_tiktok_when_disabled():
    settings = FamilyFilterSettings(block_tiktok=False)
    match = check_family_filters("www.tiktok.com", settings)
    assert not match.blocked


def test_blocks_custom_keyword():
    settings = FamilyFilterSettings(blocked_keywords=("casino",))
    match = check_family_filters("play.casino-royal.net", settings)
    assert match.blocked
    assert match.detail == "casino"


def test_child_profile_gambling():
    settings = FamilyFilterSettings(block_gambling=True)
    match = check_family_filters("www.hitnspin.com", settings)
    assert match.blocked
