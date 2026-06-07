/** Bridge between voidad.com and the extension background worker */
(function () {
  "use strict";

  document.documentElement.dataset.voidadExtension = "true";

  async function flushBlockedStats() {
    chrome.runtime.sendMessage({ type: "TAKE_PENDING_EVENTS" }, async (response) => {
      const events = response?.events;
      if (!events?.length) return;
      try {
        await fetch("/api/protection/report", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ events }),
        });
      } catch {
        /* dashboard offline */
      }
    });
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    const data = event.data;
    if (!data || data.source !== "voidad-web") return;

    if (data.type === "SYNC_USER" || data.type === "PING") {
      chrome.runtime.sendMessage(
        {
          type: data.type,
          userId: data.userId,
          email: data.email,
          displayName: data.displayName,
          protectionEnabled: data.protectionEnabled,
          familyFilters: data.familyFilters ?? null,
        },
        (response) => {
          window.postMessage(
            {
              source: "voidad-extension",
              type: data.type === "PING" ? "PONG" : "SYNC_ACK",
              ok: Boolean(response?.ok),
              requestId: data.requestId,
            },
            window.location.origin,
          );
          if (data.type === "SYNC_USER" && response?.ok) {
            void flushBlockedStats();
          }
        },
      );
      return;
    }

    if (data.type === "GET_EXTENSION_STATE") {
      chrome.runtime.sendMessage({ type: "GET_STATE" }, (response) => {
        window.postMessage(
          {
            source: "voidad-extension",
            type: "EXTENSION_STATE",
            ok: Boolean(response),
            requestId: data.requestId,
            blockedCount: response?.blockedCount ?? 0,
            protectionEnabled: response?.protectionEnabled !== false,
            dnsProxyOnline: Boolean(response?.dnsProxyOnline),
          },
          window.location.origin,
        );
      });
    }
  });

  setInterval(flushBlockedStats, 8000);
  void flushBlockedStats();
})();
