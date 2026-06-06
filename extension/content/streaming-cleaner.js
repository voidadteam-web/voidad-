/**
 * Layer 2 UI cleaner — hide first-party ad banners on streaming sites.
 * Fetches site-specific selectors from the DNS proxy API or uses built-in defaults.
 */
(function () {
  "use strict";

  const STREAMING_HOST =
    /faselhd|shahid4u|egybest|cima4u|akwam|arabseed|movizland|witanime|topcinema|egydead|xcinema|cimalina/i;

  const DEFAULT_RULES = {
    faselhd: [
      '[class*="faad"]',
      '[id*="faad"]',
      '[class*="promo"]',
      '[class*="download-app"]',
      'a[href*="chaturbate"]',
      'a[href*="casino"]',
    ],
    shahid4u: [
      '[class*="ad-"]',
      '[class*="banner"]',
      '[class*="popup"]',
      'a[href*=".cfd"]',
      'a[href*=".shop"]',
    ],
  };

  function selectorsForHost(host) {
    const h = host.toLowerCase();
    const out = [];
    for (const [key, sels] of Object.entries(DEFAULT_RULES)) {
      if (h.includes(key)) out.push(...sels);
    }
    return out;
  }

  function injectCss(selectors) {
    if (!selectors.length) return;
    const id = "voidad-streaming-cleaner";
    if (document.getElementById(id)) return;
    const css = selectors
      .map(
        (sel) =>
          `${sel}{display:none!important;visibility:hidden!important;height:0!important;max-height:0!important;overflow:hidden!important;pointer-events:none!important;opacity:0!important;}`,
      )
      .join("\n");
    const style = document.createElement("style");
    style.id = id;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function applyRules(selectors) {
    injectCss(selectors);
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => {
        if (el instanceof HTMLElement) el.remove();
      });
    }
  }

  async function loadRemoteRules() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { type: "GET_STREAMING_RULES", hostname: location.hostname },
        (response) => {
          resolve(response?.selectors ?? []);
        },
      );
    });
  }

  async function init() {
    if (!STREAMING_HOST.test(location.hostname)) return;
    let selectors = selectorsForHost(location.hostname);
    try {
      const remote = await loadRemoteRules();
      if (remote.length) selectors = [...new Set([...selectors, ...remote])];
    } catch {
      /* offline */
    }
    applyRules(selectors);
    setInterval(() => applyRules(selectors), 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => void init());
  } else {
    void init();
  }
})();
