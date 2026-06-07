/** Runs in page context — blocks popup ads that bypass DNS (maximum mode) */
(function () {
  "use strict";

  const STREAMING_HOST =
    /faselhd|shahid4u|egybest|cima4u|akwam|arabseed|movizland|witanime|topcinema|egydead|xcinema|cimalina|youtube\.com|youtu\.be|netflix\.com/i;

  const AD_URL =
    /chaturbate|stripchat|livejasmin|cam4|bongacams|casino|betting|hitnspin|gambl|1xbet|betway|stake\.|spin\.com|scratchcard|popads|adsterra|clickadu|exoclick|propellerads|juicyads|trafficjunky|onclick|redirect|affiliate|sponsor|livingcost|begravesimula|1osb\.com/i;

  const ROTATOR_TLD =
    /\.(cfd|sbs|bond|lat|monster|icu|buzz|shop|rest|hair|makeup|quest|pw|top|xyz|cam|click|tk|ml|ga|cf)(\/|:|\?|$)/i;

  const LONG_RANDOM_COM = /^https?:\/\/[a-z]{22,}\.com(\/|$|\?)/i;

  const STRICT_HOST = STREAMING_HOST.test(location.hostname);

  function isAdUrl(url) {
    const u = String(url ?? "").toLowerCase().trim();
    if (!u || u === "about:blank" || u.startsWith("javascript:")) return true;
    if (STRICT_HOST) {
      try {
        const host = new URL(u, location.href).hostname.toLowerCase();
        const here = location.hostname.toLowerCase();
        if (host !== here && !host.endsWith(".google.com") && !host.endsWith(".youtube.com")) {
          return true;
        }
      } catch {
        return true;
      }
    }
    return AD_URL.test(u) || ROTATOR_TLD.test(u) || LONG_RANDOM_COM.test(u);
  }

  const origOpen = window.open;
  window.open = function (url, target, features) {
    if (isAdUrl(url)) return null;
    return origOpen.call(window, url, target, features);
  };

  document.addEventListener(
    "click",
    (event) => {
      const link = event.target?.closest?.("a[href], area[href]");
      if (!link) return;
      const href = link.href || link.getAttribute("href") || "";
      const opensNew =
        link.target === "_blank" ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey;
      if (opensNew && isAdUrl(href)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );

  document.addEventListener(
    "auxclick",
    (event) => {
      if (event.button !== 1) return;
      const link = event.target?.closest?.("a[href]");
      if (link && isAdUrl(link.href)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );
})();
