/**
 * Layer 2 → Layer 1 bridge: report ad domains from streaming pages to the DNS proxy.
 * DNS cannot block first-party ads; the extension discovers third-party rotators on-page
 * and asks the local DNS API (127.0.0.1:8053) to block them network-wide.
 */
(function () {
  "use strict";

  const STREAMING_HOST =
    /faselhd|shahid4u|egybest|cima4u|akwam|arabseed|movizland|witanime|topcinema|egydead|xcinema|cimalina/i;

  const AD_DOMAIN =
    /chaturbate|casino|betting|popads|exoclick|propeller|adsterra|clickadu|juicyads|onclick|\.cfd|\.sbs|\.shop|livingcost|begravesimula|rtmark|affiliate|redirect|sponsor|doubleclick|syndication/i;

  const REPORT_INTERVAL_MS = 15000;
  const reported = new Set();

  function extractAdDomains(root = document) {
    const domains = new Set();

    root.querySelectorAll("iframe[src], a[href], script[src]").forEach((el) => {
      const raw = el.src || el.href || "";
      if (!raw || raw.startsWith("javascript:")) return;
      try {
        const host = new URL(raw, location.href).hostname.toLowerCase();
        if (!host || host === location.hostname) return;
        if (AD_DOMAIN.test(host) || AD_DOMAIN.test(raw)) {
          domains.add(host);
        }
      } catch {
        /* ignore malformed URLs */
      }
    });

    return [...domains];
  }

  function sendReport(domains) {
    const fresh = domains.filter((d) => !reported.has(d));
    if (!fresh.length) return;
    fresh.forEach((d) => reported.add(d));

    chrome.runtime.sendMessage({
      type: "REPORT_PAGE_ADS",
      pageHost: location.hostname,
      pageUrl: location.href,
      adDomains: fresh,
    });
  }

  function scan() {
    if (!STREAMING_HOST.test(location.hostname)) return;
    const domains = extractAdDomains();
    if (domains.length) sendReport(domains);
  }

  if (STREAMING_HOST.test(location.hostname)) {
    scan();
    setInterval(scan, REPORT_INTERVAL_MS);
    const observer = new MutationObserver(scan);
    if (document.documentElement) {
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src", "href"],
      });
    }
  }
})();
