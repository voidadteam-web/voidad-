/** Aggressive YouTube ad removal — runs in page context (Layer 2) */
(function () {
  "use strict";

  const AD_KEY =
    /^(adPlacements|adSlots|playerAds|adBreaks|adBreaksMetadata|adBreakHeartbeatParams|adBreakParams|adBreakUrlParams|adBreakServiceURL|adBreakForegroundUrl|adTagParameters|adSurveyUrl|adProgress|adDuration|clientAdvertiserId|instreamAdPlayerOverlay|playerLegacyDesktopYpcOfferRenderer|playerLegacyDesktopYpcTrailerRenderer)$/;

  function stripAds(obj, depth) {
    if (!obj || typeof obj !== "object" || (depth ?? 0) > 24) return obj;
    const d = (depth ?? 0) + 1;

    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) stripAds(obj[i], d);
      return obj;
    }

    for (const key of Object.keys(obj)) {
      if (AD_KEY.test(key) || (key.startsWith("ad") && /slot|break|placement|tag/i.test(key))) {
        if (Array.isArray(obj[key])) obj[key] = [];
        else if (obj[key] && typeof obj[key] === "object") obj[key] = {};
        else delete obj[key];
        continue;
      }
      stripAds(obj[key], d);
    }
    return obj;
  }

  function cloneStrip(value) {
    if (!value || typeof value !== "object") return value;
    try {
      return stripAds(JSON.parse(JSON.stringify(value)), 0);
    } catch {
      return stripAds(value, 0);
    }
  }

  const nativeParse = JSON.parse;
  JSON.parse = function (...args) {
    const result = nativeParse.apply(this, args);
    try {
      return stripAds(result, 0);
    } catch {
      return result;
    }
  };

  function hookGlobal(name) {
    if (Object.getOwnPropertyDescriptor(window, name)?.get) return;
    let stored;
    Object.defineProperty(window, name, {
      configurable: true,
      enumerable: true,
      get() {
        return stored;
      },
      set(v) {
        stored = cloneStrip(v);
      },
    });
  }

  hookGlobal("ytInitialPlayerResponse");
  hookGlobal("ytInitialData");

  function patchYtCfg() {
    const cfg = window.ytcfg;
    if (!cfg || cfg.__voidadPatched) return;
    const bind = (fn) => (typeof fn === "function" ? fn.bind(cfg) : null);
    const origSet = bind(cfg.set);
    const origGet = bind(cfg.get);
    if (origSet) {
      cfg.set = function (key, value) {
        const k = String(key);
        if (/PLAYER|INITIAL|INNERTUBE|AD|DATA/i.test(k)) {
          value = cloneStrip(value);
        }
        return origSet(key, value);
      };
    }
    if (origGet) {
      cfg.get = function (key) {
        const value = origGet(key);
        const k = String(key);
        if (/PLAYER|INITIAL|INNERTUBE|AD|DATA/i.test(k)) {
          return cloneStrip(value);
        }
        return value;
      };
    }
    cfg.__voidadPatched = true;
  }

  const nativeFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await nativeFetch.apply(this, args);
    const url = String(args[0]?.url ?? args[0] ?? "");
    if (!/youtube\.com|googlevideo\.com|\/player|\/next|\/browse|\/search|\/reel|\/watch/.test(url)) {
      return response;
    }
    try {
      const clone = response.clone();
      const text = await clone.text();
      if (!/adPlacements|adBreaks|playerAds|adSlots|adTagParameters/.test(text)) {
        return response;
      }
      const data = nativeParse(text);
      stripAds(data, 0);
      return new Response(JSON.stringify(data), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    } catch {
      return response;
    }
  };

  const xhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._voidadUrl = String(url ?? "");
    return xhrOpen.call(this, method, url, ...rest);
  };

  const xhrSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener(
      "readystatechange",
      function () {
        if (this.readyState !== 4 || typeof this.responseText !== "string") return;
        const url = this._voidadUrl ?? "";
        if (!/youtube\.com|googlevideo\.com|\/player|\/next|\/browse|\/search|\/reel|\/watch/.test(url)) {
          return;
        }
        if (!/adPlacements|adBreaks|playerAds|adSlots|adTagParameters/.test(this.responseText)) {
          return;
        }
        try {
          const parsed = nativeParse(this.responseText);
          stripAds(parsed, 0);
          const cleaned = JSON.stringify(parsed);
          Object.defineProperty(this, "responseText", { value: cleaned, configurable: true });
          Object.defineProperty(this, "response", { value: cleaned, configurable: true });
        } catch {
          /* ignore */
        }
      },
      false,
    );
    return xhrSend.apply(this, args);
  };

  function patchInline() {
    patchYtCfg();
    if (window.ytInitialPlayerResponse) {
      window.ytInitialPlayerResponse = cloneStrip(window.ytInitialPlayerResponse);
    }
    if (window.ytInitialData) {
      window.ytInitialData = cloneStrip(window.ytInitialData);
    }
  }

  patchInline();
  document.addEventListener("DOMContentLoaded", patchInline);
  window.addEventListener("load", patchInline);
  setInterval(patchInline, 250);
})();
