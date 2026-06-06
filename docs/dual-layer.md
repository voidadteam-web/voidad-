# VoidAd Dual-Layer Protection

VoidAd is **not DNS-only**. It is a two-layer system designed for network-wide security **and** complete ad removal on modern streaming sites.

---

## The Problem: First-Party Ads

Standard DNS filtering (Pi-hole, AdGuard DNS, router blocklists) blocks **third-party** ad domains — servers like `doubleclick.net` or `popads.net`.

Streaming sites (faselhd, shahid4u, etc.) often serve ads from:

1. **The same domain** as the video (`faselhd.rip/banner…`) — DNS cannot block without breaking the site.
2. **Random rotator domains** (`.cfd`, `.shop`) that change daily.
3. **JavaScript popups** (`window.open`) that open even when the ad server is blocked.

**DNS alone is therefore insufficient for 100% ad removal on these sites.** This is a fundamental network limitation, not a VoidAd bug.

---

## VoidAd's Solution: Dual-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 2 — Browser Extension (UI Cleaner)                   │
│  • Hides first-party ad banners (CSS cosmetic rules)        │
│  • Blocks popup windows (window.open interceptor)             │
│  • Reports new ad domains → DNS proxy API                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ POST /api/extension/report
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 1 — DNS Proxy (Network Gatekeeper)                   │
│  • OISD Big blocklist (~450k domains)                       │
│  • Pattern + rotator TLD blocking (.cfd, .shop, …)          │
│  • Dynamic supplemental list from extension reports         │
│  • Protects ALL devices on the network (phones, TVs, …)     │
└─────────────────────────────────────────────────────────────┘
```

### Layer 1 — DNS (Network Gatekeeper)

| Role | Detail |
|------|--------|
| Scope | Entire home network (router DNS) |
| Blocks | 450k+ external ad/tracker/malware domains |
| Method | Returns `0.0.0.0` (black hole) |
| Limit | Cannot block ads served from the site's own domain |

### Layer 2 — Browser Extension (UI Cleaner)

| Role | Detail |
|------|--------|
| Scope | Chrome / Edge on user's machine |
| Blocks | In-page banners, overlays, popups |
| Method | CSS injection + DOM removal + `window.open` guard |
| Feeds Layer 1 | Sends discovered ad domains to `http://127.0.0.1:8053/api/extension/report` |

---

## Why This Beats Standard Ad-Blockers

| Feature | uBlock / AdBlock | VoidAd Dual-Layer |
|---------|------------------|-------------------|
| Network-wide (TV, phone) | ❌ Browser only | ✅ DNS Layer |
| First-party streaming ads | ⚠️ Filter lists | ✅ Site-specific CSS |
| Learns new rotator domains | ❌ Static lists | ✅ Extension → DNS feedback loop |
| Malware / tracker blocking at OS level | ❌ | ✅ DNS Layer |
| Account sync / VoidPoints | ❌ | ✅ VoidAd dashboard |

---

## API: Extension ↔ DNS Bridge

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/extension/report` | POST | Extension sends `{ page_host, ad_domains[] }` → DNS adds to supplemental blocklist |
| `/api/extension/streaming-rules` | GET | Returns CSS selectors for a hostname |
| `/api/extension/reports` | GET | Recent extension reports (debug) |

---

## TV, Netflix & YouTube Apps

Smart TV apps (Netflix, YouTube, Disney+, etc.) load video **and** ads from the **same domains** (`netflix.com`, `youtube.com`, `googlevideo.com`). DNS operates at the domain level — blocking those domains breaks the entire app.

| Platform | DNS (Layer 1) | Extension (Layer 2) | Practical ad-free option |
|----------|---------------|---------------------|--------------------------|
| YouTube in **browser** (PC/Mac) | Partial (sidebar) | ✅ Skip + hide in-video ads | VoidAd extension |
| **YouTube TV app** | ❌ In-video ads | ❌ No extension on TV | **YouTube Premium** |
| **Netflix TV app** (ad tier) | ❌ In-video ads | ❌ | **Netflix Standard/Premium** (no ads) |
| **Router DNS → TV** | ✅ Trackers, third-party ad domains | — | Set router DNS to VoidAd |

VoidAd DNS on the router still protects the TV from malware domains, pop-up ad networks, and telemetry — but not from platform-native video ads.

---

## Setup (Development)

1. Start DNS proxy: `cd dev/dns-proxy && ./run.sh`
2. Set Mac DNS to `127.0.0.1`
3. Load extension: `chrome://extensions` → Load unpacked → `extension/`
4. Disable Chrome Secure DNS
5. Browse streaming site — Layer 2 hides UI ads; Layer 1 blocks network requests

---

## For Evaluators / Judges

> **Q: Why doesn't DNS block all ads on faselhd?**  
> A: faselhd embeds some ads in its own HTML (first-party). DNS operates at the domain level and cannot inspect page content. VoidAd's browser layer handles what DNS cannot, and reports new third-party rotators back to DNS for network-wide blocking.

> **Q: How is VoidAd different from Pi-hole?**  
> A: Pi-hole is DNS-only. VoidAd adds a feedback loop: the browser discovers ad domains on aggressive sites and promotes them to the network blocklist automatically.
