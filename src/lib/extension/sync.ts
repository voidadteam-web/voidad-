export const VOIDAD_WEB_SOURCE = "voidad-web";
export const VOIDAD_EXTENSION_SOURCE = "voidad-extension";

export type ExtensionSyncPayload = {
  userId: string;
  email: string;
  displayName?: string;
  protectionEnabled?: boolean;
};

function postToExtension<T>(type: "PING" | "SYNC_USER", payload: Record<string, unknown> = {}): Promise<T> {
  return new Promise((resolve) => {
    const requestId = crypto.randomUUID();
    const timeout = window.setTimeout(() => {
      window.removeEventListener("message", onMessage);
      resolve({ ok: false } as T);
    }, 1500);

    function onMessage(event: MessageEvent) {
      if (event.source !== window) return;
      const data = event.data;
      if (data?.source !== VOIDAD_EXTENSION_SOURCE || data.requestId !== requestId) return;
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

export const CHROME_EXTENSION_INSTALL_URL =
  "https://chrome.google.com/webstore/category/extensions";

/** Load unpacked extension during development */
export const EXTENSION_DEV_PATH = "extension/";
