/** Maximum mode — block popups, casino tabs, and external redirect ads on all sites */
(function () {
  "use strict";

  const STREAMING_HOST =
    /faselhd|shahid4u|egybest|cima4u|akwam|arabseed|movizland|witanime|topcinema|egydead|xcinema|cimalina|youtube\.com|youtu\.be|netflix\.com/i;

  const AD_URL =
    /chaturbate|stripchat|livejasmin|cam4|bongacams|casino|betting|hitnspin|gambl|1xbet|betway|stake|spin\.com|scratchcard|popads|adsterra|clickadu|exoclick|propellerads|juicyads|trafficjunky|onclick|redirect|affiliate|sponsor|livingcost|begravesimula|1osb\.com|poker|jackpot|lottery|roulette|slots/i;

  const ROTATOR_TLD =
    /\.(cfd|sbs|bond|lat|monster|icu|buzz|shop|rest|hair|makeup|quest|pw|top|xyz|cam|click|tk|ml|ga|cf|bet|casino|poker)(\/|:|\?|$)/i;

  const LONG_RANDOM_COM = /^https?:\/\/[a-z]{12,}\.com(\/|$|\?)/i;

  const SAFE_HOST_SUFFIXES = [
    "google.com",
    "youtube.com",
    "youtu.be",
    "gstatic.com",
    "googleapis.com",
    "googlevideo.com",
    "microsoft.com",
    "live.com",
    "office.com",
    "apple.com",
    "icloud.com",
    "github.com",
    "voidad.com",
    "voidad.de",
    "wikipedia.org",
    "netflix.com",
    "facebook.com",
    "instagram.com",
    "whatsapp.com",
    "twitter.com",
    "x.com",
  ];

  const STRICT_HOST = STREAMING_HOST.test(location.hostname);

  function isSafeHost(host, here) {
    const h = host.toLowerCase();
    const current = here.toLowerCase();
    if (!h || h === current || h.endsWith("." + current)) return true;
    return SAFE_HOST_SUFFIXES.some(
      (suffix) => h === suffix || h.endsWith("." + suffix),
    );
  }

  function isAdUrl(url) {
    const u = String(url ?? "").toLowerCase().trim();
    if (!u || u === "about:blank" || u.startsWith("javascript:")) return true;

    try {
      const host = new URL(u, location.href).hostname.toLowerCase();
      const here = location.hostname.toLowerCase();

      if (STRICT_HOST && !isSafeHost(host, here)) return true;

      if (!isSafeHost(host, here)) {
        if (AD_URL.test(u) || ROTATOR_TLD.test(u) || LONG_RANDOM_COM.test(u)) return true;
        if (STRICT_HOST) return true;
      }
    } catch {
      return true;
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
