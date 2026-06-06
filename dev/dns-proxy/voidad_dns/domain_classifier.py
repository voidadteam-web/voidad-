from __future__ import annotations

TRACKER_DOMAINS = {
    "analytics.google.com",
    "google-analytics.com",
    "googletagmanager.com",
    "scorecardresearch.com",
    "hotjar.com",
    "mixpanel.com",
    "segment.io",
    "segment.com",
    "fullstory.com",
    "clarity.ms",
    "facebook.net",
    "connect.facebook.net",
    "pixel.facebook.com",
    "demdex.net",
    "omtrdc.net",
    "bluekai.com",
    "krxd.net",
    "quantserve.com",
    "mathtag.com",
    "rlcdn.com",
    "bat.bing.com",
    "analytics.tiktok.com",
    "mc.yandex.ru",
    "an.yandex.ru",
    "imrworldwide.com",
    "newrelic.com",
    "heap.io",
    "amplitude.com",
    "chartbeat.com",
    "parsely.com",
    "crazyegg.com",
    "mouseflow.com",
    "luckyorange.com",
    "statcounter.com",
    "clicky.com",
    "histats.com",
    "webtrekk.net",
    "gemius.pl",
}

PHISHING_DOMAINS = {
    "malware.com",
    "phishing.test",
    "evil.com",
    "secure-login-verify.com",
    "account-verify.net",
    "paypal-secure-login.com",
    "apple-id-verify.com",
    "microsoft-account-alert.com",
}


def classify_domain(domain: str) -> str:
    """Return block type: ad, tracker, or phishing."""
    normalized = domain.lower().strip().rstrip(".")
    if normalized in PHISHING_DOMAINS:
        return "phishing"
    if normalized in TRACKER_DOMAINS:
        return "tracker"
    for tracker in TRACKER_DOMAINS:
        if normalized == tracker or normalized.endswith(f".{tracker}"):
            return "tracker"
    for phish in PHISHING_DOMAINS:
        if normalized == phish or normalized.endswith(f".{phish}"):
            return "phishing"
    if any(
        part in normalized
        for part in ("tracker", "analytics", "telemetry", "metrics", "pixel.")
    ):
        return "tracker"
    return "ad"
