/** Talks to the local VoidAd DNS proxy (Layer 1) from the extension background worker. */
const DNS_PROXY_BASE = "http://127.0.0.1:8053";

export async function reportPageAds({ pageHost, pageUrl, adDomains }) {
  if (!adDomains?.length) return { ok: false, reason: "empty" };
  try {
    const res = await fetch(`${DNS_PROXY_BASE}/api/extension/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_host: pageHost,
        page_url: pageUrl,
        ad_domains: adDomains,
      }),
    });
    if (!res.ok) return { ok: false, reason: `http-${res.status}` };
    return await res.json();
  } catch {
    return { ok: false, reason: "dns-offline" };
  }
}

export async function fetchStreamingRules(hostname) {
  try {
    const q = hostname ? `?host=${encodeURIComponent(hostname)}` : "";
    const res = await fetch(`${DNS_PROXY_BASE}/api/extension/streaming-rules${q}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.selectors ?? [];
  } catch {
    return [];
  }
}

export async function pingDnsProxy() {
  try {
    const res = await fetch(`${DNS_PROXY_BASE}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}
