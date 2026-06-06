/** Aggressive YouTube ad removal — runs in page context */
(function () {
  "use strict";

  function stripAds(obj) {
    if (!obj || typeof obj !== "object") return obj;
    delete obj.adPlacements;
    delete obj.adSlots;
    delete obj.playerAds;
    delete obj.adBreakHeartbeatParams;
    delete obj.adBreakParams;
    delete obj.adBreakUrlParams;
    if (Array.isArray(obj.adBreaks)) obj.adBreaks = [];
    if (Array.isArray(obj.adBreaksMetadata)) obj.adBreaksMetadata = [];
    if (Array.isArray(obj.adPlacements)) obj.adPlacements = [];
    if (obj.playerAds) obj.playerAds = {};
    return obj;
  }

  function deepStripAds(value) {
    if (!value || typeof value !== "object") return value;
    stripAds(value);
    if (Array.isArray(value)) {
      value.forEach(deepStripAds);
      return value;
    }
    Object.values(value).forEach(deepStripAds);
    return value;
  }

  const nativeParse = JSON.parse;
  JSON.parse = function (...args) {
    const result = nativeParse.apply(this, args);
    try {
      return deepStripAds(result);
    } catch {
      return result;
    }
  };

  const nativeFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await nativeFetch.apply(this, args);
    const url = String(args[0]?.url ?? args[0] ?? "");
    if (!/youtube\.com|googlevideo\.com|\/player|\/next|\/browse|\/search/.test(url)) {
      return response;
    }
    try {
      const clone = response.clone();
      const text = await clone.text();
      if (!text.includes("adPlacements") && !text.includes("adBreaks")) {
        return response;
      }
      const data = nativeParse(text);
      deepStripAds(data);
      return new Response(JSON.stringify(data), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    } catch {
      return response;
    }
  };

  function patchPlayerResponse() {
    if (window.ytInitialPlayerResponse) {
      deepStripAds(window.ytInitialPlayerResponse);
    }
    if (window.ytInitialData) {
      deepStripAds(window.ytInitialData);
    }
  }

  patchPlayerResponse();
  document.addEventListener("DOMContentLoaded", patchPlayerResponse);
  window.addEventListener("load", patchPlayerResponse);
  setInterval(patchPlayerResponse, 500);
})();
