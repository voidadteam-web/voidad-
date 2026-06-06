export const VOIDAD_WEB_SOURCE = "voidad-web";
export const VOIDAD_EXTENSION_SOURCE = "voidad-extension";

export type ExtensionSyncPayload = {
  userId: string;
  email: string;
  displayName?: string;
  protectionEnabled?: boolean;
};

export type ExtensionRuntimeState = {
  blockedCount: number;
  protectionEnabled: boolean;
  dnsProxyOnline: boolean;
};

type ExtensionMessageType = "PING" | "SYNC_USER" | "GET_EXTENSION_STATE";

function postToExtension<T>(
  type: ExtensionMessageType,
  payload: Record<string, unknown> = {},
): Promise<T> {
  return new Promise((resolve) => {
    const requestId = crypto.randomUUID();
    const expectedType =
      type === "PING" ? "PONG" : type === "GET_EXTENSION_STATE" ? "EXTENSION_STATE" : "SYNC_ACK";

    const timeout = window.setTimeout(() => {
      window.removeEventListener("message", onMessage);
      resolve({ ok: false } as T);
    }, 1500);

    function onMessage(event: MessageEvent) {
      if (event.source !== window) return;
      const data = event.data;
      if (data?.source !== VOIDAD_EXTENSION_SOURCE || data.requestId !== requestId) return;
      if (data.type !== expectedType) return;
      window.clearTimeout(timeout);
      window.removeEventListener("message", onMessage);
      resolve(data as T);
    }

    window.addEventListener("message", onMessage);
    window.postMessage(
      { source: VOIDAD_WEB_SOURCE, type, requestId, ...payload },
      window.location.origin,
    );
  });
}

export function isExtensionInstalled(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.voidadExtension === "true";
}

export async function pingExtension(): Promise<boolean> {
  const result = await postToExtension<{ ok?: boolean }>("PING");
  return Boolean(result.ok);
}

export async function syncExtensionUser(payload: ExtensionSyncPayload): Promise<boolean> {
  const result = await postToExtension<{ ok?: boolean }>("SYNC_USER", {
    userId: payload.userId,
    email: payload.email,
    displayName: payload.displayName ?? null,
    protectionEnabled: payload.protectionEnabled ?? true,
  });
  return Boolean(result.ok);
}

export async function getExtensionRuntimeState(): Promise<ExtensionRuntimeState | null> {
  const result = await postToExtension<{
    ok?: boolean;
    blockedCount?: number;
    protectionEnabled?: boolean;
    dnsProxyOnline?: boolean;
  }>("GET_EXTENSION_STATE");

  if (!result.ok) return null;

  return {
    blockedCount: result.blockedCount ?? 0,
    protectionEnabled: result.protectionEnabled !== false,
    dnsProxyOnline: Boolean(result.dnsProxyOnline),
  };
}

export const CHROME_EXTENSION_INSTALL_URL =
  "https://chrome.google.com/webstore/category/extensions";

/** Load unpacked extension during development */
export const EXTENSION_DEV_PATH = "extension/";
