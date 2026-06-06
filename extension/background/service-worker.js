import {
  fetchStreamingRules,
  pingDnsProxy,
  reportPageAds,
} from "./dns-proxy-client.js";

const DEFAULT_STATE = {
  protectionEnabled: true,
  userId: null,
  email: null,
  displayName: null,
  blockedCount: 0,
  pendingEvents: [],
  syncedAt: null,
  dnsProxyOnline: false,
};

function registerBlockListeners() {
  try {
    if (chrome.declarativeNetRequest?.onRuleMatched?.addListener) {
      chrome.declarativeNetRequest.onRuleMatched.addListener((info) => {
        void queueBlock(info.request.url);
      });
    }
  } catch (error) {
    console.warn("[VoidAd] onRuleMatched unavailable:", error);
  }

  try {
    if (chrome.declarativeNetRequest?.onRuleMatchedDebug?.addListener) {
      chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
        void queueBlock(info.request.url);
      });
    }
  } catch (error) {
    console.warn("[VoidAd] onRuleMatchedDebug unavailable:", error);
  }
}

function classifyDomain(domain) {
  const d = domain.toLowerCase();
  if (d.includes("tracker") || d.includes("analytics") || d.includes("pixel.")) {
    return "tracker";
  }
  return "ad";
}

async function getState() {
  const data = await chrome.storage.local.get(DEFAULT_STATE);
  return { ...DEFAULT_STATE, ...data };
}

async function setState(partial) {
  await chrome.storage.local.set(partial);
}

async function updateBadge() {
  const { protectionEnabled, blockedCount } = await getState();
  if (!protectionEnabled) {
    await chrome.action.setBadgeText({ text: "OFF" });
    await chrome.action.setBadgeBackgroundColor({ color: "#7f1d1d" });
    await chrome.action.setBadgeTextColor({ color: "#ffffff" });
    return;
  }
  const text = blockedCount > 0 ? (blockedCount > 999 ? "999+" : String(blockedCount)) : "";
  await chrome.action.setBadgeText({ text });
  await chrome.action.setBadgeBackgroundColor({ color: "#00ff99" });
  await chrome.action.setBadgeTextColor({ color: "#000000" });
}

async function queueBlock(url) {
  const state = await getState();
  if (!state.protectionEnabled) return;

  let domain = "unknown";
  try {
    domain = new URL(url).hostname;
  } catch {
    return;
  }

  const blockedCount = (state.blockedCount ?? 0) + 1;
  const pendingEvents = [...(state.pendingEvents ?? [])];

  pendingEvents.push({
    domain,
    type: classifyDomain(domain),
    client_ip: null,
  });
  if (pendingEvents.length > 100) {
    pendingEvents.splice(0, pendingEvents.length - 100);
  }

  await setState({ blockedCount, pendingEvents });
  await updateBadge();
}

async function syncUser(payload) {
  await setState({
    userId: payload.userId ?? null,
    email: payload.email ?? null,
    displayName: payload.displayName ?? null,
    protectionEnabled: payload.protectionEnabled !== false,
    syncedAt: new Date().toISOString(),
  });
  await updateBadge();
}

chrome.runtime.onInstalled.addListener(async () => {
  await bootstrap();
});

chrome.runtime.onStartup.addListener(async () => {
  await bootstrap();
});

async function bootstrap() {
  const state = await getState();
  if (state.blockedCount === undefined) {
    await setState({ protectionEnabled: true, blockedCount: 0, pendingEvents: [] });
  }
  const online = await pingDnsProxy();
  await setState({ dnsProxyOnline: online });
  await updateBadge();
}

registerBlockListeners();
bootstrap().catch((error) => console.error("[VoidAd] bootstrap failed:", error));

setInterval(async () => {
  const online = await pingDnsProxy();
  const state = await getState();
  if (state.dnsProxyOnline !== online) {
    await setState({ dnsProxyOnline: online });
  }
}, 30000);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  void (async () => {
    if (message?.type === "SYNC_USER") {
      await syncUser(message);
      sendResponse({ ok: true });
      return;
    }
    if (message?.type === "GET_STATE") {
      sendResponse(await getState());
      return;
    }
    if (message?.type === "SET_PROTECTION") {
      await setState({ protectionEnabled: Boolean(message.enabled) });
      await updateBadge();
      sendResponse({ ok: true });
      return;
    }
    if (message?.type === "TAKE_PENDING_EVENTS") {
      const state = await getState();
      const events = state.pendingEvents ?? [];
      await setState({ pendingEvents: [] });
      sendResponse({ events });
      return;
    }
    if (message?.type === "REPORT_PAGE_ADS") {
      const result = await reportPageAds({
        pageHost: message.pageHost,
        pageUrl: message.pageUrl,
        adDomains: message.adDomains ?? [],
      });
      if (result?.added_count) {
        const state = await getState();
        await setState({
          blockedCount: (state.blockedCount ?? 0) + result.added_count,
        });
        await updateBadge();
      }
      sendResponse(result);
      return;
    }
    if (message?.type === "GET_STREAMING_RULES") {
      const selectors = await fetchStreamingRules(message.hostname ?? "");
      sendResponse({ selectors });
      return;
    }
    sendResponse({ ok: false });
  })();
  return true;
});

chrome.runtime.onMessageExternal.addListener((message, _sender, sendResponse) => {
  void (async () => {
    if (message?.type === "SYNC_USER") {
      await syncUser(message);
      sendResponse({ ok: true, installed: true });
      return;
    }
    if (message?.type === "PING") {
      sendResponse({ ok: true, installed: true });
      return;
    }
    sendResponse({ ok: false });
  })();
  return true;
});
