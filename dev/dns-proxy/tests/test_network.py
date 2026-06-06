from voidad_dns.network import is_client_allowed, parse_allowed_networks


def test_allows_home_lan_client() -> None:
    networks = parse_allowed_networks("192.168.0.0/24,127.0.0.0/8")
    assert is_client_allowed("192.168.0.42", networks)
    assert is_client_allowed("127.0.0.1", networks)


def test_rejects_public_client() -> None:
    networks = parse_allowed_networks("192.168.0.0/24")
    assert not is_client_allowed("8.8.8.8", networks)
    assert not is_client_allowed("203.0.113.5", networks)


def test_parse_skips_invalid_cidr() -> None:
    networks = parse_allowed_networks("192.168.0.0/24,not-a-network,10.0.0.0/8")
    assert len(networks) == 2
