/** Block popups, fake notifications, and common ad overlays on all sites */
(function () {
  "use strict";

  const BLOCKED_IFRAME =
    /ad|ads|banner|pop|track|analytics|doubleclick|syndication|exoclick|propeller|adsterra|clickadu|juicyads|trafficjunky|outbrain|taboola|sponsor|affiliate|casino|betting|hentai|scratch|chaturbate|stripchat|livejasmin|cam4|bongacams|redirect|onclick|\.cfd|\.sbs|\.shop|livingcost|begravesimula|1osb\.com/i;

  const STREAMING_HOST =
    /faselhd|shahid4u|egybest|cima4u|akwam|arabseed|movizland|witanime|anime4up|mycima|topcinema|egydead|xcinema|cimalina|egy\.|m\.egy/i;

  const STREAMING_OVERLAY_SELECTORS = [
    '[class*="faad"]',
    '[id*="faad"]',
    '[class*="faad"]',
    '[class*="promo-banner"]',
    '[class*="download-app"]',
    '[class*="app-download"]',
    'a[href*="chaturbate"]',
    'a[href*="casino"]',
    'a[href*="betting"]',
    'a[href*=".cfd"]',
    'a[href*=".shop"]',
  ];

  const OVERLAY_SELECTORS = [
    '[class*="popup-ad"]',
    '[id*="popup-ad"]',
    '[class*="ad-popup"]',
    '[class*="adsbox"]',
    '[class*="ad-container"]',
    '[class*="ad_banner"]',
    '[class*="ad-banner"]',
    '[id*="ad_banner"]',
    '[class*="sponsored"]',
    '[data-ad]',
    '[data-ad-slot]',
    "ins.adsbygoogle",
    ".adsbygoogle",
    "#overlay-ad",
    ".overlay-ad",
    ".pop-up-ad",
    ".popup-ad",
    '[id*="chaturbate"]',
    '[class*="chaturbate"]',
  ];

  function looksLikeFakeNotification(el) {
    if (!(el instanceof HTMLElement)) return false;
    const text = (el.innerText || "").slice(0, 800);
    const spamWords =
      /reply|mark as read|مقروء|رد|casino|hentai|scratch|betting|dating|sex|chaturbate|live sex|enter the room|gold coins|gratis/i;
    const style = getComputedStyle(el);
    const fixed = style.position === "fixed" || style.position === "sticky";
    const highZ = parseInt(style.zIndex, 10) > 5000;
    return fixed && highZ && spamWords.test(text);
  }

  function removeBadIframes(root = document) {
    root.querySelectorAll("iframe").forEach((iframe) => {
      const src = iframe.src || iframe.getAttribute("src") || "";
      if (BLOCKED_IFRAME.test(src)) {
        iframe.remove();
      }
    });
  }

  function removeOverlays(root = document) {
    for (const selector of OVERLAY_SELECTORS) {
      root.querySelectorAll(selector).forEach((el) => {
        if (el instanceof HTMLElement) el.remove();
      });
    }

    if (STREAMING_HOST.test(location.hostname)) {
      for (const selector of STREAMING_OVERLAY_SELECTORS) {
        root.querySelectorAll(selector).forEach((el) => {
          if (el instanceof HTMLElement) el.remove();
        });
      }
      root.querySelectorAll("a[target=_blank]").forEach((link) => {
        const href = (link.href || "").toLowerCase();
        if (BLOCKED_IFRAME.test(href) || /\.(cfd|sbs|shop)(\?|$)/.test(href)) {
          link.remove();
        }
      });
    }

    root.querySelectorAll("div, aside, section, dialog").forEach((el) => {
      if (looksLikeFakeNotification(el)) {
        el.remove();
      }
    });
  }

  function clean() {
    removeBadIframes();
    removeOverlays();
  }

  clean();
  setInterval(clean, 200);

  const observer = new MutationObserver(clean);
  if (document.documentElement) {
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
