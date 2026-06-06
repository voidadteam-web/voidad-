/** Popup UI — AdBlock-style blocked count + install landing */

const DASHBOARD_URL = "https://voidad.com/en/dashboard";

function hasExtensionApis() {
  return typeof chrome !== "undefined" && Boolean(chrome.runtime?.sendMessage);
}

function isFileMode() {
  return window.location.protocol === "file:";
}

function showInstallGuide() {
  document.getElementById("install-shell")?.removeAttribute("hidden");
  document.getElementById("extension-ui")?.setAttribute("hidden", "");
  document.body.className = "install-mode";
}

function showExtensionUi() {
  document.getElementById("install-shell")?.setAttribute("hidden", "");
  document.getElementById("extension-ui")?.removeAttribute("hidden");
  document.body.className = "popup-mode";
}

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    if (!hasExtensionApis()) {
      reject(new Error("NOT_INSTALLED"));
      return;
    }

    const timer = window.setTimeout(() => reject(new Error("TIMEOUT")), 5000);

    try {
      chrome.runtime.sendMessage(message, (response) => {
        window.clearTimeout(timer);
        const err = chrome.runtime.lastError;
        if (err) {
          reject(new Error(err.message || "RUNTIME_ERROR"));
          return;
        }
        resolve(response ?? {});
      });
    } catch (error) {
      window.clearTimeout(timer);
      reject(error instanceof Error ? error : new Error("SEND_FAILED"));
    }
  });
}

function formatBlockedLabel(count) {
  if (count === 0) return "Nothing to block here";
  if (count === 1) return "1 ad blocked";
  return `${count.toLocaleString()} ads blocked`;
}

function formatBlockedSub(state) {
  const dns = state?.dnsProxyOnline ? "DNS proxy online" : "DNS proxy offline";
  if (state?.email) return `${state.email} · synced · ${dns}`;
  return `Sign in at voidad.com · ${dns}`;
}

async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    if (button) {
      const prev = button.textContent;
      button.textContent = button.dataset.copied ?? "Copied!";
      window.setTimeout(() => {
        button.textContent = prev;
      }, 2000);
    }
  } catch {
    window.prompt("Copy:", text);
  }
}

function wireInstallGuide() {
  document.getElementById("copy-extensions-url")?.addEventListener("click", (event) => {
    void copyText("chrome://extensions", event.currentTarget);
  });
}

async function loadExtensionState() {
  const statusPill = document.getElementById("status-pill");
  const protectionLabel = document.getElementById("protection-label");
  const headlineEl = document.getElementById("blocked-headline");
  const countEl = document.getElementById("blocked-count");
  const subEl = document.getElementById("blocked-sub");
  const toggleBtn = document.getElementById("toggle");
  const dashboardLink = document.getElementById("dashboard");
  const settingsLink = document.getElementById("settings-link");

  if (dashboardLink) dashboardLink.href = DASHBOARD_URL;
  if (settingsLink) settingsLink.href = DASHBOARD_URL;

  if (!statusPill || !protectionLabel || !headlineEl || !countEl || !subEl || !toggleBtn) return;

  if (!hasExtensionApis()) {
    showInstallGuide();
    return;
  }

  showExtensionUi();
  toggleBtn.disabled = true;
  subEl.textContent = "Loading…";

  try {
    const state = await sendMessage({ type: "GET_STATE" });
    const enabled = state?.protectionEnabled !== false;
    const blocked = state?.blockedCount ?? 0;

    statusPill.classList.toggle("on", enabled);
    statusPill.classList.toggle("off", !enabled);
    protectionLabel.textContent = enabled ? "Protection Active" : "Protection Off";

    if (blocked === 0) {
      headlineEl.textContent = "Nothing to block here";
      countEl.textContent = "0";
    } else {
      headlineEl.textContent = "Ads blocked";
      countEl.textContent = blocked.toLocaleString();
    }

    subEl.textContent = formatBlockedSub(state);
    document.title = `VoidAd — ${formatBlockedLabel(blocked)}`;

    toggleBtn.disabled = false;
    toggleBtn.classList.toggle("off-mode", !enabled);
    toggleBtn.textContent = enabled ? "Turn Off Protection" : "Turn On Protection";
    toggleBtn.onclick = async () => {
      toggleBtn.disabled = true;
      try {
        await sendMessage({ type: "SET_PROTECTION", enabled: !enabled });
        await loadExtensionState();
      } catch {
        protectionLabel.textContent = "Worker error";
        subEl.textContent = "Reload at chrome://extensions";
        toggleBtn.disabled = true;
      }
    };
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    if (code === "NOT_INSTALLED") {
      showInstallGuide();
      return;
    }

    statusPill.classList.add("off");
    statusPill.classList.remove("on");
    protectionLabel.textContent = "Extension not responding";
    headlineEl.textContent = "Reload required";
    countEl.textContent = "!";
    subEl.textContent =
      code === "TIMEOUT"
        ? "Reload VoidAd at chrome://extensions"
        : "Open chrome://extensions → Reload VoidAd";
    toggleBtn.disabled = false;
    toggleBtn.textContent = "Open extensions";
    toggleBtn.onclick = () => {
      if (hasExtensionApis()) chrome.tabs?.create({ url: "chrome://extensions" });
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  wireInstallGuide();
  if (isFileMode() || !hasExtensionApis()) {
    showInstallGuide();
  }
  void loadExtensionState();
});
