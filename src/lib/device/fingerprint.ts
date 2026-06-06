const STORAGE_KEY = "voidad_device_fp";

function collectFingerprintParts(): string[] {
  if (typeof window === "undefined") return [];

  return [
    navigator.userAgent,
    navigator.language,
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    String(navigator.hardwareConcurrency ?? ""),
    navigator.platform,
    String(navigator.maxTouchPoints ?? 0),
  ];
}

export async function getDeviceFingerprint(): Promise<string> {
  if (typeof window === "undefined") return "";

  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) return cached;

  const raw = collectFingerprintParts().join("|");
  const data = new TextEncoder().encode(raw);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const hash = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  localStorage.setItem(STORAGE_KEY, hash);
  return hash;
}
